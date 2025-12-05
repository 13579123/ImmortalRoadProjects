import { Item } from "../../../database/Item";
import { Pack } from "../../../database/Pack";
import { ConditionData, MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import { MysqlTransection } from "../../../module/mysql/MysqlTransection";

export const service = {

  // 增加物品
  async addItemToPack(email: string , packLevel: number , itemId: number , count: number , transection?: MysqlTransection) {
    transection = transection || MysqlTableClass.getTransection()
    const item = await Item.queryOne<Item>({conditions: [{key: 'id' , value: itemId}] , transection}) as Item
    if (!item) return {
      item,
      rest: count
    }
    const packLen = (await Pack.query<Pack>({conditions: [{key: 'email' , value: email}] , selectFields: ['id'] , transection})).length
    const containerSize = (packLevel - 1) * 12 + 36
    // 如果是装备直接增加
    if (item.isEquipment === 1) {
      while (count > 0) {
        if (packLen + 1 > containerSize) return {
          item,
          rest: count
        }
        await Pack.create<Pack>({itemId: itemId , itemCount: 1 , email} , {transection})
        count--
      }
      return {
        item,
        rest: count
      }
    }
    // 查询背包是否有对应物品
    const packs = await Pack.query<Pack>({
      conditions: [{key: 'itemId' , value: itemId}] , 
      transection , order: {key: 'itemCount'} ,
      lockType: 'X LOCK'
    }) as Pack[]
    // 添加物品
    if (packs.length < 0) {
      while (count > 0) {
        if (packLen + 1 > containerSize) 
          return {
            item,
            rest: count
          }
        const addNum = item.maxCount > count ? count : item.maxCount
        count -= addNum
        await Pack.create<Pack>({itemCount: addNum , itemId , email} , {transection})
      }
    } else {
      for (let i = 0 ; count > 0 ; i++) {
        let addNum = 0
        if (packs[i]) {
          if (packs[i].itemCount >= item.maxCount) continue
          addNum = item.maxCount - packs[i].itemCount > count ? count : item.maxCount - packs[i].itemCount
          count = count - addNum
          packs[i].itemCount += addNum
          await Pack.update<Pack>(packs[i] , [{key: 'id' , value: packs[i].id}] , {transection})
        } else {
          if (packLen + 1 > containerSize) 
            return  {
              item,
              rest: count
            }
          addNum = item.maxCount > count ? count : item.maxCount
          count -= addNum
          await Pack.create<Pack>({email,itemId,itemCount: addNum} , {transection})
        }
      }
    }
    return {
      item,
      rest: count
    }
  },

  // 减少物品
  async reduceItemFromPack(email: string , itemId: number , count: number , transection?: MysqlTransection) {
    transection = transection || MysqlTableClass.getTransection()
    const packs = await Pack.query<Pack>({
      conditions: [{key: 'email' , value: email} , "and" , {key: 'itemId' , value: itemId}],
      lockType: 'X LOCK' ,
      transection
    }) as Pack[]
    let itemCount = 0
    packs.forEach(pack => itemCount = itemCount + pack.itemCount)
    if (itemCount < count) return false
    for (let i = packs.length - 1 ; count > 0 ; i--) {
      const reduceNum = packs[i].itemCount ? count : packs[i].itemCount
      count -= reduceNum
      packs[i].itemCount -= reduceNum
      if (packs[i].itemCount <= 0) await Pack.delete<Pack>([{key: 'id' , value: packs[i].id}] , {transection})
      else await Pack.update<Pack>(packs[i] , [{key: 'id' , value: packs[i].id}] , {transection})
    }
    if (count <= 0) return true
    return false
  },

  // 获取玩家的所有已经装备的装备
  async getAllEquipments(email: string): Promise<{item: Item , pack: Pack}[]> {
    // 获取已经装备的装备id
    const equipments = await Pack.query<Pack>(
      { conditions: [{key: "email" , value: email} , 'and' , {key: 'hasEquipment' , value: 1}] }
    );
    const equipmentIdList = equipments.map(p => p.itemId)
    // 获取根据id装备的具体数据
    let equipmentItems: {item: Item , pack: Pack}[] = []
    if (equipmentIdList.length > 0) {
      const conditions: ConditionData<Item>[] = [
        {key: 'isEquipment' , value: 1}
      ]
      conditions.push('and')
      conditions.push('(')
      equipmentIdList.forEach((id , index) => {
        if (index > 0) conditions.push('or')
        conditions.push({key: 'id' , value: id})
      })
      conditions.push(')')
      const items = await Item.query<Item>({conditions: [ ...conditions ]})
      const itemMap = new Map<number , Partial<Item>>()
      items.forEach((item) => { itemMap.set(item.id || -1 , item) })
      equipmentIdList.forEach((id: any , index: number) => {
        const item = itemMap.get(id) as Item
        if (!item) throw "拥有非法物品"
        equipmentItems.push({item: item , pack: equipments[index] as Pack})
      })
    }
    return equipmentItems
  },

  // 整理背包
  async tidyUp(email: string , transection?: MysqlTransection) {
    const packList = await Pack.query<Pack>({conditions: [
      {key: 'email' , value: email} ,
      'and' ,
      {key: 'hasEquipment' , value: 0}
    ] , transection}) as Pack[]
    const itemMap = new Map<number , Item>()
    const itemPackMap: Map<Item , Pack[]> = new Map
    const idSet = new Set<number>()
    packList.forEach(pack => idSet.add(pack.itemId))
    const itemCondition: ConditionData<Item>[] = []
    idSet.forEach(id => {
      itemCondition.push({key: 'id' , value: id})
      itemCondition.push('or')
    })
    itemCondition.pop()
    const itemList = await Item.query<Item>({conditions: itemCondition , transection}) as Item[]
    itemList.forEach((item) => { itemMap.set(item.id , item) })
    packList.forEach(pack => {
      const item = itemMap.get(pack.itemId)
      if (!item) throw pack.itemId + '代表的物品不存在'
      const packArr = itemPackMap.get(item)
      if (!packArr) itemPackMap.set(item , [pack])
      else packArr.push(pack)
    })
    const itemCountList: {item: Item , restCount: number}[] = []
    for (const item of itemPackMap.keys()) {
      const packs = itemPackMap.get(item)
      let count = 0
      packs?.forEach(pack => count += pack.itemCount)
      itemCountList.push({item , restCount: count})
    }
    await Pack.delete<Pack>([
      {key: 'email' , value: email},
      'and',
      {key: 'hasEquipment' , value: 0}
    ] , {transection})
    for (const itemCount of itemCountList) {
      while (itemCount.restCount > 0) {
        let addCount = 0
        if (itemCount.restCount > itemCount.item.maxCount) {
          addCount = itemCount.item.maxCount
          itemCount.restCount -= addCount
        }
        else {
          addCount = itemCount.restCount
          itemCount.restCount -= addCount
        }
        await Pack.create<Pack>({itemCount: addCount , itemId: itemCount.item.id , email: email , hasEquipment: 0})
      }
    }
  }

}

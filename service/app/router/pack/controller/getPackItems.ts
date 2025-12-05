import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import jsonwebtoken from 'jsonwebtoken'
import { UserProperty } from "../../../database/UserProperty";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { service } from "../service/service";
import { Account } from "../../../database/Account";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { Pack } from "../../../database/Pack";
import { Item } from "../../../database/Item";
import { ConditionData, MysqlTableClass } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function getPackItems() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    try {
      const packs = await Pack.query<Pack>({ 
        conditions: [{key: 'email' , value: email} , 'and' , {key: 'hasEquipment' , value: 0}],
        order: {key: 'id' , type: "asc"}
      })
      const packsIdList = packs.map(p => p.itemId)
      // 获取根据id装备的具体数据
      const resultItems: {item: Partial<Item> , pack: Partial<Pack>}[] = []
      if (packsIdList.length > 0) {
        const conditions: ConditionData<Item>[] = []
        packsIdList.forEach((id , index) => {
          if (index > 0) conditions.push('or')
          conditions.push({key: 'id' , value: id})
        })
        const packItems = await Item.query<Item>({conditions: conditions})
        const itemMap = new Map<number , Partial<Item>>()
        packItems.forEach((item) => { itemMap.set(item.id || -1 , item) })
        packsIdList.forEach((id: any , index: number) => {
          const item = itemMap.get(id) as Item
          if (!item) throw "拥有非法物品"
          resultItems.push({item , pack: packs[index]})
        })
      }
      resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , { packs: resultItems }))
    } catch (e) { next(e) } finally {
    }
  }
}
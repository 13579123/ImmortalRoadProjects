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
import { ITEM_MAP } from "../../../game/ITEM_MAP";

dotenv.config()

export function usePackItem() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const packId = req.body.packId , useCount = req.body.useCount
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      // 查看物品是否拥有
      const packs = await Pack.query<Pack>({
        conditions: [{key: "email" , value: email} , 'and' , {key: "id" , value: packId}],
        transection , lockType: 'X LOCK'
      })
      const pack = packs[0]
      if (!pack) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '对应物品不存在'))
      const items = await Item.query<Item>({conditions: [{key: 'id' , value: pack.itemId}] , transection})
      const item = items[0]
      if (!item) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '对应物品不存在'))
      // 是未装备的装备则装备
      if (item.isEquipment && !pack.hasEquipment) {
        // 卸下原来的装备
        const equipmentItems = await service.getAllEquipments(email)
        if (equipmentItems.length > 0) {
          let equipmentItem: {item: Item , pack: Pack}|null = null
          for (let i = 0; i < equipmentItems.length; i++) {
            const itemPack = equipmentItems[i]
            if (itemPack.item?.equipmentType === item.equipmentType)
            equipmentItem = itemPack
          }
          if (equipmentItem) {
            equipmentItem.pack.hasEquipment = 0
            await Pack.update<Pack>(equipmentItem.pack , [{key: "id" , value: equipmentItem.pack.id}] , {transection})
          }
        }
        pack.hasEquipment = 1
        const state = await ITEM_MAP.get(item.code || '')?.onEquipment(email , pack as Pack , {transection})
        if (state?.success === false) {
          await transection.rollback();
          return resp.send(getFail(CODE_RULE.SERVER_ERROR , state.message))
        }
        await Pack.update<Pack>(pack , [{key: "id" , value: packId}] , {transection})
      } 
      // 否则数量减少
      else if (!item.isEquipment) {
        pack.itemCount = (pack.itemCount || 1) - useCount
        pack.itemCount = pack.itemCount < 0 ? 0 : pack.itemCount
        const state = await ITEM_MAP.get(item.code || '')?.onUse(email , useCount , pack as Pack , {transection})
        if (state?.success === false) {
          await transection.rollback();
          return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , state.message))
        }
        if (pack.itemCount <= 0) await Pack.delete<Pack>([{key: "id" , value: packId}] , {transection})
        else await Pack.update<Pack>(pack , [{key: "id" , value: packId}] , {transection})
      }
      await transection.commit()
      return resp.send(getSuccess(CODE_RULE.SUCCESS , '使用成功'))
    } catch (e) { await transection.rollback();next(e); } finally {
      transection.commit()
    }
  }
}
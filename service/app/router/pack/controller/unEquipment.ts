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

export function unEquipment() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const packId = req.body.packId
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
      if (!item) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '不合法的物品'))
      // 是装备则卸下
      if (!item.isEquipment) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '不是装备哦'))
      pack.hasEquipment = 0
      const state = await ITEM_MAP.get(item.code || '')?.onUnEquipment(email , pack as Pack , {transection})
      if (state?.success === false) {
        await transection.rollback();
        return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , state.message))
      }
      await Pack.update<Pack>(pack , [{key: "id" , value: packId}] , {transection})
      await transection.commit()
      return resp.send(getSuccess(CODE_RULE.SUCCESS , state.message))
    } catch (e) { await transection.rollback();next(e) } finally {transection.commit()}
  }
}
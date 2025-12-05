import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";

export function createItem() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const item: Partial<Item> = req.body.item
    const itemByCode = await Item.queryOne({conditions: [{key: 'code' , value: item.code}]})
    if (itemByCode) return resp.send(getFail(CODE_RULE.SUCCESS , '物品编码已经存在'))
    if (item.isEquipment === 1 && !item.equipmentType)
      return resp.send(getFail(CODE_RULE.SUCCESS , '装备必须附带装备类型'))
    delete item.createTime
    delete item.id
    await Item.create<Item>(item)
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '创建成功'))
  }
}
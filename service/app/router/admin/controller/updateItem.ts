import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";

export function updateItem() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const item: Partial<Item> = req.body.item
    delete item.createTime
    await Item.update<Item>(item , [{key: 'id' , value: item.id}])
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '修改成功'))
  }
}
import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";
import { Monster } from "../../../database/Monster";

export function updateMonster() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const monster: Partial<Monster> = req.body.monster

    if (typeof monster.dropJson === 'object') monster.dropJson = JSON.stringify(monster.dropJson)
    delete monster.createTime

    await Monster.update<Monster>(monster , [{key: 'id' , value: monster.id}])
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '修改怪物信息成功'))
  }
}
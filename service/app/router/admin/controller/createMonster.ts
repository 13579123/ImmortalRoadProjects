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

export function createMonster() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const monster: Partial<Monster> = req.body.monster
    if (typeof monster.dropJson === 'object') monster.dropJson = JSON.stringify(monster.dropJson)
    delete monster.id
    delete monster.createTime
    let rate = 0;
    JSON.parse(monster.dropJson || "[]").forEach((drop: any) => rate + drop.rate)
    if (rate > 1) return resp.send(getFail(CODE_RULE.SUCCESS , '物品掉落率总和不能大于1'))
    await Monster.create<Monster>(monster)
    resp.send(getSuccess(CODE_RULE.SUCCESS , '添加成功'))
  }
}
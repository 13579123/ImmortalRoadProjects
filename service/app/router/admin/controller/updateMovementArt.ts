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
import { MoveMentArtsType } from "../../../game/MoveMentArtsType";
import { MovementMatialArts } from "../../../database/MovementsMartialArts";

export function updateMovementArt() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const movementArt: Partial<MovementMatialArts> = req.body.movementArt
    delete movementArt.createTime
    console.log(movementArt)
    await MovementMatialArts.update<MovementMatialArts>(movementArt , [{key: 'id' , value: movementArt.id}])
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '修改招式信息成功'))
  }
}
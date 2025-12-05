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
import { MovementMatialArts } from "../../../database/MovementsMartialArts";

export function deleteMovementArtById() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const conditions: ConditionData<MovementMatialArts>[] = []
    req.body.idList.forEach((id: number) => {
      conditions.push({key: 'id' , value: id})
      conditions.push('or')
    })
    conditions.pop()
    await MovementMatialArts.delete<MovementMatialArts>(conditions)
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '删除成功'))
  }
}
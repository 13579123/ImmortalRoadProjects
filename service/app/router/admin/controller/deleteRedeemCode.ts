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
import { RedeemCode } from "../../../database/RedeemCode";

export function deleteRedeemCode() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const conditions: ConditionData<RedeemCode>[] = []
    req.body.codeList.forEach((code: string) => {
      conditions.push({key: 'code' , value: code})
      conditions.push('or')
    })
    conditions.pop()
    await RedeemCode.delete<RedeemCode>(conditions)
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '删除成功'))
  }
}
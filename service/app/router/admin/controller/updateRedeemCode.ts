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
import { RedeemCode } from "../../../database/RedeemCode";

export function updateRedeemCode() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const redeem: Partial<RedeemCode> = req.body.redeem
    if (typeof redeem.rewardsJson === 'string') {
      try { JSON.parse(redeem.rewardsJson) } catch(e) {
        return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '错误的参数'))
      }
    } else if (Array.isArray(redeem.rewardsJson)) {
      try { redeem.rewardsJson = JSON.stringify(redeem.rewardsJson) } catch(e) {
        return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '错误的参数'))
      }
    } else resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '错误的参数'))
    delete redeem.createTime
    redeem.effectTime = new Date(redeem.effectTime as any).getTime()
    await RedeemCode.update<RedeemCode>(redeem , [{key: 'code' , value: redeem.code}])
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '修改兑换信息成功'))
  }
}
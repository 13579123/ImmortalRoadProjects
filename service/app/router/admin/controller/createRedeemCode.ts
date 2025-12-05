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

export function createRedeemCode() {
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
    const redeemCodeObj = await RedeemCode.queryOne<RedeemCode>({conditions: [{key: 'code' , value: redeem.code}]})
    if(redeemCodeObj) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '兑换码已经存在'))
    delete redeem.createTime
    redeem.effectTime = redeem.effectTime ? new Date(redeem.effectTime as any).getTime() : -1
    await RedeemCode.create<RedeemCode>(redeem)
    resp.send(getSuccess(CODE_RULE.SUCCESS , '添加成功'))
  }
}
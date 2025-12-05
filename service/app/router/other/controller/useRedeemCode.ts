import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { service } from "../service/service";
import { RedeemCode } from "../../../database/RedeemCode";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import {service as packService} from './../../pack/service/service'
import { RedeemCodeLog } from "../../../database/RedeemCodeLog";

dotenv.config()

export function useRedeemCode() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const code = req.body.code
    const transection = MysqlTableClass.getTransection()
    try {
      let property = await UserProperty.queryOne<UserProperty>({
        conditions: [{key: "email" , value: email}] , 
        transection , 
        lockType: 'X LOCK'
      })
      // 获取用户信息
      if (!property || !(property instanceof UserProperty)) return resp.send(getFail(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      // 获取兑换码信息
      const redeemCode = await RedeemCode.queryOne<RedeemCode>({
        conditions: [{key: 'code' , value: code}] , 
        transection ,
        lockType: 'X LOCK'
      }) as RedeemCode
      if (!redeemCode) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '兑换码不存在'))
      // 是否已经使用过
      const redeemCodeLog = await RedeemCodeLog.queryOne<RedeemCodeLog>({
        conditions: [{key: 'code' , value: code} , 'and' , {key: 'email' , value: email}] ,
        transection,
        lockType: 'X LOCK'
      })
      if (redeemCodeLog) return resp.send(getFail(CODE_RULE.SUCCESS , "这个账号已经使用过该验证码了" , null))
      // 兑换码过期
      if (((redeemCode.effectTime || 0) < Date.now()) && redeemCode.effectTime !== -1)
        return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '兑换码已经过期'))
      // 兑换码次数用尽
      if (redeemCode.useTime !== -1 && redeemCode.useTime === 0) 
        return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '你来晚了，兑换码的物品已经被拿光了'))
      // 奖励列表
      const reward: {itemId: number , count: number}[] = JSON.parse(redeemCode.rewardsJson || '[]')
      // 添加到背包
      for (let i = 0; i < reward.length; i++) 
        await packService.addItemToPack(email , property.packLevel , reward[i].itemId , reward[i].count , transection)
      await RedeemCode.update<RedeemCode>({useTime: redeemCode.useTime - 1} , [{key: 'code' , value: code}] , {transection})
      await RedeemCodeLog.create<RedeemCodeLog>({email , code} , {transection})
      await transection.commit()
      resp.send(getSuccess(CODE_RULE.SUCCESS , "使用成功"))
    } catch(e) {
      await transection.rollback() ; next(e)
    } finally { transection.commit() }
  }
}
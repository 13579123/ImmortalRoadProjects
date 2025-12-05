import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import { UserProperty } from "../../../database/UserProperty";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { Item } from "../../../database/Item";
import { Pack } from "../../../database/Pack";
import { ConditionData, MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import { MethodExercises } from "../../../database/MethodExercises";
import { service } from "../service/service";

dotenv.config()

export function getRoleProperty() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      let property = await UserProperty.queryOne<UserProperty>({conditions: [{key: "email" , value: email}] , lockType: 'X LOCK'})
      if (!property || !(property instanceof UserProperty)) return resp.send(getFail(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      // 获取最终属性
      const {finalProperty} = await service.getUserFinalProperty(email , property , transection)
      // 修为计算
      const lastTime = property.lastUpExpTime?.getTime() , 
        now = Date.now() ,
        timeExp = (finalProperty.comprehension / 2 + 5) * (Math.random() * 0.3 + 0.7) // 5秒获取的exp
      // 如果开启自动修炼则根据上一次获取修为的时间来计算修为
      if (property.autoCultivation === -1) {
        if (lastTime && lastTime < now && now - lastTime > 1000) {
          const time = now - lastTime
          const exp = Math.floor(timeExp * time / 5000)
          property.exp +=  Math.max(exp , 0)
          finalProperty.exp += Math.max(exp , 0)
          property.lastUpExpTime = new Date(now)
          await UserProperty.update<UserProperty>(property , [{key: 'email' , value: email}] , {transection})
        }
      } else if (now < property.autoCultivation) {
        const time = now - lastTime
        const exp = Math.floor(timeExp * time / 5000)
        property.exp +=  Math.max(exp , 0)
        finalProperty.exp +=  Math.max(exp , 0)
        property.lastUpExpTime = new Date(now)
        await UserProperty.update<UserProperty>(property , [{key: 'email' , value: email}] , {transection})
      } else if (property.autoCultivation > lastTime) {
        const time = property.autoCultivation - lastTime
        const exp = Math.floor(timeExp * time / 5000)
        property.exp += Math.max(exp , 0)
        finalProperty.exp +=  Math.max(exp , 0)
        property.lastUpExpTime = new Date(now)
        await UserProperty.update<UserProperty>(property , [{key: 'email' , value: email}] , {transection})
      }  else {
        property.lastUpExpTime = new Date(now)
        await UserProperty.update<UserProperty>(property , [{key: 'email' , value: email}] , {transection})
      }
      await transection.commit()
      return resp.send(getSuccess<Partial<UserProperty>>(CODE_RULE.SUCCESS , "获取成功" , finalProperty))
    } catch(e) { await transection.rollback() ; next(e) } finally {
      transection.commit()
    }
  }
  
}
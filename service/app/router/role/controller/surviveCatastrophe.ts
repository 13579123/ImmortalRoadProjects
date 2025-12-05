import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function surviveCatastrophe() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      let property = (await UserProperty.query<UserProperty>({conditions: [{key: "email" , value: email}] , transection}))[0]
      if (!property || !(property instanceof UserProperty)) return resp.send(getSuccess(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      const needExp = GLOBAL_SERVICE.getNextRealmExp(property.realm , property.detailRealm)
      if (needExp > property.exp) return resp.send(getSuccess(CODE_RULE.ARGUMENT_ERROR , '修为不足'))
      // 渡劫概率成功
      let success = false
      if (Math.random() * 100 > property.hijackRate) 
        property.exp = (property.exp - Math.ceil(property.exp * 0.1)) || 0
      else {
        success = true
        if (property.detailRealm >= 9) {
          property.realm += 1
          property.detailRealm = 0
        } else {
          property.detailRealm += 1
        }
        property.exp -= needExp
        if (property.realm > 2) property.hijackRate = 70
        if (property.realm > 4) property.hijackRate = 50
        if (property.realm > 6) property.hijackRate = 30
      }
      await UserProperty.update<UserProperty>(property , [{key: "email" , value: email}] , {transection})
      await transection.commit()
      resp.send(getFail(CODE_RULE.SUCCESS , success ? '渡劫成功' : '渡劫失败' , null))
    } catch(e) { next(e);console.log(e);await transection.rollback() } finally {
      transection.commit()
    }
  }
}
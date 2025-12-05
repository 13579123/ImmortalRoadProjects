import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function quenchingBody() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      let propertys = await UserProperty.query<UserProperty>({
        conditions: [{key: "email" , value: email}] , 
        transection , lockType: "X LOCK"
      })
      const property = propertys[0]
      if (!property || !(property instanceof UserProperty)) return resp.send(getSuccess(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      const needExp = GLOBAL_SERVICE.getNextRealmExp(property.bodyRealm , property.bodyDetailRealm)
      if (needExp > property.exp) return resp.send(getSuccess(CODE_RULE.ARGUMENT_ERROR , '修为不足'))
      if (property.bodyDetailRealm >= 9) {
        property.bodyRealm += 1
        property.bodyDetailRealm = 0
      } else {
        property.bodyDetailRealm += 1
      }
      property.exp -= needExp
      await UserProperty.update<UserProperty>(property , [{key: "email" , value: email}] , {transection})
      await transection.commit()
      resp.send(getFail(CODE_RULE.SUCCESS , '淬体成功' , null))
    } catch(e) {
      await transection.rollback()
      next(e)
    } finally {
      await transection.commit()
    }
  }
}
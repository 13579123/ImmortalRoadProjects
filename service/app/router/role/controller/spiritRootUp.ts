import { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import { Pack } from "../../../database/Pack";

dotenv.config()

export function spiritRootUp() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const propertys = await UserProperty.query<UserProperty>(
        {conditions: [{key: "email" , value: email}] , transection , lockType: "X LOCK"}
      )
      let property = propertys[0]
      if (!property || !(property instanceof UserProperty)) return resp.send(getSuccess(CODE_RULE.UNLOGIN , "属性信息不存在" , null))
      const needExp = GLOBAL_SERVICE.getNextRealmExp(0 , property.spiritRootLevel)
      if (property.exp < needExp) return resp.send(getSuccess(CODE_RULE.SUCCESS , "修为不足" , null))
      property.exp -= needExp
      property.spiritRootLevel += 1
      await UserProperty.update<UserProperty>(property , [{key: "email" , value: email}] , {transection})
      await transection.commit()
      return resp.send(getSuccess(CODE_RULE.SUCCESS , "灵根升级成功" , null))
    } catch (e) {
      await transection.rollback()
      next(e)
    } finally {
      transection.commit()
    }
  }
}
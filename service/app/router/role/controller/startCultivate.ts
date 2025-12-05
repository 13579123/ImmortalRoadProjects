import { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function startCultivate() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const propertys = await UserProperty.query<UserProperty>(
        {conditions: [{key: "email" , value: email}] , transection , lockType: "X LOCK"}
      )
      let property = propertys[0]
      if (!property || !(property instanceof UserProperty)) return resp.send(getSuccess(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      property.autoCultivation = Date.now() + 1000 * 60 * 5
      property.lastUpExpTime = new Date()
      await UserProperty.update<UserProperty>(property , [{key: "email" , value: email}] , {transection})
      await transection.commit()
      return resp.send(getSuccess(CODE_RULE.SUCCESS , "开始成功" , null))
    } catch (e) {
      await transection.rollback()
      next(e)
    } finally {
      transection.commit()
    }
  }
}
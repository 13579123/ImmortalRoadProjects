import { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function autoCultivate() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const propertys = await UserProperty.query<UserProperty>(
        {conditions: [{key: "email" , value: email}] , transection , lockType: "X LOCK"}
      )
      let property = propertys[0]
      if (!property || !(property instanceof UserProperty)) return resp.send(getSuccess(CODE_RULE.SUCCESS , "用户信息不存在" , null))
      let message = '自动修炼开始成功'
      if (req.body.type === 'stop' || property.realm < 4) {
        if (property.realm < 4) message = '境界不足'
        else {
          property.autoCultivation = Date.now()
          property.lastUpExpTime = new Date
          message = '停止修炼成功'
        }
      } else if (req.body.type === 'auto') {
        property.autoCultivation = -1
        message = '开始修炼成功'
      }
      await UserProperty.update<UserProperty>(property , [{key: "email" , value: email}] , {transection})
      await transection.commit()
      return resp.send(getSuccess(CODE_RULE.SUCCESS , message , null))
    } catch (e) {
      await transection.rollback()
      next(e)
    } finally {
      transection.commit()
    }
  }
}
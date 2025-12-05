import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import { UserSect } from "../../../database/UserSect";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import CODE_RULE from "../../../module/CODE_RULE";
import { Sect } from "../../../database/Sect";
import { UserProperty } from "../../../database/UserProperty";

export function joinSectByStar() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const star = parseInt(req.body.star)
    if (star < 1 || star > 9) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '宗门的星级不能小于1或大于9'))
    const transection = MysqlTableClass.getTransection()
    try {
      let property = await UserProperty.queryOne<UserProperty>({conditions: [{key: "email" , value: email}] , transection})
      if ((property?.realm || 0) < (star - 1) * 2) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '当前境界不够拜入该星级的宗门'))
      let userSect = await UserSect.queryOne<UserSect>({conditions: [{key: 'email' , value: email}] , transection})
      if (userSect !== void 0) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '请先退出当前宗门'))
      let sectList = await Sect.query<Sect>({conditions: [{key: 'level' , value: star}] , transection})
      const sect = sectList[Math.floor(Math.random() * sectList.length)]
      if (!sect) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '当前星级没有宗门'))
      userSect = new UserSect
      userSect.email = email
      userSect.sectId = sect.id
      await UserSect.create<UserSect>(userSect , { transection })
      resp.send(getSuccess(CODE_RULE.SUCCESS , '加入成功'))
    } catch (e) {
      await transection.rollback()
      next(e)
    } finally {
      await transection.commit()
    }
  }
}
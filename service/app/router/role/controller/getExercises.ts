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

dotenv.config()

export function getExercises() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const propertys = await UserProperty.query<UserProperty>({conditions: [{key: "email" , value: email}]})
      const property = propertys[0]
      if (!property || !(property instanceof UserProperty)) return resp.send(getSuccess(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      const exercisesMethods = await MethodExercises.query<MethodExercises>(
        {conditions: [{key: "id" , value: property.exercisesMethodId}] , transection}
      )
      let exercisesMethod = exercisesMethods[0]
      if (!exercisesMethod) {
        exercisesMethod = new MethodExercises()
        exercisesMethod.name = "基础吐纳决"
      }
      resp.send(getSuccess(CODE_RULE.SUCCESS , "获取成功" , exercisesMethod))
    } catch(e) { await transection.rollback();next(e) } finally {
      transection.commit()
    }
  }
  
}
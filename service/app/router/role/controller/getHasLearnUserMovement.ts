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
import { UserMovementArts } from "../../../database/UserMovementArts";
import { MovementMatialArts } from "../../../database/MovementsMartialArts";

dotenv.config()

// 获取所有已经学习过的招式
export function getHasLearnUserMovement() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    try {
      const userMovementArts = await UserMovementArts.query<UserMovementArts>({conditions: [{key: 'email' , value: email}]})
      if (userMovementArts.length <= 0) return resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , [new MovementMatialArts]))
      const queryCondition: ConditionData<MovementMatialArts>[] = []
      userMovementArts.forEach(userMovementArts => {
        queryCondition.push({key: 'id' , value: userMovementArts.movementArtsId})
        queryCondition.push('or')
      })
      queryCondition.pop()
      const movementArts = await MovementMatialArts.query({conditions: queryCondition})
      resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , [new MovementMatialArts , ...movementArts]))
    } catch(e) { next(e) }
  }
  
}
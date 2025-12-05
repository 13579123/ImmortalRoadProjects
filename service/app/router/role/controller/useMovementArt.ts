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

// 使用已经学习过的招式
export function useMovementArt() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const userMovementArt = await UserMovementArts.queryOne<UserMovementArts>({
        conditions: [{key: 'movementArtsId' , value: req.body.movementArtId} , 'and' , {key: 'email' , value: email}]
      })
      if (!userMovementArt && req.body.movementArtId !== 0) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '未学会该招式'))
      await UserProperty.update<UserProperty>({movementArtsId: req.body.movementArtId} , [{key: 'email' , value: email}])
      return resp.send(getSuccess(CODE_RULE.SUCCESS , '使用招式成功'))
    } catch(e) { next(e);console.log(e);await transection.rollback() } finally {
      transection.commit()
    }
  }
  
}
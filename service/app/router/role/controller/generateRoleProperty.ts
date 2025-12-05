import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import jsonwebtoken from 'jsonwebtoken'
import { UserProperty } from "../../../database/UserProperty";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { service } from "../service/service";
import { Account } from "../../../database/Account";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function generateRoleProperty() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const addProperty = new UserProperty()
      addProperty.email = email
      addProperty.sex = req.body.sex
      addProperty.roleId = req.body.roleId
      const roles = await Role.query<Role>({conditions: [{key: "id" , value: addProperty.roleId}] , transection})
      const role = roles[0]
      if (!role) addProperty.roleId = 1
      else {
        addProperty.power += role.power || 0
        addProperty.bone += role.bone || 0
        addProperty.physique += role.physique || 0
        addProperty.movement += role.movement || 0
        addProperty.wakan += role.wakan || 0
        addProperty.comprehension += role.comprehension || 0
        addProperty.luck += role.luck || 0
      }
      await UserProperty.create<UserProperty>(addProperty)
      if (req.body.nickname) {
        await Account.update<Account>(
          {nickname: req.body.nickname} , 
          [{key: 'email' , value: email}] , 
          {transection}
        )
      }
      await transection.commit()
      return resp.send(getSuccess(CODE_RULE.SUCCESS , "创建成功"))
    } catch (e) { await transection.rollback();next(e); } finally {
      transection.commit()
    }
  }
}
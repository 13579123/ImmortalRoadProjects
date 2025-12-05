import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { UserProperty } from "../../../database/UserProperty";
import { service } from "../service/service";

dotenv.config()

export function getNextRealmExp() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const realm = parseInt(req.query.realm as string) || 0
    const detailRealm = parseInt(req.query.detailRealm as string) || 0
    resp.send(getSuccess(CODE_RULE.SUCCESS , "获取成功" , {
      exp: GLOBAL_SERVICE.getNextRealmExp(realm , detailRealm)
    }))
  }
}
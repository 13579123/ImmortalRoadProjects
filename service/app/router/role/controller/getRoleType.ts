import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { Role } from "../../../database/Role";

dotenv.config()

export function getRoleType() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const roles = await Role.query<Role>({})
    resp.send(getSuccess(CODE_RULE.SUCCESS , "获取成功" , roles))
  }
}
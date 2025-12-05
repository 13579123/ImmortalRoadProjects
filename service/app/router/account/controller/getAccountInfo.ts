import e, { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import jsonwebtoken from 'jsonwebtoken'
import dotenv from "dotenv";
import { Account } from "../../../database/Account";
import CODE_RULE from "../../../module/CODE_RULE";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";

dotenv.config()

export function getAccountInfo() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const accountList = await Account.query<Account>({conditions: [{key: "email" , value: email}]})
    resp.send(getSuccess(CODE_RULE.SUCCESS , "获取成功" , accountList[0] || null))
  }
}
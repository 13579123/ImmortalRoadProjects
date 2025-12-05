import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import jsonwebtoken from 'jsonwebtoken'
import dotenv from "dotenv";
import { Account } from "../../../database/Account";
import CODE_RULE from "../../../module/CODE_RULE";

dotenv.config()

export function login() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const reallyCode = await redis.get("email:code:" + req.body.email)
    if (!reallyCode || reallyCode !== req.body.code) 
      return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , "验证码或者邮箱错误"))
    const token = jsonwebtoken.sign(req.body.email , process.env.TOKEN_KEY || "")
    const accounts = await Account.query<Account>({conditions: [{key: 'email' , value: req.body.email}]})
    if (accounts.length <= 0) 
      await Account.create<Account>({email: req.body.email , nickname: ""})
    else if (accounts[0].frozen === 1) return resp.send(getFail(400 , "该账号已经被冻结，请联系管理员解冻"))
    await redis.del("email:code:" + req.body.email)
    resp.send(getSuccess(CODE_RULE.SUCCESS , "登陆成功" , {token}))
  }
}
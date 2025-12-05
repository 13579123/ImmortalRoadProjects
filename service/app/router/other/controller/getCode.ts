import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";

export function getCode() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let code = ""
    for (let i = 0 ; i < 6 ; i++) 
      code += String.fromCharCode(Math.floor(Math.random() * 10) + 48)
    try {
      await sendMailer(
        req.body.email , 
        "不朽大道 验证码" , 
        `欢迎您加入我们的游戏，验证码<span style="color: #ad0;font-size: 30px;">${code}</span> 验证码5分钟有效，记得保密哦`
      )
    } catch (e) {
      return resp.send(getFail(200 , "获取验证码失败，请检查邮箱是否准确"))
    }
    redis.set("email:code:" + req.body.email , code , 60 * 5)
    resp.send(getSuccess(200 , "获取成功"))
  }
}
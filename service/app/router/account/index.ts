import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import { filterHeader } from "../../module/filter/filterHeader";
import CODE_RULE from "../../module/CODE_RULE";
import { login } from "./controller/login";
import { getAccountInfo } from "./controller/getAccountInfo";

const router = Router()

router.post(
  "/login" , 
  Api({ 
    method: "POST", 
    url: "/api/account/login", 
    comment: "用户登录获取验证码",
    group: "Account",
    requestExample: {
      email: "2242818464@qq.com",
      code: "123456"
    }
  }) ,
  filterBody([
    {
      key: "email" , 
      type: "string" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "邮箱不能为空")
    },
    {
      key: "code" , 
      type: "string" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "验证码不能为空")
    },
  ]),
  login()
)

router.get(
  "/getAccountInfo",
  Api({ 
    method: "GET", 
    url: "/api/account/getAccountInfo", 
    comment: "获取用户信息",
    group: "Account",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'}
  }) ,
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  getAccountInfo()
)

export default router
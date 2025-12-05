import { Router } from "express";
import { getCode } from "./controller/getCode";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import CODE_RULE from "../../module/CODE_RULE";
import { getRealmInfo } from "./controller/getRealmInfo";
import { getNextRealmExp } from "./controller/getNextRealmExp";
import { useRedeemCode } from "./controller/useRedeemCode";
import { filterHeader } from "../../module/filter/filterHeader";

const router = Router()

router.post(
  "/getCode" , 
  Api({ 
    method: "POST", 
    url: "/api/other/getCode", 
    comment: "获取邮箱验证码",
    group: "Other",
    requestExample: {
      email: "2242818464@qq.com"
    }
  }) ,
  filterBody([
    {
      key: "email" , 
      type: "string" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "邮箱不能为空")
    },
  ]),
  getCode()
)

router.get(
  "/getRealmInfo" , 
  Api({ 
    method: "GET", 
    url: "/api/other/getRealmInfo", 
    comment: "获取境界配置",
    group: "Other",
  }) ,
  getRealmInfo()
)

router.get(
  '/getNextRealmExp' ,
  Api({
    method: "GET", 
    url: "/api/other/getNextRealmExp", 
    comment: "获取渡劫所需要的修为",
    group: "Other",
    requestExample: {
      realm: 0,
      detailRealm: 0
    }
  }) ,
  getNextRealmExp()
)

router.post(
  '/useRedeemCode',
  Api({
    method: "POST", 
    url: "/api/other/useRedeemCode", 
    comment: "使用兑换码",
    group: "Other",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'},
    requestExample: {code: ''},
  }) ,
  filterBody([
    {key: 'code' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '无法识别兑换码')}
  ]),
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  useRedeemCode()
)

export default router
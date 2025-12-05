import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import { filterHeader } from "../../module/filter/filterHeader";
import CODE_RULE from "../../module/CODE_RULE";
import { refiningDan } from "./controller/refiningDan";
import { getHasLearnPrescription } from "./controller/getHasLearnPrescription";

const router = Router()

router.get(
  '/getHasLearnPrescription',
  Api({
    method: "GET", 
    url: "/api/folkPrescription/getHasLearnPrescription", 
    comment: "获取所有已经学习的炼丹方法",
    group: "FolkPrescription",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'},
  }) ,
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  getHasLearnPrescription(),
)

router.post(
  '/refiningDan',
  Api({
    method: "POST", 
    url: "/api/folkPrescription/refiningDan", 
    comment: "使用物品炼丹",
    group: "FolkPrescription",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'},
    requestExample: { 
      firstItemId: 0,
      firstItemCount: 0,
      twoItemId: 0,
      twoItemCount: 0,
    }
  }) ,
  filterBody([
    { key: "firstItemId", type: "number", required: true, failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品") },
    { key: "firstItemCount", type: "number", required: true, failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品") },
    { key: "twoItemId", type: "number", required: true, failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品") },
    { key: "twoItemCount", type: "number", required: true, failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品") },
  ]),
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  refiningDan(),
)

export default router
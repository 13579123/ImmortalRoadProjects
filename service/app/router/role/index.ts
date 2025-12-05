import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import { getRoleProperty } from "./controller/getRoleProperty";
import { filterHeader } from "../../module/filter/filterHeader";
import CODE_RULE from "../../module/CODE_RULE";
import { generateRoleProperty } from "./controller/generateRoleProperty";
import { getRoleType } from "./controller/getRoleType";
import { surviveCatastrophe } from "./controller/surviveCatastrophe";
import { quenchingBody } from "./controller/quenchingBody";
import { startCultivate } from "./controller/startCultivate";
import { getExercises } from "./controller/getExercises";
import { spiritRootUp } from "./controller/spiritRootUp";
import { autoCultivate } from "./controller/autoCultivate";
import { getHasLearnUserMovement } from "./controller/getHasLearnUserMovement";
import { useMovementArt } from "./controller/useMovementArt";

const router = Router()

router.get(
  "/getRoleType",
  Api({
    method: "GET",
    url: "/api/role/getRoleType", 
    comment: "获取玩家的所有身世",
    group: "Role",
  }) ,
  getRoleType()
)

router.get(
  "/getRoleProperty" , 
  Api({
    method: "GET", 
    url: "/api/role/getRoleProperty", 
    comment: "获取玩家数据",
    group: "Role",
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
  getRoleProperty()
)

router.post(
  "/generateRoleProperty" , 
  Api({
    method: "POST", 
    url: "/api/role/generateRoleProperty", 
    comment: "新增玩家数据",
    group: "Role",
    requestExample: { roleId: 1 , nickname: "昵称" , sex: 1}
  }) ,
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  filterBody([
    {key: "roleId" , type: "number"}, 
    {key: "nickname" , type: "string"}, 
    {key: "sex" , type: "number" , default: 1}, 
  ]),
  generateRoleProperty()
)

router.post(
  '/surviveCatastrophe' ,
  Api({
    method: "POST", 
    url: "/api/role/surviveCatastrophe", 
    comment: "玩家渡劫",
    group: "Role",
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
  surviveCatastrophe()
)

router.post(
  '/quenchingBody' ,
  Api({
    method: "POST", 
    url: "/api/role/quenchingBody", 
    comment: "玩家淬体",
    group: "Role",
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
  quenchingBody()
)

router.post(
  "/startCultivate" ,
  Api({
    method: "POST", 
    url: "/api/role/startCultivate", 
    comment: "开始修炼",
    group: "Role",
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
  startCultivate()
)

router.post(
  "/autoCultivate" ,
  Api({
    method: "POST", 
    url: "/api/role/autoCultivate", 
    comment: "自动修炼",
    group: "Role",
    requestExample: { type: "stop" },
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
  filterBody([
    {key: "type" , type: "string" , default: "auto"}, 
  ]),
  autoCultivate()
)

router.post(
  "/spiritRootUp" ,
  Api({
    method: "POST", 
    url: "/api/role/spiritRootUp", 
    comment: "提升灵根",
    group: "Role",
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
  spiritRootUp()
)

router.get(
  "/getExercises" ,
  Api({
    method: "GET", 
    url: "/api/role/getExercises", 
    comment: "获取用户修炼的功法",
    group: "Role",
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
  getExercises()
)

router.get(
  "/getHasLearnUserMovement" ,
  Api({
    method: "GET", 
    url: "/api/role/getHasLearnUserMovement", 
    comment: "获取用户所有学习过的招式",
    group: "Role",
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
  getHasLearnUserMovement()
)

router.post(
  "/useMovementArt" ,
  Api({
    method: "POST", 
    url: "/api/role/useMovementArt", 
    comment: "更改使用招式",
    group: "Role",
    requestExample: {movementArtId: 0},
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
  filterBody([
    {
      key: "movementArtId" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "招式未学习")
    }
  ]),
  useMovementArt()
)

export default router
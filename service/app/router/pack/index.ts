import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import { filterHeader } from "../../module/filter/filterHeader";
import CODE_RULE from "../../module/CODE_RULE";
import { getPackItems } from "./controller/getPackItems";
import { getItemDetailById } from "./controller/getItemDetailById";
import { filterQuery } from "../../module/filter/filterQuery";
import { getEquipment } from "./controller/getEquipment";
import { usePackItem } from "./controller/usePackItem";
import { unEquipment } from "./controller/unEquipment";
import { sellPackItem } from "./controller/sellPackItem";

const router = Router()

router.get(
  '/getPackItems' ,
  Api({
    method: "GET", 
    url: "/api/pack/getPackItems", 
    comment: "获取玩家背包物品",
    group: "Pack",
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
  getPackItems()
)

router.get(
  '/getItemDetailById',
  Api({
    method: "GET", 
    url: "/api/pack/getItemDetailById", 
    comment: "根据id获取具体物品信息",
    group: "Pack",
    requestExample: {
      idList: '1,3,5,2'
    }
  }) ,
  filterQuery([{
    key: "idList",
    required: true,
    failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "查询的id不能是空")
  }]),
  getItemDetailById()
)

router.get(
  '/getEquipment',
  Api({
    method: "GET", 
    url: "/api/pack/getEquipment", 
    comment: "获取当前装备的装备",
    group: "Pack",
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
  getEquipment()
)

router.post(
  '/usePackItem',
  Api({
    method: "POST", 
    url: "/api/pack/usePackItem", 
    comment: "使用/装备物品",
    group: "Pack",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'},
    requestExample: {
      packId: 1,
      useCount: 1,
    }
  }) ,
  filterBody([
    {
      key: "packId",
      type: "number",
      required: true,
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品")
    },
    {
      key: "useCount",
      type: "number"
    },
  ]),
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  usePackItem(),
)

router.post(
  '/unEquipment',
  Api({
    method: "POST", 
    url: "/api/pack/unEquipment", 
    comment: "卸下装备",
    group: "Pack",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'},
    requestExample: { packId: 1 }
  }) ,
  filterBody([
    {
      key: "packId",
      type: "number",
      required: true,
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品")
    }
  ]),
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  unEquipment(),
)

router.post(
  '/sellPackItem',
  Api({
    method: "POST", 
    url: "/api/pack/sellPackItem", 
    comment: "卖出物品",
    group: "Pack",
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'},
    requestExample: { packId: 1, sellCount: 1, }
  }) ,
  filterBody([
    {
      key: "packId",
      type: "number",
      required: true,
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , "请使用有效物品")
    },
    {
      key: "sellCount",
      type: "number"
    },
  ]),
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  sellPackItem(),
)

export default router
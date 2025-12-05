import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import { filterHeader } from "../../module/filter/filterHeader";
import CODE_RULE from "../../module/CODE_RULE";
import { getMapByWorld } from "./controller/getMapByWorld";
import { filterQuery } from "../../module/filter/filterQuery";
import { getMonsterByMap } from "./controller/getMonsterByMap";
import { fightWithMonster } from "./controller/fightWithMonster";

const router = Router()

router.get(
  '/getMapByWorld',
  Api({
    method: "GET",
    url: "/api/map/getMapByWorld",
    comment: "根据世界获取所有地图数据",
    group: "Map",
    requestExample: { world: 1 },
  }),
  filterQuery([
    {
      key: "world" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '必须传入世界类型 1 人间 2 仙界 3 虚空')
    }
  ]),
  getMapByWorld(),
)

router.get(
  '/getMonsterByMap',
  Api({
    method: "GET",
    url: "/api/map/getMonsterByMap",
    comment: "根据地图所有怪物数据",
    group: "Map",
    requestExample: { mapId: 1 },
  }),
  filterQuery([
    {
      key: "mapId" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '世界不存在')
    }
  ]),
  getMonsterByMap(),
)

router.post(
  '/fightWithMonster',
  Api({
    method: "POST",
    url: "/api/map/fightWithMonster",
    comment: "与怪物战斗并获取掉落物品",
    group: "Map",
    requestExample: { monsterId: 1 },
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'}
  }),
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
      key: "monsterId" , 
      required: true , 
      failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '没有对应的怪物信息')
    }
  ]),
  fightWithMonster(),
)

export default router
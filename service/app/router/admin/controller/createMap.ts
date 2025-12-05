import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";

export function createMap() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const map: Partial<Map> = req.body.map
    delete map.id
    delete map.createTime
    const hasMap = await Map.query<Map>({conditions: [{key: 'mapWorld' , value: map.mapWorld}]})
    if (hasMap.length >= 15) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '该世界地图已经到达上限'))
    await Map.create<Map>(map)
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '创建地图成功'))
  }
}
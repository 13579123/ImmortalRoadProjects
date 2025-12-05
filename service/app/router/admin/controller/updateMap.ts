import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";

export function updateMap() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const map: Partial<Map> = req.body.map
    delete map.createTime
    await Map.update<Map>(map , [{key: 'id' , value: map.id}])
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '创建地图成功'))
  }
}
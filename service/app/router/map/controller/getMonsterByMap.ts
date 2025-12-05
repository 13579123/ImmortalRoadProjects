import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import { Monster } from "../../../database/Monster";
import CODE_RULE from "../../../module/CODE_RULE";

export function getMonsterByMap() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const mapId = req.query.mapId as string
    const monsterList = await Monster.query<Monster>({conditions: [{key: "mapId" , value: mapId}]})
    resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , monsterList))
  }
}
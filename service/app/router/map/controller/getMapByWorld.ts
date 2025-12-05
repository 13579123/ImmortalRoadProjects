import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";

export function getMapByWorld() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const maps = await Map.query<Map>({
      conditions: [{key: 'mapWorld' , value: parseInt(req.query.world as string) || 1}],
      order: {key: 'mapLevel' , type: 'asc'}
    })
    resp.send(getSuccess(200 , "获取成功" , maps))
  }
}
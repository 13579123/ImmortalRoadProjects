import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";

export function getAllItem() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const maps = await Item.query<Item>()
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , maps))
  }
}
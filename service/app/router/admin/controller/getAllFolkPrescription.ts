import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { FolkPrescription } from "../../../database/FolkPrescription";
import router from "..";
import { Api } from "../../../module/swagger/Api";

export function getAllFolkPrescription() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const folkPrescription = await FolkPrescription.query<FolkPrescription>()
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , folkPrescription))
  }
}
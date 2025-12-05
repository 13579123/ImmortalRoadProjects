import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import CODE_RULE from "../../../module/CODE_RULE";
import { Item } from "../../../database/Item";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";
import { FolkPrescription } from "../../../database/FolkPrescription";

export function updateFolkPrescription() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const folkPrescription: Partial<FolkPrescription> = req.body.folkPrescription
    delete folkPrescription.createTime
    await FolkPrescription.update(folkPrescription ,[{key: 'code' , value: folkPrescription.code}])
    resp.send(getSuccess(CODE_RULE.SUCCESS , '丹方修改成功'))
  }
}
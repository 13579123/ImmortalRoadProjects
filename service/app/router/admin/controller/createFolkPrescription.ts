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

export function createFolkPrescription() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const folkPrescription: Partial<FolkPrescription> = req.body.folkPrescription
    delete folkPrescription.createTime
    const hasExist = await FolkPrescription.queryOne<FolkPrescription>({
      conditions: [
        {key: 'materialsMainItem' , value: folkPrescription.materialsMainItem},
        'and',
        {key: 'materialsMainItemNumber' , value: folkPrescription.materialsMainItemNumber},
        'and',
        {key: 'materialsOtherItem' , value: folkPrescription.materialsOtherItem},
        'and',
        {key: 'materialsOtherItemNumber' , value: folkPrescription.materialsOtherItemNumber},
      ]
    })
    if (hasExist) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '丹方/器方已经存在'))
    await FolkPrescription.create(folkPrescription)
    resp.send(getSuccess(CODE_RULE.SUCCESS , '丹方创建成功'))
  }
}
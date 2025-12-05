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
import { HasLearnFolkPrescription } from "../../../database/HasLearnFolkPrescription";

export function deleteFolkPrescription() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const conditions: ConditionData<FolkPrescription>[] = []
    const hasLearnFolkPrescriptionConditions: ConditionData<HasLearnFolkPrescription>[] = []
    req.body.codeList.forEach((code: string) => {
      conditions.push({key: 'code' , value: code})
      hasLearnFolkPrescriptionConditions.push({key: 'code' , value: code})
      conditions.push('or')
      hasLearnFolkPrescriptionConditions.push('or')
    })
    conditions.pop()
    hasLearnFolkPrescriptionConditions.pop()
    await HasLearnFolkPrescription.delete<HasLearnFolkPrescription>(hasLearnFolkPrescriptionConditions)
    await FolkPrescription.delete<FolkPrescription>(conditions)
    return resp.send(getSuccess(CODE_RULE.SUCCESS , '删除成功'))
  }
}
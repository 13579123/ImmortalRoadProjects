import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import jsonwebtoken from 'jsonwebtoken'
import { UserProperty } from "../../../database/UserProperty";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { service } from "../../pack/service/service";
import { Account } from "../../../database/Account";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { Pack } from "../../../database/Pack";
import { Item } from "../../../database/Item";
import { ConditionData, MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import { ITEM_MAP } from "../../../game/ITEM_MAP";
import { FolkPrescription } from "../../../database/FolkPrescription";
import { HasLearnFolkPrescription } from "../../../database/HasLearnFolkPrescription";

dotenv.config()

export function getHasLearnPrescription() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const hasLearnFolkPrescription = await HasLearnFolkPrescription.query<HasLearnFolkPrescription>(
      {conditions: [{key: 'email' , value: email}]}
    )
    if (hasLearnFolkPrescription.length <= 0) return resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , []))
    const folkPrescriptionCondition: ConditionData<FolkPrescription>[] = []
    hasLearnFolkPrescription.forEach(hasLearnFolk => {
      folkPrescriptionCondition.push({key: 'code' , value: hasLearnFolk.code})
      folkPrescriptionCondition.push('or')
    })
    folkPrescriptionCondition.pop()
    const folkPrescription = await FolkPrescription.query<FolkPrescription>({conditions: folkPrescriptionCondition})
    resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , folkPrescription))
  }
}
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

dotenv.config()

export function refiningDan() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const { firstItemId , firstItemCount , twoItemId , twoItemCount } = req.body
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      const property = await UserProperty.queryOne<UserProperty>({conditions: [{key: "email" , value: email}] , transection}) as UserProperty
      if (!property ) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
      const firstSuccess = await service.reduceItemFromPack(email , firstItemId , firstItemCount , transection)
      const twoSuccess = await service.reduceItemFromPack(email , twoItemId , twoItemCount , transection)
      if (!firstSuccess || !twoSuccess) {
        await transection.rollback()
        return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , "物品不足"))
      }
      const folkPrescription = await FolkPrescription.queryOne<FolkPrescription>({conditions: [
        {key: 'materialsMainItem' , value: firstItemId},
        'and',
        {key: 'materialsMainItemNumber' , value: firstItemCount},
        'and',
        {key: 'materialsOtherItem' , value: twoItemId},
        'and',
        {key: 'materialsOtherItemNumber' , value: twoItemCount},
      ] , transection}) as FolkPrescription
      const getNumber = Math.ceil(Math.random() * (folkPrescription.max - folkPrescription.min) + folkPrescription.min)
      const addResult = await service.addItemToPack(email , property.packLevel , folkPrescription.exportItemId , getNumber , transection)
      return resp.send(getSuccess(CODE_RULE.SUCCESS , "炼制成功" , { item: addResult.item , count: getNumber - addResult.rest }))
    } catch (e) {
      transection.rollback()
      next(e)
    } finally { await transection.commit() }
  }
}
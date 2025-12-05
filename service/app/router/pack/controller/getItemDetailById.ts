import e, { NextFunction, Request, Response } from "express";
import { getFail, getSuccess } from "../../../util/result";
import jsonwebtoken from 'jsonwebtoken'
import { UserProperty } from "../../../database/UserProperty";
import CODE_RULE from "../../../module/CODE_RULE";
import dotenv from "dotenv";
import { service } from "../service/service";
import { Account } from "../../../database/Account";
import { Role } from "../../../database/Role";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { Pack } from "../../../database/Pack";
import { Item } from "../../../database/Item";
import { QueryOptions } from "../../../module/mysql/MysqlTableClass";

dotenv.config()

export function getItemDetailById() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const idList = (req.query.idList as string).split(",")
    const queryOptions: QueryOptions<Item> = {}
    if (idList.length > 0) {
      queryOptions.conditions = []
      idList.forEach((idStr , index) => {
        if (index !== 0) queryOptions.conditions?.push('or')
        queryOptions.conditions?.push({key: 'id' , value: parseInt(idStr)})
      })
    }
    const items = await Item.query<Item>(queryOptions)
    const result: Partial<Item>[] = []
    idList.forEach((idStr) => {
      const id = parseInt(idStr)
      for (let i = 0; i < items.length; i++) {
        if (id === items[i].id) return result.push(items[i])
      }
    })
    resp.send(getSuccess(CODE_RULE.SUCCESS , '获取成功' , result))
  }
}
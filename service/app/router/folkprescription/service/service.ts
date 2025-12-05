import { Request , Response , NextFunction } from "express"
import jsonwebtoken from 'jsonwebtoken'
import dotenv from "dotenv";
import { UserProperty } from "../../../database/UserProperty";
import { MysqlTransection } from "../../../module/mysql/MysqlTransection";
import { Item } from "../../../database/Item";
import { MethodExercises } from "../../../database/MethodExercises";
import { Pack } from "../../../database/Pack";
import { ConditionData } from "../../../module/mysql/MysqlTableClass";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";

dotenv.config()

export const service = {


}
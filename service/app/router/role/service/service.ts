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

  async getUserFinalProperty(email: string , property: UserProperty , transection?: MysqlTransection) {
    // 获取已经装备的装备id
    const equipments = await Pack.query<Pack>(
      { conditions: [{key: "email" , value: email} , 'and' , {key: 'hasEquipment' , value: 1}] , transection, }
    );
    const equipmentIdList = equipments.map(p => p.itemId)
    // 获取根据id装备的具体数据
    let equipmentItems: Partial<Item>[] = []
    if (equipmentIdList.length > 0) {
      const conditions: ConditionData<Item>[] = [
        {key: 'isEquipment' , value: 1}
      ]
      conditions.push('and')
      conditions.push('(')
      equipmentIdList.forEach((id , index) => {
        if (index > 0) conditions.push('or')
        conditions.push({key: 'id' , value: id})
      })
      conditions.push(')')
      equipmentItems = await Item.query<Item>({conditions: [ ...conditions, ] , transection})
    }
    // 功法加成
    const exercisesMethods = await MethodExercises.query<MethodExercises>({
      conditions: [{key: "id" , value: property.exercisesMethodId}],
      transection
    })
    const exercisesMethod = exercisesMethods[0] as MethodExercises || new MethodExercises()
    // 获取最终属性
    return {
      finalProperty: GLOBAL_SERVICE.getFinalProperty(
        property , 
        equipmentItems.map(v => JSON.parse(v.extraDataJson || '{}')) ,
        exercisesMethod
      ),
      exercisesMethod,
      equipmentItems,
    }
  }

}
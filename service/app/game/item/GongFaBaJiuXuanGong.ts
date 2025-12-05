import { MethodExercises } from "../../database/MethodExercises";
import { Pack } from "../../database/Pack";
import { UserProperty } from "../../database/UserProperty";
import { ItemType, ItemTypeOption, OnUseSellEquipmentState } from "../ItemType";

// 功法 八九玄功
export class GongFaBaJiuXuanGong extends ItemType {
  public code: string = "gong fa ba jiu xuan gong"

  async onUse (email: string , num: number , pack: Pack , option: ItemTypeOption = {}):Promise<OnUseSellEquipmentState> {
    try {
      const property = await UserProperty.queryOne<UserProperty>({
        conditions: [{key: 'email' , value: email}] , 
        lockType: 'X LOCK',
        transection: option.transection
      })
      const exercise = await MethodExercises.queryOne<MethodExercises>({
        conditions: [{key: 'name' , value: '八九玄功'}]
      })
      if (!property || !exercise) {
        return {
          success: false,
          message: '用户或者功法不存在'
        }
      }
      property.exercisesMethodId = exercise.id
      await UserProperty.update<UserProperty>(
        property , 
        [{key: 'email' , value: email}] , 
        {transection: option.transection}
      )
      return {
        success: true,
        message: '使用成功'
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: '使用错误'
      }
    }
  }
}
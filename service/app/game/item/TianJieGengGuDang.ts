import { FolkPrescriptionLog } from "../../database/FolkPrescriptionLog";
import { Pack } from "../../database/Pack";
import { UserProperty } from "../../database/UserProperty";
import { ItemType, ItemTypeOption, OnUseSellEquipmentState } from "../ItemType";

// 天阶根骨丹
export class TianJieGengGuDang extends ItemType {
  public code: string = "tian jie geng gu dang"
  
  async onUse (email: string , num: number , pack: Pack , option: ItemTypeOption = {}): Promise<OnUseSellEquipmentState> {
    try {
      const property = await UserProperty.queryOne<UserProperty>({
        conditions: [{key: 'email' , value: email}] , 
        lockType: 'X LOCK',
        transection: option.transection
      })
      if (!property) {
        return {
          success: false,
          message: '用户信息错误'
        }
      }
      // 判断吃了多少药物
      const folkPrescriptionLog = await FolkPrescriptionLog.queryOne<FolkPrescriptionLog>({
        conditions: [{key: 'email' , value: email} , 'and' , {key: 'code' , value: this.code}]
      }) as FolkPrescriptionLog
      if (folkPrescriptionLog && folkPrescriptionLog.useCount >= 50) {
        return {
          success: false,
          message: '这种丹药使用到达上限'
        }
      }
      if (!folkPrescriptionLog) {
        await FolkPrescriptionLog.create<FolkPrescriptionLog>({email , code: this.code , useCount: 1} , {transection: option.transection})
      } else {
        await FolkPrescriptionLog.update<FolkPrescriptionLog>({useCount: folkPrescriptionLog.useCount + 1} , 
        [{key: 'email' , value: email} , 'and' , {key: 'code' , value: this.code}]  
        , {transection: option.transection})
      }
      // 属性增加
      property.bone = (property.bone as number) + 100 * num
      await UserProperty.update<UserProperty>(
        property , 
        [{key: 'email' , value: email}] , 
        {transection: option.transection}
      )
      return {
        success: true,
        message: "使用成功"
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
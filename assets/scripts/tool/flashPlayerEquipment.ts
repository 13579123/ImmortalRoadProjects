import util from "../../cc_module/util"
import { GLOBAL_OPTION } from "../GLOBAL_OPTION"
import { request } from "../request"

export async function flashPlayerEquipment() {
  const result = await request.get<any>("/api/pack/getEquipment")
  if (!result) return false
  if (!result.data.status) {
    util.alert.message({ message: result.data.message })
    return false
  }
  GLOBAL_OPTION.playerEquipment.weaponEquipment = null
  GLOBAL_OPTION.playerEquipment.helmetEquipment = null
  GLOBAL_OPTION.playerEquipment.clothesEquipment = null
  GLOBAL_OPTION.playerEquipment.shoesEquipment = null
  result.data.data.forEach(equip => {
    switch (equip.item.equipmentType) {
      case "weapon":
        GLOBAL_OPTION.playerEquipment.weaponEquipment = equip
        break;
      case "helmet":
        GLOBAL_OPTION.playerEquipment.helmetEquipment = equip
        break;
      case "clothes":
        GLOBAL_OPTION.playerEquipment.clothesEquipment = equip
        break;
      case "shoes":
        GLOBAL_OPTION.playerEquipment.shoesEquipment = equip
        break;
    }
  })
  return true
}
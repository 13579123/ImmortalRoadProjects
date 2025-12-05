import util from "../../cc_module/util"
import { GLOBAL_OPTION } from "../GLOBAL_OPTION"
import { request } from "../request"

export async function flashPackItems() {
  // 获取用户数据
  const result = await request.get<any>("/api/pack/getPackItems")
  if (!result) return false
  if (!result.data.status) {
    util.alert.message({ message: result.data.message })
    return false
  }
  GLOBAL_OPTION.packItems = result.data.data.packs
  return true
}
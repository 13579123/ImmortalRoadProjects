import util from "../../cc_module/util"
import { GLOBAL_OPTION } from "../GLOBAL_OPTION"
import { request } from "../request"

export async function flashRealmInfo() {
  const result = await request.get<any>("/api/other/getRealmInfo")
  if (!result) return false
  if (!result.data.status) {
    util.alert.message({ message: result.data.message })
    return false
  }
  GLOBAL_OPTION.realmInfo = result.data.data
  return true
}
import util from "../../cc_module/util"
import { GLOBAL_OPTION } from "../GLOBAL_OPTION"
import { request } from "../request"

export async function flashPlayerAccount() {
  // 获取用户数据
  const result = await request.get<any>("/api/account/getAccountInfo")
  if (!result) return false
  if (!result.data.status) {
    util.alert.message({ message: result.data.message })
    return false
  }
  if (!GLOBAL_OPTION.playerAccount) GLOBAL_OPTION.playerAccount = result.data.data
  else Object.keys(result.data.data).forEach(k => GLOBAL_OPTION.playerAccount[k] = result.data.data[k])
  return true
}
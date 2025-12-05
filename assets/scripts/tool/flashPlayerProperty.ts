import util from "../../cc_module/util"
import { GLOBAL_OPTION } from "../GLOBAL_OPTION"
import { request } from "../request"

export async function flashPlaterProperty() {
  const result = await request.get<any>("/api/role/getRoleProperty")
  if (!result) return false
  if (!result.data.status) {
    util.alert.message({ message: result.data.message })
    return false
  }
  if (!GLOBAL_OPTION.playerProperty) GLOBAL_OPTION.playerProperty = result.data.data
  else Object.keys(result.data.data).forEach(k => GLOBAL_OPTION.playerProperty[k] = result.data.data[k])
  // 获取下一阶肉体需要的数据
  const promise_1 = request.get<any>("/api/other/getNextRealmExp" , {
    params: { realm: GLOBAL_OPTION.playerProperty.bodyRealm , detailRealm: GLOBAL_OPTION.playerProperty.bodyDetailRealm }
  })
  // 获取下一阶需要的数据
  const promise_2 = request.get<any>("/api/other/getNextRealmExp" , {
    params: { realm: GLOBAL_OPTION.playerProperty.realm , detailRealm: GLOBAL_OPTION.playerProperty.detailRealm }
  })
  const resultList = await Promise.all([promise_1 , promise_2])
  if (!resultList[0]) return false
  if (!resultList[0].data.status) {
    util.alert.message({ message: resultList[0].data.message })
    return false
  }
  GLOBAL_OPTION.nextBodyRealmExp = resultList[0].data.data.exp
  if (!resultList[1]) return
  if (!resultList[1].data.status) {
    util.alert.message({ message: resultList[1].data.message })
    return false
  }
  GLOBAL_OPTION.nextRealmExp = resultList[1].data.data.exp
  return true
}
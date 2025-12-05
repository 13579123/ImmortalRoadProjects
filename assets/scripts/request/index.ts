import { director } from "cc";
import axios from "../../cc_module/axios";
import { native } from "../../cc_module/native";
import util from "../../cc_module/util";
import { GLOBAL_OPTION } from "../GLOBAL_OPTION";

export class ResultData<T> {
  message: string 
  data: T
  code: number 
  status: boolean
}

export const request = axios.create({
  
  baseURL: GLOBAL_OPTION.httpServerHost,

})

request.interceptors.request.use((config) => {
  config.headers.token = native.storage.get("immortal_road_token")
  return config
})

request.interceptors.response.use(
  // 在2xx范围内的任何状态代码都会触发此函数，这里主要用于处理响应数据
  response => {
    return response
  },
  // 任何超出2xx范围的状态码都会触发此函数，这里主要用于处理响应错误
  async (error) => {
    if (error.message == "Network Error") {
      util.alert.confirm({title: "错误" , message: "网络错误，无法连接到服务器，请检查网络连接是否正常"})
      return null
    }
    const { status } = error.response
    if (status === 401) { // 服务端异常
      await util.alert.confirm({title: "错误" , message: "登录过期"})
      native.storage.del("immortal_road_token")
      director.loadScene("login")
      return null
    } else if (status >= 500) { // 服务端异常
      util.alert.confirm({title: "错误" , message: "发生了未知的错误，请联系管理员解决"})
      return null
    }
    return error.response
  }
)
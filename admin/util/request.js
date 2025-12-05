import axios from "axios";

export const request = axios.create({

 baseURL: "http://127.0.0.1:4567",

})

request.interceptors.request.use((config) => {
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
    alert("网络错误，无法连接到服务器，请检查网络连接是否正常")
    return null
   }
   const { status } = error.response
   if (status === 401) { // 服务端异常
    alert("登录过期")
    return null
   } else if (status >= 500) { // 服务端异常
    alert("发生了未知的错误，请联系管理员解决")
    return null
   }
   return error.response
  }
)
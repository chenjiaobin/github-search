const Fly = require("../miniprogram_npm/flyio/index.js")

// 实例化 Fly
const http = new Fly()

// http 请求配置
http.config.baseURL = 'https://api.github.com'

http.interceptors.request.use(request => {
  // request.headers = {
  //   "token": 'd9b0878a0073304b530334120d59d009e41438dd'
  // }
  // return request
})

// 请求回调响应
http.interceptors.response.use((res) => {
  let data = res
  if (data.status !== 200) {
    return Promise.reject(data.errMsg)
  }
  return data
})

export default http

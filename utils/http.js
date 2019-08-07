const Fly = require("../miniprogram_npm/flyio/index.js")
import { base64_encode } from './util.js'
import config from './config.js'

// 实例化 Fly
const http = new Fly()

// http 请求配置
http.config.baseURL = 'https://api.github.com'

http.interceptors.request.use(request => {
  const app = getApp()
  let auth = ''
  if (app.globalData.auth == 1) {
    let token = wx.getStorageSync(config.github_token)
    auth = token ? `token ${token}` : ''
  } else if (app.globalData.auth == 2) {
    let account = wx.getStorageSync(config.github_account)
    let password = wx.getStorageSync(config.github_pwd)
    if (account && password) {
      auth = 'Basic ' + base64_encode(account + ':' + password)
    } else {
      auth = ''
    }
  }
  request.headers = {
    "Authorization": auth
  }

  // 设置token,因为github有些接口是需要权限验证，token需要用户自己在github上生成(第一种认证),token-key在github上生成就行了
  // request.headers = {
  //   "Authorization": 'token token-key'
  // }

  // 这种是base Auth认证，需要用户输入账号和密码(第二种认证)
  // request.headers = {
  //   "Authorization": 'Basic ' + base64_encode('账号名字:密码')
  // }
  return request
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

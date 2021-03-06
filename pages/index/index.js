//index.js
import * as githubApi from '../../api/github.js'
const Fly = require("../../miniprogram_npm/flyio/index.js")
const http = new Fly()
// http.config.headers = {
//   "Authorization": 'token token-key'
// }

//获取应用实例
const app = getApp()

Page({
  data: {
    // swiper当前活动页
    tabCur: 0,
    tabItems: ['所有', '个人'],
    show: false
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        app.globalData.screenHeight = res.windowHeight
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '欢迎使用GitHub小应用',
      imageUrl: '../../assets/img/share.jpg',
      path: '/pages/index/index'
    }
  },

  // tab切换
  tabSelect (event) {
    console.log(event)
    let { id } = event.currentTarget.dataset
    this.setData({
      tabCur: id
    })
  },

  // swiper切换
  changeTab (event) {
    console.log(event)
    let { current } = event.detail
    this.setData({
      tabCur: current
    })
  }
})

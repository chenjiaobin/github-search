// pages/me/me.js
import * as githubApi from '../../api/github.js'
import config from '../../utils/config.js'

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      avatar: '../../assets/img/avatar.png',
      name: '陈焦滨&kevin',
      blog: 'chenjiaobin.github.io'
    },
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let global = app.globalData.userInfo
    let storage = wx.getStorageSync(config.github_user_info)
    if (global) {
      this.setData({
        user: {
          avatar: global.avatar,
          name: global.name,
          blog: global.bio
        },
        isLogin: true
      })
    } else if (storage) {
      this.setData({
        user: {
          avatar: storage.avatar,
          name: storage.name,
          blog: storage.bio
        },
        isLogin: true
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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

  // 帮助与反馈
  complaint () {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: 66270
      }
    })
  },

  login () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 应用小贴士
  tip () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  // 清楚缓存
  clear () {
    wx.clearStorage()
    wx.showToast({
      title: '缓存清除成功'
    })
  },

  // 跳转到垃圾分类小程序
  rubbish_weapp () {
    wx.navigateToMiniProgram({
      appId: 'wxdc8cbe6d135617ce',
      success () {
        console.log('成功了')
      }
    })
  }
})
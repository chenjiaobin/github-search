// pages/login/login.js
import * as githubApi from '../../api/github.js'
import config from '../../utils/config.js'

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItems: ['Token', '账号密码'],
    tabCur: 0,
    token: null,
    account: null,
    password: null,
    showTip: false,
    tip: 'Token是GitHub API提供认证的方式之一，可以在GitHub平台上手动生成Token然后在此使用便可，具体Token生成方式请自行查询！'
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

  // 登陆类型
  tabSelect (event) {
    let { id } = event.currentTarget.dataset
    this.setData({
      tabCur: id
    })
  },

  // 登陆输入框类型
  changeTab (event) {
    let { current } = event.detail
    this.setData({
      tabCur: current
    })
  },

  // token输入
  tokenChange (event) {
    this.setData({
      token: event.detail
    })
  },

  // 账号输入
  accountChange (event) {
    this.setData({
      account: event.detail
    })
  },

  // 密码输入
  pwdChange (event) {
    this.setData({
      password: event.detail
    })
  },

  // Tip
  onClickIcon () {
    this.setData({
      showTip: true
    })
  },

  // 登录
  login (event) {
    let index = event.currentTarget.dataset.index
    if (index == "1") {
      // token认证
      if (!this.data.token || this.data.token == "") {
        wx.showToast({
          title: '请填写Token',
          icon: 'none'
        })
        return
      }
      wx.setStorageSync(config.github_token, this.data.token)
      app.globalData.auth = 1
    } else if (index == "2") {
      // 账号密码认证
      if (!this.data.account || this.data.password == "") {
        wx.showToast({
          title: '请填写账号',
          icon: 'none'
        })
        return
      } else if (!this.data.password || this.data.password == "") {
        wx.showToast({
          title: '请填写密码',
          icon: 'none'
        })
        return
      }
      wx.setStorageSync(config.github_account, this.data.account)
      wx.setStorageSync(config.github_pwd, this.data.password)
      app.globalData.auth = 2
    }
    this.getCurrentUser()
  },

  // 获取tonken或者账号密码登录认证后的个人信息
  getCurrentUser () {
    githubApi.getCurrentUserInfo().then(res => {
      if ('plan' in res.data) {
        app.globalData.userInfo = {
          avatar: res.data.avatar_url,
          name: res.data.login+'/'+res.data.name,
          bio: res.data.bio
        }
        wx.navigateBack({
          delta: 1
        })
      } else {
        if (app.globalData.auth == 1) {
          wx.removeStorageSync(config.github_token)
        } else if (app.globalData.auth == 2) {
          wx.removeStorageSync(config.github_account)
          wx.removeStorageSync(config.github_pwd)
        }
        wx.showToast({
          title: '凭证认证不通过',
          icon: 'none'
        })
      }
    }).catch(err => {
      if (app.globalData.auth == 1) {
        wx.removeStorageSync(config.github_token)
      } else if (app.globalData.auth == 2) {
        wx.removeStorageSync(config.github_account)
        wx.removeStorageSync(config.github_pwd)
      }
      wx.showToast({
        title: '凭证认证不通过',
        icon: 'none'
      })
    })
  },

  // 关闭tip
  onClose () {
    this.setData({
      showTip: false
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
  }
})
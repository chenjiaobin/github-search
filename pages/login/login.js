// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItems: ['Token', '账号密码'],
    tabCur: 0,
    token: null,
    account: null,
    password: null
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

  accountChange (event) {
    console.log(event)
  },

  // Tip
  onClickIcon () {
    
  }
})
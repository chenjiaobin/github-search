// pages/repositories/repositories.js
import * as githubApi from '../../api/github.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    search: {
      searchKey: null,
      page: 1
    },
    loadingText: '暂无数据',
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: Object.assign(this.data.search, { searchKey: options.key })
    })
    this.loadList(options.key)
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
    this.loadList(this.data.search.searchKey, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      search: Object.assign(this.data.search, { page: ++this.data.search.page })
    })
    this.loadList(this.data.search.searchKey, this.data.search.page)
  },

  // 获取列表数据
  loadList(value, page = 1) {
    githubApi.getRepositories({ q: value, page: page }).then(res => {
      if (page === 1) {
        this.setData({
          list: [].concat(res.data)
        })
      } else {
        this.setData({
          list: this.data.list.concat(res.data)
        })
      }
      this.setData({
        loading: false
      })
    }).catch(err => {
      this.setData({
        loading: false
      })
      console.log(err)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
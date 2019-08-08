// pages/repo-detail/repo-detail.js
import * as githubApi from '../../api/github.js'
import util from '../../utils/util.js'

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: [],
    // api接口需要的username/reponame
    name: null,
    filter: {
      page: 1,
      per_page: 15
    },
    active: -1,
    isTop: false,
    loadingText: '暂无数据',
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name
    })
    wx.showLoading({
      title: '正在加载...',
      icon: 'none'
    })
    this.getCommits()
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
    console.log(123)
    let page = this.data.filter.page + 1
    this.getCommits(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 页面滚动监听
  onPageScroll (e) {
    let show = false
    if (e.scrollTop >= app.globalData.screenHeight) {
      // 减少一直做无效的setData
      if (this.data.isTop) return
      show = true
    } else {
      // 减少一直做无效的setData
      if (!this.data.isTop) return 
      show = false
    }
    this.setData({
      isTop: show
    })
  },

  /**
   * 获取某个仓库提交信息
   */
  getCommits (page = 1) {
    this.setData({
      'filter.page': page
    })
    githubApi.getRepoCommits({ params: this.data.filter, info: this.data.name }).then(res => {
      let p = res.data.map(item =>{
        let date = util.formatTime(new Date(item.commit.committer.date))
        return {
          text: item.commit.message,
          desc: `${item.commit.committer.name} committed on ${date}`
        }
      })
      let status = p.length ? false : true
      this.setData({
        step: this.data.step.concat(p),
        show: status
      })
      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: '接口异常',
        icon: 'none'
      })
    })
  },

  goTop () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
})
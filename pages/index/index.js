//index.js
import * as githubApi from '../../api/github.js'
const Fly = require("../../miniprogram_npm/flyio/index.js")
const http = new Fly()
// http.config.headers = {
//   "Authorization": 'token d9b0878a0073304b530334120d59d009e41438dd'
// }

//获取应用实例
const app = getApp()

Page({
  data: {
    // swiper当前活动页
    tabCur: 0,
    tabItems: ['所有', '个人'],
    search: {
      key: '',
      // colums的下标
      typeIndex: 0
    },
    columns: [
      {
        type: 0,
        name: 'Followers'
      },
      {
        type: 1,
        name: '仓库列表'
      }
    ]
  },

  onLoad: function () {
    // githubApi.getCurrentUserInfo().then(res => {
    //   console.log(res)
    // })
    // githubApi.createRepo({ name: 'df' })
    // http.post('https://api.github.com/user/repos', {
    //   name: 'Doris'
    // }).then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  },

  // 搜索框回调
  search () {
    if (!this.data.search.key) {
      wx.showToast({
        title: '请输入关键词搜索',
        icon: 'none'
      })
      return
    }
    let currentType = this.data.columns[this.data.search.typeIndex].type
    console.log(currentType)
    if (currentType === 0) {
      this.navigateToFollower()
    } else if (currentType === 1) {
      this.navigateToRepositories()
    }
  },

  // 前往Follower页面
  navigateToFollower () {
    // 验证输入的账号是否存在
    githubApi.getCurrentUser({ username: this.data.search.key }).then(res => {
      wx.navigateTo({
        url: `/pages/search/search?key=${this.data.search.key}`
      })
    }).catch(err => {
      if (err.status === 404) {
        wx.showToast({
          title: '用户不存在',
          icon: 'none'
        })
      }
    })
  },

  // 前往仓库列表页面
  navigateToRepositories () {
    // wx.navigateTo({
    //   url: `/pages/repositories/repositories?key=${this.data.search.key}`
    // })
    wx.switchTab({
      url: `/pages/repositories/repositories?key=${this.data.search.key}`,
    })
  },

  searchChange (event) {
    this.setData({
      search: Object.assign(this.data.search, { key: event.detail })
    })
  },

  // 条件回调
  pickerChange (event) {
    let typeIndex = 0
    for (let i = 0, len = this.data.columns.length; i < len; i++) {
      if (this.data.columns[i].type == event.detail.value) {
        typeIndex = i
      }
    }
    this.setData({
      search: Object.assign(this.data.search, { typeIndex: typeIndex })
    })
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

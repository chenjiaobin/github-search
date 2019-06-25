//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    search: {
      key: '',
      type: 1
    },
    columns: [
      {
        type: 1,
        name: 'Followers'
      },
      {
        type: 2,
        name: '仓库列表'
      },
      {
        type: 3,
        name: '空'
      }
    ]
  },

  onLoad: function () {

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
    wx.redirectTo({
      url: `/pages/search/search?key=${this.data.search.key}`
    })
  },

  searchChange (event) {
    this.setData({
      search: Object.assign(this.data.search, { key: event.detail })
    })
  },

  // 条件回调
  pickerChange (event) {
    this.setData({
      search: Object.assign(this.data.search, { type: event.detail.value })
    })
  }
})

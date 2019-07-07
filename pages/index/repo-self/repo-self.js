// pages/index/repo-self/repo-self.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // github账号
    username: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearch (e) {

    },

    searchChange (e) {
      this.setData({
        username: e.detail
      })
    }
  }
})

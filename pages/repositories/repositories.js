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
      page: 1,
      sort: 'stars', // 排列字段star,forks
      order: 'desc' // 降序、升序asc,desc
    },
    loadingText: '暂无数据',
    loading: true,
    multiArray: [
      // 一列
      [
        {
          type: 1,
          name: 'star排序'
        },
        {
          type: 2,
          name: 'fork排序'
        }
      ],
      // 二列
      [
        {
          type: 1,
          name: '升序'
        },
        {
          type: 2,
          name: '降序'
        }
      ]
    ],
    multiIndex: [0, 1]
    // showSortPicker: false
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
    let params = {
      q: value,
      page: page,
      sort: this.data.search.sort,
      order: this.data.search.order
    }
    githubApi.getRepositories(params).then(res => {
      console.log(res)
      if (page === 1) {
        this.setData({
          list: [].concat(res.data.items)
        })
      } else {
        this.setData({
          list: this.data.list.concat(res.data.items)
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

  // picker确定后的回调
  bindMultiPickerChange (e) {
    console.log(e)
    console.log(this.data.multiArray)
    console.log(this.data.multiIndex)
    let data = {
      sort: this.data.search.sort,
      order: this.data.search.order
    }
    switch(e.detail.value[0]) {
      case 0:
        data.sort = 'stars'
        break
      case 1:
        data.sort = 'forks'
        break
    }
    switch(e.detail.value[1]) {
      case 0:
        data.order = 'asc'
        break
      case 1:
        data.order = 'desc'
        break
    }
    this.setData({
      search: Object.assign(this.data.search, data)
    })
    this.loadList(this.data.search.searchKey)
  },

  // 更新picker列回调
  bindMultiPickerColumnChange (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    let {column, value} = e.detail  
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[column] = value
    switch(column) {
      case 0: 
        data.multiIndex[1] = 0
        break
    }
    this.setData(data)
  },

  // 展示排序弹框
  // showPicker () {
  //   this.setData({
  //     showSortPicker: true
  //   })
  // },

  // 关闭排序弹框
  // onClose () {
  //   this.setData({
  //     showSortPicker: false
  //   })
  // }
})
// pages/index/repo-all/repo-all.js
import * as githubApi from '../../../api/github.js'
import { formatTime } from '../../../utils/util.js'

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
    repos: [],
    search: {
      key: null,
      langIndex: 2,
      typeIndex: 0,
      orderIndex: 0,
      page: 1
    },
    // 语言
    col_language: ['所有', 'JavaScript', 'Java', 'PHP', 'Python', 'Ruby', 'TypeScript', 'C#', 'C++', 'HTML', 'CSS', 'C', 'R', 'Go', 'Swift', 'Objective-C'],
    // 排序分类
    col_type: ['所有', 'stars', 'forks', 'updated'],
    // 排序方式
    col_order: ['随机', '降序', '升序'],
    loadingText: '暂无数据',
    loading: true,
    // scroll-view的滚动距离
    scrollTop: 0
  },

  lifetimes: {
    attached: function () {
      let a = formatTime(new Date())
      console.log(a)
      this.getRepo()
    }
  },

  // 这是兼容低版本的基础库
  attached: function () {
    this.getRepo()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearch (e) {
      this.getRepo()
    },

    loadMore () {
      console.log('更多')
      this.setData({
        "search.page":  this.data.search.page + 1
      })
      this.getRepo(this.data.search.page)
    },

    // 获取仓库数据
    getRepo (page = 1) {
      let lang = this.data.search.langIndex != 0 ? `language:${this.data.col_language[this.data.search.langIndex]}` : ''
      let params = {
        page: page
      }
      if (lang.length && this.data.search.key) {
        params.q = `${this.data.search.key}+${lang}`
      } else if (lang.length && !this.data.search.key) {
        params.q = lang
      } else if (!lang.length && this.data.search.key) {
        params.q = this.data.search.key
      } else {
        this.setData({
          loading: false
        })
        wx.showToast({
          title: '请输入关键词搜索或者选择一种语言',
          icon: 'none'
        })
        return
      }
      if (this.data.search.orderIndex != 0) {
        params.order = this.data.search.orderIndex == 1 ? 'desc' : 'asc'
      }
      if (this.data.search.typeIndex != 0) {
        params.sort = this.data.col_type[this.data.search.typeIndex]
      }
      githubApi.getRepositories(params).then(res => {
        console.log(res)
        if (page === 1) {
          this.setData({
            repos: [].concat(res.data.items)
          })
          this.setData({
            scrollTop: 0
          })
        } else {
          this.setData({
            repos: this.data.repos.concat(res.data.items)
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
    
    // 搜索框回调
    searchChange (e) {
      this.setData({
        'search.key': e.detail
      })
    },

    // 语言选择
    pickerChange_lang (e) {
      this.setData({
        'search.langIndex': e.detail.value
      })
      this.getRepo()
    },

    // 排序分类选择
    pickerChange_type (e) {
      this.setData({
        'search.typeIndex': e.detail.value
      })
      this.getRepo()
    },

    // 排序方式选择
    pickerChange_order (e) {
      this.setData({
        'search.orderIndex': e.detail.value
      })
      this.getRepo()
    }
  }
})

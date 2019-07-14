// pages/index/repo-all/repo-all.js
import * as githubApi from '../../../api/github.js'
import config from '../../../utils/config.js'

//获取应用实例
const app = getApp()

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
    scrollTop: 0,
    noMore: false,
    loadingMore: false
  },

  lifetimes: {
    attached: function () {
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
        "search.page":  this.data.search.page + 1,
        noMore: false,
        loadingMore: true
      })
      this.getRepo(this.data.search.page)
    },

    // 获取仓库数据
    getRepo (page = 1) {
      let lang = this.data.search.langIndex != 0 ? `language:${this.data.col_language[this.data.search.langIndex]}` : ''
      let params = {
        page: page,
        per_page: 15
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
        this.setData({
          loadingMore: false
        })
        if (!res.data.items.length) {
          this.setData({
            'search.page': this.data.search.page - 1,
            noMore: true
          })
        } else {
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
        }
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
    },

    // github仓库的star操作
    gh_stars (e) {
      let { repo } = e.currentTarget.dataset
      let global = app.globalData.userInfo
      let storage = wx.getStorageSync(config.github_user_info)
      if (!global && !storage) {
        wx.showModal({
          title: '提示',
          content: '当前操作需要GitHub的凭证认证',
          confirmText: '前往认证',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
        return
      }
      githubApi.checkStaringRepo({ repo }).catch(err => {
        if (!err) {
          let that = this
          // 关注过了，那这里就调用取消关注
          wx.showModal({
            content: '您已经关注过了，是否取消关注？',
            confirmText: '取消关注',
            success(res) {
              if (res.confirm) {
                that.unStar(repo)
              }
            }
          })
        } else {
          this.star(repo)
        }
      })
    },

    // 关注仓库
    star (repo) {
      githubApi.starRepo({ repo }).catch(err => {
        if (!err) {
          wx.showToast({
            title: '关注成功',
            icon: 'none'
          })
        }
      })
    },

    // 取消关注
    unStar (repo) {
      githubApi.unstarRepo({ repo }).catch(err => {
        if (!err) {
          wx.showToast({
            title: '成功取消关注',
            icon: 'none'
          })
        }
      })
    },

    // follow用户
    gh_follow (e) {
      let { username } = e.currentTarget.dataset
      let global = app.globalData.userInfo
      let storage = wx.getStorageSync(config.github_user_info)
      if (!global && !storage) {
        wx.showModal({
          title: '提示',
          content: '当前操作需要GitHub的凭证认证',
          confirmText: '前往认证',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
        return
      }
      githubApi.checkFollow({ username }).catch(err => {
        if (!err) {
          let that = this
          // 关注过了，那这里就调用取消关注
          wx.showModal({
            content: '您已经Follow过了，是否取消？',
            confirmText: '取消跟随',
            success(res) {
              if (res.confirm) {
                that.unFollow(username)
              }
            }
          })
        } else {
          this.follow(username)
        }
      })
    },

    follow (username) {
      console.log('成功')
      githubApi.followUser({ username }).catch(err => {
        if (!err) {
          wx.showToast({
            title: 'Follow成功',
            icon: 'none'
          })
        }
      })
    },

    unFollow (username) {
      console.log('为')
      githubApi.unFollowUser({ username }).catch(err => {
        if (!err) {
          wx.showToast({
            title: '成功取消Follow',
            icon: 'none'
          })
        }
      })
    }
  }
})

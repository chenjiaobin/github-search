// pages/index/repo-self/repo-self.js
import * as githubApi from '../../../api/github.js'

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
    username: null,
    search: {
      page: 1,
      per_page: 15
    },
    user: {
      avatar: '../../../assets/img/avatar.png',
      account: '--',
      name: '--',
      blog: '--m',
      bio: '--',
      following: '--',
      followers: '--'
    },
    repos: [],
    scrollTop: 0,
    loadingText: '暂无数据',
    loading: false,
    noMore: false,
    loadingMore: false
  },

  lifetimes: {
    attached: function () {

    }
  },

  // 这是兼容低版本的基础库
  attached: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearch (e) {
      if (!this.data.username || this.data.username == '') {
        wx.showToast({
          title: '请输入账户名进行查询',
          icon: 'none'
        })
      }
      this.getUserInfo()
      this.getRepo()
    },

    searchChange (e) {
      this.setData({
        username: e.detail
      })
    },

    loadMore () {
      this.setData({
        "search.page": this.data.search.page + 1,
        noMore: false,
        loadingMore: true
      })
      this.getRepo(this.data.search.page)
    },

    // 获取用户信息
    getUserInfo () {
      githubApi.getCurrentUser({ username: this.data.username }).then(res => {
        console.log(res)
        let data = res.data
        this.setData({
          user: {
            avatar: data.avatar_url,
            account: data.login,
            name: data.name,
            blog: data.blog,
            bio: data.bio,
            following: data.following,
            followers: data.followers
          }
        })
      })
    },

    // 获取仓库数据
    getRepo(page = 1) {
      let params = {
        username: this.data.username,
        params: {
          page: page,
          per_page: this.data.search.per_page
        }
      }
      githubApi.getYourRepos(params).then(res => {
        this.setData({
          loadingMore: false
        })
        if (!res.data.length) {
          this.setData({
            'search.page': this.data.search.page - 1,
            noMore: true
          })
        } else {
          if (page === 1) {
            this.setData({
              repos: [].concat(res.data)
            })
            this.setData({
              scrollTop: 0
            })
          } else {
            this.setData({
              repos: this.data.repos.concat(res.data)
            })
          }
          this.setData({
            loading: false,
            noMore: false
          })
        }
      }).catch(err => {
        this.setData({
          loading: false
        })
        console.log(err)
      })
    },
  }
})

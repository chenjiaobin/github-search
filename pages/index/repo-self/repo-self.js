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
      blog: '--',
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
        return
      }
      wx.showLoading({
        title: '正在加载...'
      })
      Promise.all([this.getUserInfo(), this.getRepo()]).then(res => {
        if (!res[1].data.length) {
          this.setData({
            repos: []
          })
        }
        wx.hideLoading()
      }).catch(err => {
        wx.showToast({
          title: '接口异常',
          icon: 'none'
        })
      })
    },

    searchChange (e) {
      this.setData({
        username: e.detail
      })
    },

    loadMore () {
      if (!this.data.repos.length && !this.data.loading) { return }
      this.setData({
        "search.page": this.data.search.page + 1,
        noMore: false,
        loadingMore: true
      })
      this.getRepo(this.data.search.page)
    },

    // 获取用户信息
    getUserInfo () {
      return new Promise((resolve, reject) => {
        githubApi.getCurrentUser({ username: this.data.username }).then(res => {
          console.log(res)
          let data = res.data
          this.setData({
            user: {
              avatar: data.avatar_url,
              account: data.login ? data.login : '暂无',
              name: data.name ? data.name : '暂无',
              blog: data.blog ? data.blog : '暂无',
              bio: data.bio ? data.bio : '暂无',
              following: data.following,
              followers: data.followers
            }
          })
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取仓库数据
    getRepo(page = 1) {
      return new Promise((resolve, reject) => {
        let params = {
          username: this.data.username,
          params: {
            page: page,
            per_page: this.data.search.per_page
          }
        }
        githubApi.getYourRepos(params).then(res => {
          console.log(res)
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
          resolve(res)
        }).catch(err => {
          this.setData({
            loading: false
          })
          reject(err)
        })
      })
    },

    toDetail (e) {
      let { name } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/repo-detail/repo-detail?name=${name}`,
      })
    }
  }
})

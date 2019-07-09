import http from '../utils/http'

// github API文档 （https://developer.github.com/v3/search/）

// 获取当前用户的follows用户
export const getFollower = (params) => {
  return http.get(`/users/${params.username}/followers`, params.params)
}

// 获取当前用户信息
export const getCurrentUser = (params) => {
  return http.get(`/users/${params.username}`, params.params)
}

// 获取当前用户具体信息，需要权限，这里我们直接在header加上token
export const getCurrentUserInfo = (params) => {
  return http.get('/user', params)
}

/**
 * 获取所有关键词下的仓库列表
 * page: 页数
 * per_page: 页面条数
 * q: 搜索关键词(https://help.github.com/en/articles/searching-for-repositories)
 * sort: (stars,forks,help-wanted-issues)
 * order: (asc,desc默认)
 * 例子：https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc
 */ 
export const getRepositories = (params) => {
  return http.get('/search/repositories', params)
}

// 获取个人所有仓库
export const getYourRepos = (params) => {
  return http.get(`/users/${params.username}/repos`, params.params)
}

// 查看具体某个仓库的信息
export const getYourReposDetail = (params) => {
  return http.get(`/users/${params.username}/${params.repo}`, params.params)
}

// 获取某个仓库的issue列表
export const getRepoIssues = (params) => {
  return http.get(`/repos/${params.username}/${params.repo}/issues`, params.params)
}

// 获取某个仓库的某个issue的具体信息
export const getRepoIssuesDetail = (params) => {
  return http.get(`/repos/${params.username}/${params.repo}/issues/${params.issueID}`, params.params)
}

/**
 * 全局搜索用户
 * 例子：https://api.github.com/search/users?q=tom+repos:>42+followers:>1000
 */
export const getUserListBySearch = (params) => {
  return http.get('/search/users', params)
}
/***************下面是一些对github的操作*********************/

// 创建仓库
export const createRepo = (params) => {
  return http.post('/user/repos', params)
}

// 检查是否stared了某个仓库
export const checkStaringRepo = (params) => {
  return http.get(`/user/starred/${params.username}/${params.repo}`)
}

// star一个仓库
export const starRepo = (params) => {
  return http.put(`/user/starred/${params.username}/${params.repo}`)
}

// unstar一个仓库
export const unstarRepo = (params) => {
  return http.delete(`/user/starred/${params.username}/${params.repo}`)
}

// 检查是否正在watching某个仓库
export const checkWatchingRepo = (params) => {
  return http.get(`/user/subscriptions/${params.username}/${params.repo}`)
}

// watch某个项目
export const watchRepo = (params) => {
  return http.put(`/user/subscriptions/${params.username}/${params.repo}`)
}

// 停止watch某个项目
export const stopWatchRepo = (params) => {
  return http.delete(`/user/subscriptions/${params.username}/${params.repo}`)
}

// follow某个github账户
export const followUser = (params) => {
  return http.put(`/user/following/${params.username}`)
}

// 取消follow某个githun账户
export const unFollowUser = (params) => {
  return http.delete(`/user/following/${params.username}`)
}

export const auth = (params) => {
  return http.get('authorizations')
}
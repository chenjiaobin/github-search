import http from '../utils/http'

// 获取当前用户的follows用户
export const getFollower = (params) => {
  return http.get(`/users/${params.username}/followers`, params.params)
}

// 获取当前用户信息
export const getCurrentUser = (params) => {
  return http.get(`/users/${params.username}`, params.params)
}

// 获取所有关键词下的仓库
export const getRepositories = (params) => {
  return http.get('/search/repositories', params)
}
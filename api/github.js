import http from '../utils/http'

export const getFollower = (params) => {
  return http.get(`/users/${params.username}/followers`, params.params)
}
import request from '@/utils/request'
// 这个数字后面登录还需要用到
export function getcode(num) {
  const url = `/api/user-service/user/imageCode/${num}`
  return url
}
// 登录页面
export function login(data) {
  return request({
    url: '/user-service/user/login',
    method: 'POST',
    data: {
      ...data,
      loginType: 0
    }
  })
}
// 获取用户信息
export function getUserInfo(id) {
  return request({
    url: `/user-service/user/${id}`,
    method: 'get'
  })
}

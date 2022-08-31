import request from '@/utils/request'

// 合作商搜索
export function partnerSearchGet(params) {
  return request({
    url: '/user-service/partner/search',
    params
  })
}
// 新增合作商
export function userServicePartnerPost(data) {
  return request({
    url: '/user-service/partner',
    method: 'POST',
    data
  })
}

// 新增合作商
export function userServicePartnerPut(id, data) {
  return request({
    url: `/user-service/partner/${id}`,
    method: 'PUT',
    data
  })
}
// 重置合作商密码
export function partnerResetPwd(id) {
  return request({
    url: `/user-service/partner/resetPwd/${id}`,
    method: 'PUT'
  })
}
// 删除合作商
export function userServicePartnerDel(id) {
  return request({
    url: `/user-service/partner/${id}`,
    method: 'DELETE'
  })
}

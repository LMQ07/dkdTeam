import request from '@/utils/request'

// 合作商搜索
export function partnerSearchGet(params) {
  return request({
    url: 'user-service/partner/search',
    params
  })
}
// 新增合作商
export function userServicePartnerPost(data) {
  return request({
    url: 'user-service/partner',
    method: 'POST',
    data
  })
}

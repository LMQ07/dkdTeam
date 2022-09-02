import request from '@/utils/request'

// 获取策略信息
export function getPolicy(params) {
  return request({
    url: '/vm-service/policy/search',
    method: 'get',
    params
  })
}

// 新增策略
export function addPolicy(data) {
  return request({
    url: '/vm-service/policy',
    method: 'POST',
    data
  })
}

// 删除策略
export function delPolicy(policyId) {
  return request({
    url: `/vm-service/policy/${policyId}`,
    method: 'DELETE'
  })
}

// 修改策略
export function editPolicy(policyId, discount, policyName) {
  return request({
    url: `/vm-service/policy/${policyId}`,
    method: 'PUT',
    data: { discount, policyName }
  })
}

// 售货机
export function policyAutomat(policyId, pageIndex, pageSize) {
  return request({
    url: `/vm-service/policy/vmList/${policyId}`,
    method: 'GET',
    params: { pageIndex, pageSize }
  })
}

import request from '@/utils/request'

// 获取区域列表
export function getRegionList(params) {
  return request({
    url: '/vm-service/region/search',
    params
  })
}

// 新增区域
export function addRegion(data) {
  return request({
    url: '/vm-service/region',
    method: 'POST',
    data
  })
}

// 获取区域详情
export function getRegionInfo(regionId) {
  return request({
    url: `/vm-service/region/${regionId}`
  })
}

// 获取该区域下点位列表
export function getNodeList(params) {
  return request({
    url: '/vm-service/node/search',
    params
  })
}

// 删除区域
export function delRegion(id) {
  return request({
    url: `/vm-service/region/${id}`,
    method: 'DELETE'
  })
}

// 修改区域
export function editRegion(id, data) {
  return request({
    url: `/vm-service/region/${id}`,
    method: 'PUT',
    data
  })
}

// 点位搜索
export function searchNode(params) {
  return request({
    url: '/vm-service/node/search',
    params
  })
}

// 获取商圈列表
export function getBusinessList() {
  return request({
    url: '/vm-service/businessType'
  })
}

// 获取商圈列表
export function getPartnerList(params) {
  return request({
    url: '/user-service/partner/search',
    params
  })
}

// 删除点位
export function delNode(id) {
  return request({
    url: `/vm-service/node/${id}`,
    method: 'DELETE'
  })
}

// 获取点位详情
export function getNodeInfo(id) {
  return request({
    url: `/vm-service/node/vmList/${id}`
  })
}

// 新增点位
export function addNode(data) {
  return request({
    url: '/vm-service/node',
    method: 'POST',
    data
  })
}

// 修改点位
export function editNode(data) {
  return request({
    url: `/vm-service/node/${data.id}`,
    method: 'PUT',
    data
  })
}

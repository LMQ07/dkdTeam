import request from '@/utils/request'

// 人员搜索(列表页)
export function userServiceList(params) {
  return request({
    url: '/user-service/user/search',
    params
  })
}
// 区域列表
export function vmServiceGet(params) {
  return request({
    url: '/vm-service/region/search',
    params
  })
}
// 修改人员
export function userServicePut(id) {
  return request({
    url: `/api/user-service/user/${id}`,
    method: 'PUT'
  })
}
// 角色列表
export function userServiceRole() {
  return request({
    url: '/user-service/role'
  })
}
// 图片上传
export function fileUpload(fileName) {
  return request({
    url: '/vm-service/sku/fileUpload',
    method: 'POST',
    data: fileName
  })
}

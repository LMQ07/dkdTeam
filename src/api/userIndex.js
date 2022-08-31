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
export function userServicePut(id, data) {
  return request({
    url: `/user-service/user/${id}`,
    method: 'PUT',
    data
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
// 新增人员
export function userServiceUserPOST(data) {
  return request({
    url: 'user-service/user',
    method: 'POST',
    data
  })
}
// 删除人员
export function userServiceUserDel(id) {
  return request({
    url: `user-service/user/${id}`,
    method: 'DELETE'
  })
}

import request from '@/utils/request'
// 获取售货机
export function getVmIndexMsg(params) {
  return request({
    url: 'vm-service/vm/search',
    params
  })
}
// 获取批量策略
export function getPolicy() {
  return request({
    url: 'vm-service/policy'
  })
}
// 批量操作提交
export function submitPolicy(data) {
  return request({
    url: 'vm-service/vm/applyPolicy',
    method: 'PUT',
    data
  })
}
// 获得售货机类型列表
export function getVmType(params) {
  return request({
    url: 'vm-service/vmType/search',
    params
  })
}
// 获取点位
export function getNodeList(params) {
  return request({
    url: 'vm-service/node/search',
    params
  })
}
// 新增设备完成
export function addNewEquipment(data) {
  return request({
    url: 'vm-service/vm',
    method: 'POST',
    data
  })
}
// 修改点位
export function changeNode(id, nodeId) {
  return request({
    url: `vm-service/vm/${id}/${nodeId}`,
    method: 'PUT'
  })
}

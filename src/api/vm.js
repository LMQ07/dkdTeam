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
// 获取当前点位是否有策略
export function getStragory(innerCode) {
  return request({
    url: `vm-service/policy/vmPolicy/${innerCode}`
  })
}
// 取消当前的策略
export function cancelStragory(innerCode, policyId) {
  return request({
    url: `vm-service/vm/cancelPolicy/${innerCode}/${policyId}`,
    method: 'PUT'
  })
}

// 一下是一个弹框需要的请求
// 获取销售量
export function getSaleMQ(params) {
  return request({
    url: 'order-service/report/orderCount',
    params
  })
}
// 获取一定时间的收入
export function getSalaryMQ(params) {
  return request({
    url: 'order-service/report/orderAmount',
    params
  })
}
// 售货机补货次数
export function getCaptureMQ(innerCode, start, end) {
  return request({
    url: `task-service/task/supplyCount/${innerCode}/${start}/${end}`
  })
}
// 售货机维修次数
export function getRepairNumMQ(innerCode, start, end) {
  return request({
    url: `task-service/task/repairCount/${innerCode}/${start}/${end}`
  })
}
// 售货机商品销售
export function getGoodsNumMQ(innerCode, start, end) {
  return request({
    url: `order-service/report/skuCollect/${innerCode}/${start}/${end}`
  })
}
// 删除售货机类型
export function delectVmType(typeId) {
  return request({
    url: `vm-service/vmType/${typeId}`,
    method: 'DELETE'
  })
}
// 上传信息
export function addVmType(data) {
  return request({
    url: 'vm-service/vmType',
    method: 'POST',
    data
  })
}
// 删除售货机类型
export function changeVmType(typeId, data) {
  return request({
    url: `vm-service/vmType/${typeId}`,
    method: 'PUT',
    data
  })
}

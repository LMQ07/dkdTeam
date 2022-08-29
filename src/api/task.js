import request from '@/utils/request'

export const getTaskAPI = (params) => {
  return request({
    url:'/task-service/task/search',
    params
  })
}
export const getTaskInfoAPI = (taskId) => {
  return request({
    url:`/task-service/task/taskInfo/${taskId}`,
  })
}
export const getOperatorListAPI = (innerCode) => {
  return request({
    url:`/user-service/user/operatorList/${innerCode}`,
  })
}
export const getChannelListAPI = (innerCode) => {
  return request({
    url:`/vm-service/channel/channelList/${innerCode}`,
  })
}
export const createTaskAPI = (data) => {
  return request({
    url:'/task-service/task/create',
    method:'POST',
    data
  })
}
export const getreplenishInfo =(taskId) =>{
  return request({
    url:`/task-service/taskDetails/${taskId}`
  })
}
export const getSupplyAlertValue = () =>{
  return request({
    url:'/task-service/task/supplyAlertValue'
  })
}
export const setSupplyAlertValue =(data) =>{
  return request({
    url:"/task-service/task/autoSupplyConfig",
    method:'POST',
    data
  })
}
export const cancelTask =(data) =>{
  return request({
    url:`/task-service/task/cancel/${data.taskId}`,
    method:'POST',
    data
  })
}

export const getOperationTaskType =() =>{
  return request({
    url:'/task-service/taskType/list'
  })
}
export const getRepairerListAPI = (innerCode) => {
  return request({
    url:`/user-service/user/repairerList/${innerCode}`,
  })
}
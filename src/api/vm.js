import request from '@/utils/request'
// 获取售货机
export function getVmIndexMsg(params) {
  return request({
    url: 'vm-service/vm/search',
    params
  })
}

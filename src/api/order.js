import request from '@/utils/request'

// 获取订单
export function getOrder(params) {
  return request({
    url: '/order-service/order/search',
    method: 'get',
    params
  })
}

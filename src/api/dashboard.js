// 主页
import request from '@/utils/request'

// 获取前10的商品
export const getBussinessTop = (start, end) => {
  return request({
    url: `/order-service/report/skuTop/10/${start}/${end}`
  })
}

// 获取一定时间范围之内的订单总数
export const getOrderCount = (params) => {
  return request({
    url: '/order-service/report/orderCount',
    params
  })
}

// 获取一定时间范围之内的收入
export const getMoneyApi = (params) => {
  return request({
    url: 'order-service/report/orderAmount',
    params
  })
}

// 获取当时工单汇总信息(人员统计头部信息)
export const getTaskReportInfo = (start, end) => {
  return request({
    url: `/task-service/task/taskReportInfo/${start}/${end}`
  })
}

// 获取销售数据趋势
export const getAmountCollect = (collectType, start, end) => {
  return request({
    url: `/order-service/report/amountCollect/${collectType}/${start}/${end}`
  })
}

// 获取销售额分布
export function getSaleTotal(start, end) {
  return request({
    url: `order-service/report/regionCollect/${start}/${end}`
  })
}

// 获取合作商
export function getTogetherPartner() {
  return request({
    url: '/vm-service/node/nodeCollect'
  })
}


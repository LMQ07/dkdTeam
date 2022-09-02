import request from '@/utils/request'
export const getOrderCount = (params)=>{
  return request({
    url:'order-service/report/orderCount',
    params
  })
}
export const getOrderAmount = (params)=>{
  return request({
    url:'/order-service/report/orderAmount',
    params
  })
}

export const getOrdertotalBill = (params)=>{
  return request({
    url:'/order-service/report/totalBill',
    params
  })
}

export const getPartnerCollect = (params)=>{
  return request({
    url:'/order-service/report/partnerCollect',
    params
  })
}
export const searchPartner = (params)=>{
  return request({
    url:'/user-service/partner/search',
    params
  })
}
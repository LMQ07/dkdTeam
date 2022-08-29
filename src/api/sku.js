import request from '@/utils/request'

/**
 * 商品类型搜索
 *
 * **/
export function getSkuClass(params) {
  return request({
    url: '/vm-service/skuClass/search',
    method: 'GET',
    params
  })
}

/** **
 *  新增商品类型
 * **/
export function addskuClass(data) {
  return request({
    method: 'POST',
    url: '/vm-service/skuClass',
    data
  })
}

/** **
 *  删除商品类型
 * **/
export function DeleskuClass(id) {
  return request({
    method: 'DELETE',
    url: `/vm-service/skuClass/${id}`
  })
}

/** *
 * 修改商品类型
 * ***/
export function updateRole(data) {
  return request({
    url: `/vm-service/skuClass/${data.id}`,
    data,
    method: 'put'
  })
}

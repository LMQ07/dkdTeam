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

/**
 * 商品搜索
 *
 * **/
export function getSkuSkuSearch(params) {
  return request({
    url: '/vm-service/sku/search',
    method: 'GET',
    params
  })
}

/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function SkuUpload(data) {
  return request({
    url: '/vm-service/sku/upload',
    method: 'post',
    data
  })
}

/**
 *  新增商品
 *
 * ****/
export function addskuSku(data) {
  return request({
    url: '/vm-service/sku',
    method: 'post',
    data
  })
}

// 修改商品
export function updatePermission(data) {
  return request({
    url: `/vm-service/sku/${data.skuId}`,
    method: 'put',
    data
  })
}

// 图片上传
export function addFileUpload(data) {
  return request({
    url: '/vm-service/sku/fileUpload',
    method: 'POST',
    data
  })
}
/** *
 *  商品导入
 *
 * ***/

 export function servicUpload(data) {
  return request({
    url: '/vm-service/sku/upload',
    method: 'post',
    data
  })
}
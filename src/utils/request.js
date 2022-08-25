import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 设置请求超时的时间
const timeout = 3600

function isTimeOut() {
  return (Date.now() - parseInt(store.getters.beginTime)) / 1000 > timeout
}
// request interceptor
service.interceptors.request.use((config) => {
  // console.log(config.url.includes('/login'))
  if (!store.getters.token) {
    return config
  } else {
    if (isTimeOut()) { // 超时
      store.dispatch('user/logout')
      router.push('/login')
      // Message.error('token已失效')
      return Promise.reject(new Error('token已失效'))
    } else {
      config.headers.Authorization = store.getters.token
      return config
    }
  }
}, error => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    return response
  }, (error) => {
    Message.error(error?.response?.data || error.message || '服务端错误')
    return Promise.reject(error)
  }
)

export default service

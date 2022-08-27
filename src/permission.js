// 判断是否有token再判断路由能都进入
// 全局路由守卫

import router from './router'
import store from './store'
const whitePath = ['/login', '/404']
// 判断一下store里面是不是有token
router.beforeEach((to, from, next) => {
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token
    // 白名单 就是不需要token就可以进入的
    if (whitePath.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

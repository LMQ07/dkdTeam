import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    beginTime: localStorage.getItem('beginTime')
  },
  mutations: {
    pushToken(state, token) {
      state.token = token
      setToken(token)
    },
    clearToken(state) {
      removeToken()
      state.token = ''
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    clearUserInfo(state) {
      localStorage.removeItem('userInfo')
      state.userInfo = {}
    },
    setBeginTime(state, time) {
      state.beginTime = time
      localStorage.setItem('beginTime', time)
    },
    removeBeginTime(state) {
      localStorage.removeItem('beginTime')
    }
  },
  actions: {
    // 发起异步请求并且设置
    async getToken({ commit }, data) {
      const res = await login(data)
      console.log(res)
      commit('pushToken', res.data.token)
      commit('setUserInfo', res.data)
      commit('setBeginTime', Date.now())
    },
    // 退出登录
    logout({ commit }) {
      commit('clearToken')
      commit('clearUserInfo')
      commit('removeBeginTime')
    }
  }
}

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userName: state => state.user.userInfo.userName,
  beginTime: state => state.user.beginTime,
  userId: state => state.user.userInfo.userId
}
export default getters

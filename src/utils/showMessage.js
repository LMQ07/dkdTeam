import { Message } from 'element-ui'
import { curry } from 'lodash'

// function showMessage(type, message) {
//   Message[type](message)
// }

const showMessage = curry((type, message) => {
  Message[type](message)
})

const showErrorMessage = showMessage('error')
const showSuccessMessage = showMessage('success')

// showMessage('error', '错误消息')
// showMessage('error', '错误消息1')

showErrorMessage('出错了')
showSuccessMessage('成功了')

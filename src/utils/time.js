const timestamp = +new Date()
export const getTime = () => {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()

  if (month < 10) { month = '0' + month }
  if (date < 10) { date = '0' + date }
  return year + '-' + month + '-' + date
}
// 获取当前月的第一天
// 获取当前月的第一天 例如 2022-04-01
export const currmonthStarttime = () => {
  const today = new Date() // 中国标准时间 当前时间
  // 设置一个月的某一天
  today.setDate(1)
  const oYear = today.getFullYear()
  let oMoth = (today.getMonth() + 1).toString()
  if (oMoth.length <= 1) oMoth = '0' + oMoth
  let oDay = today.getDate().toString()
  if (oDay.length <= 1) oDay = '0' + oDay

  return oYear + '-' + oMoth + '-' + oDay
}

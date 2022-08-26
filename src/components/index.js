// require.context(路径，是否查看子目录，正则) ==》返回一个函数
const requirements = require.context('./', true, /\.vue$/)
// requirements.keys()这一步就是将所有的路径都找到 并且是一个数组
// 然后requirements（路径）这一步就可以将所有的模块找到
// 最后map一下这个数组 依次都requirements（路径）
const res = requirements.keys().map(requirements)

// console.log(res)

export default (Vue) => {
  res.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
}


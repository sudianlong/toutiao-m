/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'

import JSONBig from 'json-bigint'
// 可以处理数据中的 超出js安全整数范围的问题
// JSONBig.parse() / 把json格式的字符串转为json 对象
// JSONBig.stringify() 把js对象格式转为字符串

// const jsonStr = '{"art_id": 13216632162651321}'
// console.log(JSON.parse(jsonStr)) // 13216632162651320
// console.log(JSONBig.parse(jsonStr).art_id.toString())
// // 使用的时候 把bigNUmber类型的数据 转为字符串  13216632162651321
// // 用原生的js 转bigNUmber  是不可行的
// // 最好使用JSONbBig转为字符串的对象 可行
// JSONBig.stringify()

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口的基准路径
  // 自定义后端饭hi的原始数据
  transformResponse: [function (data) {
    // data是原始数据 是为原始的JSON格式的字符串  防止后端返回的数据不是正常的JSON字符串 容错率 更健壮
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
    // return JSON.parse(data)  默认
  }]
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 请求发起会经过这里 config 此次请求的配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log/(config)
  return config
}, error => {
  // 如果请求出错了 还没有发送出去会经过这里
  return Promise.reject(error)
})
// 响应拦截器

export default request

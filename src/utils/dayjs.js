import dayjs from 'dayjs'
import Vue from 'vue'
// dayjs 默认语言是英文 需配置为中文
//  加载中文语言包
import 'dayjs/locale/zh-cn'
//  导入插件 相对时间的
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn') // 全局使用
// dayjs() 获取当前时间最新的

dayjs.extend(relativeTime)
// 定义一个全局过滤器 参数1 过滤器名称   参数2过滤器函数
// 使用方式 {{表达式 | 过滤器名称}}
// 管道符前面的表达式二点结果会作为 参数传递到过滤器函数中
// 过滤器的返回值
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// dayjs().format('YYYY-MM-DD')
// var a = dayjs()
// a.to('1990-01-01') // 2 年内
// a.to('1990-01-01', true) // 2 年

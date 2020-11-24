/**
 * PostCSS 配置文件
 */
module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 CSS 样式规则前缀
    // vue cli 已经配置了autofixer的插件 这里又配置一次?
    // 'autoprefixer': { // autoprefixer 插件的配置
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem
    'postcss-pxtorem': {
      // rootvalue 意思是根元素的值
      // lib-flexible的rem 适配方案 把每一行分为10分 每份是1/10, 这个值
      //  应该设置为设计稿宽度的 十分之一 iphone 6 7 8
      // rootvalue支持两种类型/ 函数和 数字 sb
      // 数字固定值 ?
      // 函数 : 可以动态处理返回
      // rootValue: 75,
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的 CSS 属性
      // * 表示所有
      propList: ['*'],

      // 配置不要转换的 样式资源 希望maikdown 不要转换 支持string 正则 函数 等exclud
      exclude: 'github-markdown'
    }

  }
}

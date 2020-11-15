import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载vant 的 核心组件库
import Vant from 'vant'
// 加载 vant 全局样式
import 'vant/lib/index.css'
// 加载全局样式
import './style/index.less'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

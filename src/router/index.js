import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    // 设置为动态路由 任意的id
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启prop传参 ,就是把路由参数映射到组件的props中
  },
  {
    // 设置为动态路由 任意的id
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
    // props: true // 开启prop传参 ,就是把路由参数映射到组件的props中
  },
  {
    path: '/', // 如果父路由有默认子路由 那么它的name就没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由 只能有一个
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

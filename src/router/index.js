import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/users',
        component: Users
      }
    ]
  }
  ]
})
// 给路由对象设置导航守卫
// to: 去哪儿
// from: 从哪儿来
// next() : 指定跳转到哪个组件  next():表示放行  next(false)  next('/login')
router.beforeEach((to, form, next) => {
  // 如果是去登录页
  if (to.path === '/login') {
    // 放行
    next()
  } else {
    // 判断本地是否存有token
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router

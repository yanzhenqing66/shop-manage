import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../views/Home'
import Welcome from '../components/content/Welcome'
import Users from '../views/user/Users'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'users',
        component: Users
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，控制登录状态
router.beforeEach((to, from, next) => {
  // to 是要访问的路径
  // from 代表从那个路径跳转而来
  // next() 函数,表示放行

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
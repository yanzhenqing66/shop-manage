import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../views/Home'
import Welcome from '../components/content/Welcome'
import Users from '../views/user/Users'
import Rights from '../views/power/rights/Rights'
import Roles from '../views/power/roles/Roles'
import Cate from '../views/goods/Cate'
import GoodsParams from '../views/goods/GoodsParams'
import List from '../views/goods/List'
import AddGoods from '../views/goods/AddGoods'
import Order from '../views/order/Order'
import Report from '../views/report/Report'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: GoodsParams
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: AddGoods
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
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
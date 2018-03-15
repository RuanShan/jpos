import Vue from 'vue'
import Router from 'vue-router'

// 引入组件
import vDashboard from '../components/vDashboard'
import vGoodsList from '../components/vGoodsList'
import vShoppingCart from '../components/vShoppingCart'
import vGoodsStorage from '../components/vGoodsStorage'
import vGoodsDetailList from '../components/vGoodsDetailList'
import vGoodsDetail from '../components/vGoodsDetail'
import vCashRegister from '../components/vCashRegister'
import vMessageList from '../components/vMessageList'
import vDataStatistics from '../components/vDataStatistics'
import vPersonList from '../components/vPersonList'
import vTodoList from '../components/vTodoList.vue'
import v404 from '../components/404.vue'
import vSignUp from '../components/Register.vue'
import vSignIn from '../components/Login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: vDashboard
    },
    {
      path: '/goodsList',
      component: vGoodsList
    },
    {
      path: '/shoppingCart',
      component: vShoppingCart
    },
    {
      path: '/goodsStorage',
      component: vGoodsStorage
    },
    {
      path: '/goodsDetailList',
      component: vGoodsDetailList
    },
    {
      path: '/goodsDetail',
      component: vGoodsDetail
    },
    {
      path: '/cashRegister',
      component: vCashRegister
    },
    {
      path: '/messageList',
      component: vMessageList
    },
    {
      path: '/dataStatistics',
      component: vDataStatistics
    },
    {
      path: '/personList',
      component: vPersonList
    },
    {
      path: '/todoList',
      component: vTodoList
    },
    {
      path: '/login',
      name: 'login',
      component: vSignIn
    },
    {
      path: '/register',
      name: 'register',
      component: vSignUp
    },
    // 简单设置404页面
    {
      path: '*',
      name: '404',
      component: v404,
      hidden: true
    }
  ]
})

export default router

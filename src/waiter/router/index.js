import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/page/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/page/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/page/pos')), 'pos')
const ordersPage = r => require.ensure([], () => r(require('@/page/orderList')), 'orders')


const routes = [
  {
    path: '/',
    name: 'login',
    component: loginPage
  },
  {
    path: '/waiter',
    component: homePage,
    name: '',
    children: [{
      path: '',
      component: posPage,
      meta: []
    },{
			path: 'orders',
			component: ordersPage,
			meta: [],
		}]
  }
]

export default new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/mobile/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/mobile/home')), 'home')
const ordersPage = r => require.ensure([], () => r(require('@/mobile/orders/orders')), 'orders')
const orderDetailPage = r => require.ensure([], () => r(require('@/mobile/orders/detail')), 'orderDetail')
const profilePage = r => require.ensure([], () => r(require('@/mobile/profile')), 'profile')


const routes = [{
        path: '/',
        name: 'home',
        component: homePage
    },
    {
        path: '/login',
        name: 'login',
        component: loginPage
    }, {
          path: '/orders',
          name: 'orders',
          component: ordersPage,
          meta: [],
    }, {
          path: '/order/:id',
          name: 'orderDetail',
          component: orderDetailPage,
          meta: [],
    }, {
        path: '/profile',
        component: profilePage,
        meta: [],
    }
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production'
})

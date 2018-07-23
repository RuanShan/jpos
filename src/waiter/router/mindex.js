import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/mobile/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/mobile/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/mobile/pos')), 'pos')
const itemGroupsPage = r => require.ensure([], () => r(require('@/mobile/itemFlow')), 'itemGroups')
const ordersPage = r => require.ensure([], () => r(require('@/mobile/orders')), 'orders')
const membersPage = r => require.ensure([], () => r(require('@/mobile/members')), 'members')
const statisticsPage = r => require.ensure([], () => r(require('@/mobile/statistics')), 'statistics')
const settingPage = r => require.ensure([], () => r(require('@/mobile/setting')), 'setting')


const routes = [{
        path: '/',
        name: 'home',
        component: homePage
    },
    {
        path: '/login',
        name: 'login',
        component: loginPage
    },
    {
        name: 'pos',
        path: '/pos',
        component: posPage,
        meta: []
    }, {
          path: '/orders',
          component: ordersPage,
          meta: [],
    }, {
        path: '/itemGroups',
        component: itemGroupsPage,
        meta: [],
    }, {
        path: '/members',
        component: membersPage,
        meta: [],
    }, {
        path: '/statistics',
        component: statisticsPage,
        meta: [],
    }, {
        path: '/setting',
        component: settingPage,
        meta: [],
    }
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production'
})

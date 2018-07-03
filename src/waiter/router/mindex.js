import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/mobile/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/mobile/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/mobile/pos')), 'pos')
const itemGroupsPage = r => require.ensure([], () => r(require('@/mobile/itemFlow')), 'itemGroups')
const ordersPage = r => require.ensure([], () => r(require('@/mobile/orderList')), 'orders')
const membersPage = r => require.ensure([], () => r(require('@/mobile/members')), 'members')
const statisticsPage = r => require.ensure([], () => r(require('@/mobile/statistics')), 'statistics')
const settingPage = r => require.ensure([], () => r(require('@/mobile/setting')), 'setting')
const testPage = r => require.ensure([], () => r(require('@/mobile/functionalTest')), 'orders')


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
        path: '/waiter',
        component: homePage,
        children: [{
            name: 'waiter',
            path: '',
            component: posPage,
            meta: []
        }, {
              path: 'orders',
              component: ordersPage,
              meta: [],
        }, {
            path: 'itemGroups',
            component: itemGroupsPage,
            meta: [],
        }, {
            path: 'members',
            component: membersPage,
            meta: [],
        }, {
            path: 'statistics',
            component: statisticsPage,
            meta: [],
        }, {
            path: 'setting',
            component: settingPage,
            meta: [],
        }, {
            path: 'testGroups',
            component: testPage,
            meta: [],
        }]
    }
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production'
})

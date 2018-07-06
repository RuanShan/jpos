import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/page/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/page/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/page/pos')), 'pos')
const itemGroupsPage = r => require.ensure([], () => r(require('@/page/itemFlow')), 'groups')
const membersPage = r => require.ensure([], () => r(require('@/page/members')), 'members')
const statisticsPage = r => require.ensure([], () => r(require('@/page/statistics')), 'statistics')
const settingPage = r => require.ensure([], () => r(require('@/page/setting')), 'setting')
const testPage = r => require.ensure([], () => r(require('@/page/functionalTest')), 'orders')


const routes = [{
        path: '/',
        name: 'home',
        component: homePage
    }, {
        path: '/login',
        name: 'login',
        component: loginPage
    }, {
          path: '/pos',
          name: 'first',
          component: posPage
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
    }, {
        path: 'testGroups',
        component: testPage,
        meta: [],
    }
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production'
})

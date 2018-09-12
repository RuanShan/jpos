import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/page/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/page/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/page/pos/index')), 'pos')
const itemGroupsPage = r => require.ensure([], () => r(require('@/page/itemFlow')), 'groups')
const membersPage = r => require.ensure([], () => r(require('@/page/members/index')), 'members')
const statisticsPage = r => require.ensure([], () => r(require('@/page/stats/index')), 'statistics')
const settingPage = r => require.ensure([], () => r(require('@/page/setting')), 'setting')
const testPage = r => require.ensure([], () => r(require('@/page/functionalTest')), 'orders')


const routes = [{
        path: '/',
        name: 'home',
        component: homePage,
        meta: { title: '缺省'},
    }, {
        path: '/login',
        name: 'login',
        component: loginPage,
        meta: {  },
    }, {
          path: '/pos',
          name: 'first',
          component: posPage,
          meta: { title: '收银' },
    }, {
        path: '/itemGroups',
        component: itemGroupsPage,
        meta: { title: '订单' },
    }, {
        path: '/members',
        component: membersPage,
        meta: { title: '会员' },
    }, {
        path: '/statistics',
        component: statisticsPage,
        meta: { title: '统计' },
    }, {
        path: '/setting',
        name: 'setting',
        component: settingPage,
        meta: { title: '设置' },
    }, {
        path: 'testGroups',
        component: testPage,
        meta: { title: '测试' },
    }
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production'
})

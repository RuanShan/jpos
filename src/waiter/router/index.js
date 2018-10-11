import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/page/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/page/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/page/pos/index')), 'pos')
const itemGroupsPage = r => require.ensure([], () => r(require('@/page/items/index')), 'groups')
const storeitemsPage = r => require.ensure([], () => r(require('@/page/items/sindex')), 'store_items')
const factoryitemsPage = r => require.ensure([], () => r(require('@/page/items/findex')), 'factory_items')
const membersPage = r => require.ensure([], () => r(require('@/page/members/index')), 'members')
const statisticsPage = r => require.ensure([], () => r(require('@/page/stats/index')), 'statistics')
const settingPage = r => require.ensure([], () => r(require('@/page/setting/index')), 'setting')
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
          name: 'pos',
          component: posPage,
          meta: { title: '收银' },
    }, {
        path: '/itemGroups',
        component: itemGroupsPage,
        meta: { title: '订单' },
    }, {
        path: '/sitems',
        component: storeitemsPage,
        meta: { title: '店订单' },
    }, {
        path: '/fitems',
        name: 'fitems',
        component: factoryitemsPage,
        meta: { title: '厂订单' },
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

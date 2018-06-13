import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginPage = r => require.ensure([], () => r(require('@/page/login')), 'login')
const homePage = r => require.ensure([], () => r(require('@/page/home')), 'home')
const posPage = r => require.ensure([], () => r(require('@/page/pos')), 'pos')
const itemGroupsPage = r => require.ensure([], () => r(require('@/page/itemFlow')), 'orders')
const membersPage = r => require.ensure([], () => r(require('@/page/members')), 'members')
const testPage = r => require.ensure([], () => r(require('@/page/functionalTest')), 'orders')


const routes = [
  {
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
    },{
			path: 'itemGroups',
			component: itemGroupsPage,
			meta: [],
    },{
			path: 'members',
			component: membersPage,
			meta: [],
		},{
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

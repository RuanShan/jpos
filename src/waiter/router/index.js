import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const pos = r => require.ensure([], () => r(require('@/page/pos')), 'pos')
const login = r => require.ensure([], () => r(require('@/page/login')), 'login')


const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/waiter',
    component: pos,
    name: '',
    children: [{
      path: '',
      component: pos,
      meta: []
    }]
  }
]

export default new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})

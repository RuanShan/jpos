import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     let user = store.state.userInfo;
//     if (!user.id) {
//       next({path: '/login', query: {redirect: to.fullPath}});
//     }
//   }
//   next();
// });

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

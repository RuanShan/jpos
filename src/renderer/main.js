// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import store from './store/store'

// 引入iview
import iview from 'iview'
import 'iview/dist/styles/iview.css'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(iview)
Vue.use(Element)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = 'https://api-demo.websanova.com/api/v1'
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
// Vue.router = router

// Vue.use(require('@websanova/vue-auth'), {
//  auth: require('./vue-auth-drivers/spree.js'),
//  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
//  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
// })
/* eslint-disable no-new */
// Start

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

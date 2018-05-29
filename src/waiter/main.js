// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// import '@/common/less/index.less';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/style/common.scss'
import '@/style/element_ui_custom.scss'

import EventBus from './plugins/EventBus'
Vue.use(EventBus)

Vue.config.productionTip = false;
Vue.use(ElementUI)


import VueXeditable from '@onekiloparsec/vue-xeditable'
import '@onekiloparsec/vue-xeditable/dist/vue-xeditable.min.css'
Vue.use(VueXeditable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
});

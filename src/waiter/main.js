// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/font-awesome.min.css'

import ElementUI from 'element-ui'
import '../../element-theme-jpos/index.css'

import '@/style/common.scss'
import '@/style/element_ui_custom.scss'

import EventBus from './plugins/EventBus'
Vue.use(EventBus)

Vue.config.productionTip = false;
Vue.use(ElementUI)
// 点击编辑
import VueXeditable from '@onekiloparsec/vue-xeditable'
import '@onekiloparsec/vue-xeditable/dist/vue-xeditable.min.css'
Vue.use(VueXeditable)

// 自动获得焦点
import AutoFocus from 'vue-auto-focus'
Vue.use(AutoFocus)

// image lozyload
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)

import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)

import {
  apiResultMixin
} from '@/components/apiResultMixin'
Vue.mixin( apiResultMixin )

import { orderDataMixin } from "@/components/mixin/DataMixin"
Vue.mixin( orderDataMixin )

router.beforeEach(function (to, from, next) {
  // 保存路径信息
  store.commit('saveTitle', to.meta.title)
  //处理用户F5刷新时
  const user = store.state.userInfo;
  console.log( "beforeEach is working", to, user)
    if ( to.name !== "login") {
        //未登录
        if (!user.id) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }else{
           next()
        }
    }else{  //已登录的情况再去登录页，跳转至首页
        next()
    }
});

import PACKAGE from '../../package.json'

store.state.version = PACKAGE['version']
console.debug( "store.state.version= ", store.state.version)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  },
  created(){
    this.$bus.$on('session-expired-gevent', () => {
      console.log('on session-expired-gevent')
      this.$store.commit('resetUser')
    })
  },
  watch: {
    // 导致错误，无法监控userInfo状态
    userInfo: function(newValue) {
      if (!newValue.id) {
        this.$message({
          type: "error",
          message: "检测到您的登录信息过期, 请重新登录"
        });
        this.$router.push("login");
      }
    }
  }
});

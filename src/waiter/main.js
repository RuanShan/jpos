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
// 点击编辑
import VueXeditable from '@onekiloparsec/vue-xeditable'
import '@onekiloparsec/vue-xeditable/dist/vue-xeditable.min.css'
Vue.use(VueXeditable)

// 自动获得焦点
import AutoFocus from 'vue-auto-focus'
Vue.use(AutoFocus)

import {
  apiResultMixin
} from '@/components/apiResultMixin'
Vue.mixin( apiResultMixin )

import { orderDataMixin } from "@/components/mixin/commonDataMixin"
Vue.mixin( orderDataMixin )

router.beforeEach(function (to, from, next) {
  console.log( "beforeEach is working", to)
  // 保存路径信息
  store.commit('saveTitle', to.meta.title)
  //处理用户F5刷新时
    const user = store.state.userInfo;
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
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

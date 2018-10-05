// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './MobileApp'
import router from './router/mindex'
import store from './store'
import './assets/css/font-awesome.min.css'
import '@/assets/mobile/css/reset.mobile.css' // global css


import ElementUI from 'element-ui'
import '../../element-theme-jpos/index.css'
Vue.use(ElementUI)

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

import EventBus from './plugins/EventBus'
Vue.use(EventBus)

Vue.config.productionTip = false;
Vue.use(Mint);

// 点击编辑
import VueXeditable from '@onekiloparsec/vue-xeditable'
import '@onekiloparsec/vue-xeditable/dist/vue-xeditable.min.css'
Vue.use(VueXeditable)

// 自动获得焦点
import AutoFocus from 'vue-auto-focus'
Vue.use(AutoFocus)

import '@/style/mobile/main.scss' // global css


import {
  apiResultMixin
} from '@/components/apiResultMixin'
Vue.mixin( apiResultMixin )

import { orderDataMixin } from "@/components/mixin/DataMixin"
Vue.mixin( orderDataMixin )

router.beforeEach(function (to, from, next) {
  //console.log( "beforeEach is working")
    const user = store.state.userInfo;
    if ( to.name !== "login") {
        //未登录
        if (!user.id) {
            router.push({name: 'login'})
        }
    }
    //已登录的情况再去登录页，跳转至首页
    if (to.name === 'login') {
        if (user.id) {
            router.push({name: 'home'});
        }
    }
    next();
});

/* eslint-disable no-new */

/*********************************移动app插件 ****************** */
if (window.navigator.platform == 'iPhone' ) {
	console.log("app模式启动")
	document.addEventListener('deviceready', function () {
		new Vue({
			el: '#app',
			router,
			store,
			template: '<App/>',
			components: {
				App
			},
      watch: {
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
		})
		window.navigator.splashscreen.hide();
		//StatusBar.styleDefault();
		window.addEventListener('native.keyboardshow', keyboardShowHandler);

		function keyboardShowHandler(e) {
			console.log('Keyboard height is: ' + e.keyboardHeight);
		}
		//cordova.plugins.Keyboard.disableScroll(true);
		if (navigator.appVersion.indexOf('11') < 0) {
			//ios11 以下判断
		}
	}, false);
} else {
	new Vue({
		el: '#app',
		router,
		store,
		template: '<App/>',
		components: {
			App
		},
    watch: {
      userInfo: function(newValue) {
        if (!newValue.id) {
          this.$message({
            type: "error",
            message: "检测到您的登录信息过期, 请重新登录"
          });
          this.$router.push( "login");
        }
      }
    }
	})
}
if (window.navigator.platform == 'iPhone'){
	//监听点击顶部bar的方法
	window.addEventListener('statusTap', function () {
		// scroll-up with document.body.scrollTop = 0; or do whatever you want
		document.getElementsByClassName("child-view")[0].body.scrollTop = 0;
	});
}
/*********************************移动端组件end ****************** */

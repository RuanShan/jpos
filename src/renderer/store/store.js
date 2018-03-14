import Vue from 'vue'
import Vuex from 'vuex'

// // 引入数据
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import authModule from './modules/auth/index'
import categoryModule from './modules/category/index'
import pageModule from './modules/page/index'
import learningPathsModule from './modules/learning-paths/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: authModule,
    category: categoryModule,
    page: pageModule,
    learningPaths: learningPathsModule
  },
  state,
  getters,
  mutations,
  actions
})

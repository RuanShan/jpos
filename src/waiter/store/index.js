import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
  adminInfo: {
    avatar: 'default.jpg'
  }
}

const mutations = {
  saveAdminInfo (state, adminInfo) {
    state.adminInfo = adminInfo
  }
}

const actions = {
  async getAdminData ({commit}) {
    try {

      const res = await getAdminInfo()
      console.log('res:', res)

      if (res.id) {
        commit('saveAdminInfo', res)
      } else {
        throw new Error(res)
      }
    } catch (err) {
      console.log('您尚未登陆或者session失效')
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})

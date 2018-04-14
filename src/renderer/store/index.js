import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
  userInfo: {
    avatar: 'default.jpg',
    shop_id: 0
  }
}

const mutations = {
  saveAdminInfo (state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  async getAdminData ({commit}) {
    try {
      const res = await getUserInfo()

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

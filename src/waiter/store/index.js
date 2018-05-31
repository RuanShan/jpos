import Vue from 'vue'
import Vuex from 'vuex'
import {
  getUserInfo
} from '@/api/getData'

Vue.use(Vuex)

const state = {
  userInfo: {
    storeId: 0,
    avatar: 'default.jpg',
    apiKey: ''
  }
}

const mutations = {
  saveAdminInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  async getAdminData({
    commit
  }) {
    try {
      const userResult = await getUserInfo()

      if (userResult.id) {
        const user = {
          storeId: 0,
          avatar: 'default.jpg',
          apiKey: ''
        }
        user.id = userResult.id
        user.storeId = userResult.store_id
        user.avatar = userResult.avatar
        user.apiKey = userResult.api_key
        user.name = userResult.username
        commit('saveAdminInfo', user)
      } else {
        throw new Error(userResult)
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

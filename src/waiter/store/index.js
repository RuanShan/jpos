import Vue from 'vue'
import Vuex from 'vuex'
import {
  getUserInfo, getPaymentMethods, getCardTypes
} from '@/api/getData'

Vue.use(Vuex)

const state = {
  userInfo: {
    storeId: 0,
    avatar: 'default.jpg',
    apiKey: ''
  },
  paymentMethods: null,
  cardTypes: null
}

const mutations = {
  saveAdminInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  savePaymentMethods( state, newPaymentMethods){
    state.paymentMethods = newPaymentMethods
  },
  saveMemberCardTypes( state, newMemberCardTypes){
    state.cardTypes = newMemberCardTypes
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
  },
  async getPaymentMethods({commit}){
    const result = await getPaymentMethods()
    const list = []
    result.payment_methods.forEach((pm)=>{
        list.push({id:pm.id, name:pm.name, active: pm.active})
    })
    commit('savePaymentMethods', list)
  },
  async getCardTypes({commit}){
    const result = await getCardTypes()
    const list = []
    result.products.forEach((obj)=>{
        list.push({id:obj.id, name:obj.name, price: obj.price})
    })
    commit('saveMemberCardTypes', list)
  }

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})

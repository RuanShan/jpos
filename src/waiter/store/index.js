import Vue from 'vue'
import Vuex from 'vuex'
import {
  getUserInfo, getPaymentMethods, getCardTypes, getStores
} from '@/api/getData'

Vue.use(Vuex)

const state = {
  userInfo: {
    storeId: 0,
    avatar: 'default.jpg',
    apiKey: ''
  },
  storeInfo:{
  },
  storeId: 0,
  title: null,// 当前路径名称
  paymentMethods: null,
  cardTypes: null,
  stores: null,
  prepaidPaymentMethodId: 1
}

const mutations = {
  resetUser(state){
    state.userInfo = {
      storeId: 0,
      avatar: 'default.jpg',
      apiKey: ''
    }
  },
  saveUser(state, userInfo) {
    state.userInfo = userInfo
    state.storeId = state.userInfo.storeId
  },
  savePaymentMethods( state, newPaymentMethods){
    state.paymentMethods = newPaymentMethods
  },
  saveMemberCardTypes( state, newMemberCardTypes){
    state.cardTypes = newMemberCardTypes
  },
  saveStore(state, storeInfo) {
    state.storeInfo = storeInfo
    state.storeId = storeInfo.id
  },
  saveStores(state, stores) {
    state.stores = stores
  },
  saveTitle( state, title){
    state.title = title
  }
}

const actions = {
  async getCurrentUser(store) {
    try {
      // 检查是否有cookies  _jpos_session,
      // 如果没有，说明session过期
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
        store.commit('saveUser', user)
      } else {
        throw new Error(userResult)
      }
    } catch (err) {
      console.log('您尚未登陆或者session失效')
    }
  },
  async getPaymentMethods( store ){
    if( store.state.paymentMethods){
      return store.state.paymentMethods
    }
    const result = await getPaymentMethods()

    const list = result.payment_methods.map((pm)=>{
        return {id:pm.id, name:pm.name, active: pm.active, posable: pm.posable}
    })

    store.commit('savePaymentMethods', list)
    return store.state.paymentMethods
  },
  async getCardTypes( store ){
    if( store.state.cardTypes){
      return store.state.cardTypes
    }
    const result = await getCardTypes()
    const list = []
    result.products.forEach((obj)=>{
        list.push({id:obj.id, name:obj.name, price: obj.price})
    })
    store.commit('saveMemberCardTypes', list)
    return store.state.cardTypes
  },
  async getStores( store ){
    if( store.state.stores){
      return store.state.stores
    }
    const result = await getStores()
    const list = []
    result.stores.forEach((obj)=>{
        list.push({id:obj.id, name:obj.name, docPrinter: obj.doc_printer_name,
          receiptPrinter: obj.receipt_printer_name, labelPrinter: obj.label_printer_name })
    })
    store.commit('saveStores', list)
    store.commit('saveStore', list[0])
    return store.state.stores
  }

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})

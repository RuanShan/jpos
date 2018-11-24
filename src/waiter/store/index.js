import Vue from 'vue'
import Vuex from 'vuex'
import {
  getPaymentMethods, getCardTypes, getStores
} from '@/api/getData'

Vue.use(Vuex)

const state = {
  userInfo: {
    avatar: 'default.jpg',
    apiKey: '',
    spree_role_names: [] // 用户角色 waiter,worker,admin
  },
  storeInfo:{
    name: "未知"
  },
  storeId: 0,
  storeType: null,
  title: null,// 当前路径名称
  paymentMethods: null,
  cardTypes: null,
  stores: null, // 设置为空数组,列表显示时不会
  prepaidPaymentMethodId: 1,
  printableOrders:[],
  userEntries: [] //用户的打卡信息，有打卡信息，才能处理业务
}

const mutations = {
  resetUser(state){
    state.userInfo = {
      avatar: 'default.jpg',
      apiKey: ''
    }
  },
  saveUser(state, userInfo) {
    state.userInfo = userInfo
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
    state.storeType = storeInfo.type
  },
  saveStores(state, stores) {
    state.stores = stores
  },
  saveTitle( state, title){
    state.title = title
  },
  saveStoreId( state, storeId){
    state.storeId = storeId
  },
  savePrintableOrders( state, orders ){
    state.printableOrders = orders
  },
  saveUserEntries( state, entries){
    state.userEntries = entries
  }
}

const actions = {

  async getPaymentMethods( store ){
    if( store.state.paymentMethods){
      return store.state.paymentMethods
    }
    const result = await getPaymentMethods()

    const list = result.payment_methods.map((pm)=>{
        return {id:pm.id, type: pm.type, name:pm.name, active: pm.active, posable: pm.posable}
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
          receiptPrinter: obj.receipt_printer_name, labelPrinter: obj.label_printer_name,
          receiptTitle: obj.receipt_title, receiptFooter: obj.receipt_footer, type: obj.type,
          stockLocationId: obj.stock_location_id, checkoutPasswordRequired: obj.checkout_password_required
         })
    })
    store.commit('saveStores', list)
    return store.state.stores
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})

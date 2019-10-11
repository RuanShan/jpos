import Vue from 'vue'
import Vuex from 'vuex'
import {
  getPaymentMethods, getCardTypes, getStores
} from '@/api/getData'

Vue.use(Vuex)

const state = {
  version: '0', // read from package.json
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
  printData:{}, // { orders:[] }
  userEntries: [], //用户的打卡信息，有打卡信息，才能处理业务
  customerServices:null, // 所有的客户服务，用来计算服务折扣
  loading: false // fetch or ajax
}

const getters = {
  onlyStores: state => {
    return state.stores.filter(item => item.type != 'Spree::Factory')
  },
  onlyFactories: state => {
    return state.stores.filter(item => item.type == 'Spree::Factory')
  }
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
    // update store in stores
    let index = state.stores.findIndex((store)=>{ return store.id == storeInfo.id})
    if( index >=0 ){
      state.stores.splice( index, 1, storeInfo )
    }
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
  savePrintData( state, orders ){
    state.printData = orders
  },
  saveUserEntries( state, entries){
    state.userEntries = entries
  },
  saveCustomerServices( state, arr){
    state.customerServices = arr
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
    let types = []
    let orderdlist = []
    result.products.forEach((obj)=>{
      // master 是 variant, 购买会员卡时，需要使用variant.id
      list.push({ id: obj.master.id, masterId: obj.master.id, productId: obj.id, name:obj.name, price: parseInt(obj.price), type: obj.type  })
      if( types.indexOf( obj.type)<0 ){
        types.push( obj.type)
      }
    })
    // 基于类型排序，基于价格排序
    types.forEach(( t)=>{
      let ordered = list.filter((obj)=> { return obj.type == t }).sort((a,b)=>{ return a.price-b.price})
      console.log( "ordered= ", ordered)
      orderdlist = orderdlist.concat( ordered )
    })
    console.log( "getCardTypes=", orderdlist, "types=", types, "list=", list )
    // 按照类型 和价格排序
    store.commit('saveMemberCardTypes', orderdlist)
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
          stockLocationId: obj.stock_location_id, checkoutPasswordRequired: obj.checkout_password_required,
          labelPrintCount: obj.label_print_count, siteSmsTemplate: obj.site_sms_templates
         })
    })
    store.commit('saveStores', list)
    return store.state.stores
  },
  async saveCustomerServices( store, arr){
    store.commit('saveCustomerServices', arr)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

import {
  mapState,
  mapActions
} from 'vuex'

export var orderDataMixin = {
  computed: {
    ...mapState(['version',
      'userInfo', 'storeId','storeInfo',
      'paymentMethods',
      'cardTypes',
      'stores',
      'prepaidPaymentMethodId',
      'printData',
      'userEntries',
      'customerServices'
    ])

  },
  data: function() {
    return {
      orderStateOptions: [{
        value: 'pending',
        label: '新订单'
      }, {
        value: 'ready_for_factory',
        label: '准备发工厂'
      }, {
        value: 'processing',
        label: '专业服务'
      }, {
        value: 'processed',
        label: '工厂验收'
      }, {
        value: 'ready_for_store',
        label: '工厂发货'
      }, {
        value: 'ready',
        label: '待交付'
      }]
    }
  },
  methods: {
    ...mapActions(['getStores','getCurrentUser', 'getPaymentMethods', 'getCardTypes','saveCustomerServices']),

    getOrderStateText(state) {
      if (state == "pending") {
        return "门店新订单"
      } else if (state == "ready") {
        return "待交付客户"
      } else if (state == "ready_for_factory") {
        return "门店发工厂"
      } else if (state == "processing") {
        return "工厂专业服务"
      } else if (state == "processed") {
        return "工厂验收"
      } else if (state == "ready_for_store") {
        return "工厂发门店"
      } else if (state == "shipped") {
        return "已交付客户"
      }
      return "未知"
    },
    //权限判断
    authorizeCreate(){
      return false
    },
    authorizeMultiStore(){
       return this.userAuthorize('MultiStore')
    },
    userAuthorize( permission ){
      let userRole = this.userInfo.roleNames[0]
      if( userRole == 'admin'){
        // delete_customer
        return true
      }else{
        if( userRole == 'waiter'){
          if( permission == 'pos' ||  permission == 'sitems'||  permission == 'members'||  permission == 'statistics'){
            return true
          }else{
            return false
          }
        }else if( userRole == 'qa'){
          if(  permission == 'fitems' ||  permission == 'statistics' ||  permission == 'statistics_works'){
            return true
          }else{
            return false
          }
        } else{
          return false
        }
      }
    },
    displayDate(){
      let date = new Date()
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    displayDateTime(){
      let date = new Date()
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    },
    //判断软件设置的地点是否为工厂
    isLocationFactory(){
      return /Factory/.test(this.storeInfo.type)
    }

  }

}

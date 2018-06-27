import {
  mapState,
  mapActions
} from 'vuex'

export var userDataMixin = {

}

export var orderDataMixin = {
  computed: {
    ...mapState([
      'userInfo', 'storeId','storeInfo',
      'paymentMethods',
      'cardTypes',
      'stores',
      'prepaidPaymentMethodId'
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
    ...mapActions(['getStores','getCurrentUser', 'getPaymentMethods', 'getCardTypes']),

    getOrderStateText(state) {
      if (state == "pending") {
        return "新订单"
      } else if (state == "ready") {
        return "待交付"
      } else if (state == "ready_for_factory") {
        return "准备发工厂"
      } else if (state == "processing") {
        return "专业服务"
      } else if (state == "processed") {
        return "工厂验收"
      } else if (state == "ready_for_store") {
        return "工厂发货"
      } else if (state == "shipped") {
        return "已交付客户"
      }
      return "未知"
    }
  },
  watch: {
    // 导致错误，无法监控userInfo状态
    // userInfo: function(newValue) {
    //   if (!newValue.id) {
    //     this.$message({
    //       type: "error",
    //       message: "检测到您的登录信息过期, 请重新登录"
    //     });
    //     this.$router.push("login");
    //   }
    // }
  }
}

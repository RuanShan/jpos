import {mapState, mapActions} from 'vuex'

export var userDataMixin = {
  computed: {
    ...mapState([
      'userInfo','latitude','longitude','cartList'
    ]),
  },
  methods: {
    ...mapActions(['getAdminData']),

  }
}


export var orderDataMixin = {
  data: function () {
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
  }
}

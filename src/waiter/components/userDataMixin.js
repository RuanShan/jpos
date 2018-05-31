import {mapState, mapActions} from 'vuex'

export var userDataMixin = {
  computed: {
    ...mapState([
      'userInfo'
    ]),
    storeId: function(){
      return this.userInfo.storeId
    }
  },
  methods: {
    ...mapActions(['getAdminData']),
  }
}

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

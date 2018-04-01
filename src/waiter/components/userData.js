import {mapActions, mapState} from 'vuex'

export var myMixin = {
  created () {
    this.hello()
    if (!this.adminInfo.id) {
      this.getAdminData()
    }
  },
  computed: {
    ...mapState(['adminInfo'])
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

export var CelUIMixin = {
  methods: {
    deleteConfirm( cb ) {
      let msg = '此操作将永久删除该数据, 是否继续?'
      this.actionConfirm( msg, cb )
    },
    cancelOrderConfirm( cb ) {
      let msg = '此操作将取消订单, 是否继续?'
      this.actionConfirm( msg, cb )
    },
    actionConfirm( msg, cb ) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cb()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作.'
        });
      });
    }

  }
}

export var CelUIMixin = {
  methods: {
    deleteConfirm( cb ) {
      let msg = '此操作将永久删除该数据, 是否继续?'
      this.actionConfirm( msg, cb )
    },
    cancelOrderConfirm( cb ) {

      let validateReturnedMemo = (val)=>{
        return val && val.length >=2
      }
      this.$prompt('请输入取消的理由', '此操作将取消订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: validateReturnedMemo,
        inputErrorMessage: '请输入2-128个字符的取消理由'
      }).then(({ value }) => {
        console.log( "取消理由", value)
        cb({memo: value})
      })
    },
    actionConfirm( msg, cb ) {
      this.$confirm(msg, '操作确认', {
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

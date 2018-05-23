// 功能：将 el-dialog 对话框组件的触发按钮放到组件之外，
//      同时保留open，close事件回调
// 用法：
//  1. 子组件template中添加 :visible="computedVisible"
//  <el-dialog title="工作量录入" :visible="computedVisible" >
//  2. 在子组件script中，添加传值属性 dialogVisible
//   props: ['dialogVisible']
//  3. 关闭按钮中调用 handleCloseDialog
//    <el-button  @click="handleCloseDialog()">关闭窗口</el-button>
//  4. 父组件中，调用子组件时设置 :dialog-visible.sync="childDialogVisible"
//  <child-component :dialog-visible.sync="workerPerformanceDialogVisible"> </child-component>

export var DialogMixin = {
  computed: {
    computedVisible: function() {
      return this.dialogVisible
    },
  },

  methods:{
    handleCloseDialog() {
      // https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
        this.$emit('update:dialogVisible', false)
    },
  }

}

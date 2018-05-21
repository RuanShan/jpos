<style lang="scss" >
.customer-button {
  height: 80px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
</style>

<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%" :fullscreen="true" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import customerButton from "@/components/customerButton.vue";

export default {
   components: {
    "customer-button": customerButton,
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
   
  }
};
</script>


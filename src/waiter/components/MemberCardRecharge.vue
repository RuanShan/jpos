<style scoped>
.grid-content {
  min-height: 30px;
}

#basic .grid-content {
  min-height: 30px;
  border: 1px solid #b6dafe;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}

</style>

<template>
  <div id="">
     <el-dialog title="提示" :visible.sync="memberCardRechargeWindowVisible"  v-if="memberCardRechargeWindowVisible" width="30%" center  @close="closeTheWindows">
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { apiResultMixin } from '@/components/apiResultMixin';
import { findOrders } from "@/api/getData";
import { getOrder } from "@/api/getData";


export default {
  props: ["memberCardRechargeWindowVisible"],
  mixins: [apiResultMixin],
  data() {
    return {
      top: "0", /* 去除直接传 0 产生的 需要参数为string的警告 */
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        displayOnOff:"" //显示标志位
    };
  },
  methods: {
    //根据会员ID得到该会员的所有订单
    async getOrdersByUserId(data) {
      this.orderDatasByUserId = await findOrders(data);
    },
    //根据订单number得到该订单数据
    async getOrderByNumber(number) {
      this.orderDataByNumber = await getOrder(number);
    },
    //打开窗口时事件处理函数-----把customerData.cards中的id转换成字符串给this.cards
    openWindow() {
      // this.displayOnOff = this.memberCardRechargeWindowVisible;
    },
    //关闭窗口时事件处理函数-----
    closeTheWindows(){
      this.$emit("onOff",false)
},
    
  }
};
</script>

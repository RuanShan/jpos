

<template>

  <div>
    <member-expense-calendar :dialog-visible.sync="memberExpCalWindowVisible" :customer-data="customerData"></member-expense-calendar>
    <div>
      <el-button type="danger" @click="openExpenseCalendarButton()">会员消费窗口</el-button>
    </div>
  </div>

</template>

<script>
import MemberExpenseCalendar from "@/components/MemberExpenseCalendar.vue";
import { getCustomer } from "@/api/getData";
import { apiResultMixin } from '@/components/apiResultMixin';


export default {
  mixins: [apiResultMixin],
  components: {
    "member-expense-calendar": MemberExpenseCalendar
  },
  data() {
    return {
      memberExpCalWindowVisible: false,
      returnServerCustomerData: {}, //调用接口,返回的数据
      customerData: {}, //整理過的顧客數據
    };
  },
  methods: {
    //获取SerVer用户数据,异步获取
    async getSverVerCustomer(Id) {
      this.returnServerCustomerData = await getCustomer(Id);
    },
    openExpenseCalendarButton() {
      // console.log("会员消费记录");
      let id = 8;
      this.getSverVerCustomer(id).then(() => {
        this.customerData = this.buildCustomerInfo(this.returnServerCustomerData);
        this.memberExpCalWindowVisible = true;  //打開會員消費記錄窗口
      });
    }
  }
};
</script>

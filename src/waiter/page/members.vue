

<template>

  <div>
    <member-expense-calendar :dialog-visible.sync="memberExpCalWindowVisible" 
          :return-server-customer-data="returnServerCustomerData"></member-expense-calendar>
    <div>
      <el-button type="danger" @click="openExpenseCalendar()">会员消费窗口</el-button>
    </div>
  </div>

</template>

<script>
import MemberExpenseCalendar from "@/components/MemberExpenseCalendar.vue";
import { getCustomer } from "@/api/getData";

export default {
  components: {
    "member-expense-calendar": MemberExpenseCalendar
  },
  data() {
    return {
      memberExpCalWindowVisible: false,
      returnServerCustomerData: {} //调用接口,返回的数据
    };
  },
  methods: {
    //获取SerVer用户数据,异步获取
    async getSverVerCustomer(Id) {
      this.returnServerCustomerData = await getCustomer(Id);
    },
    openExpenseCalendar() {
      // console.log("会员消费记录");
      let id = 8;
      this.getSverVerCustomer(id).then(() => {
        console.log("getcustomer OK");
        console.log(this.returnSerVerCustomerData);
        this.memberExpCalWindowVisible = true;
      });
    }
  }
};
</script>

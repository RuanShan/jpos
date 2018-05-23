<template>
<div class="">
  <!-- 会员关键字窗口 -> START -->
  <el-dialog title="会员关键字" :visible="computedVisible" width="30%" :before-close="handleClose" @open="handleOpen">
    <el-select v-model="inputNumber" :remote-method="searchCustomers" placeholder="请输入会员/手机号"    filterable
    remote >
    <el-option
      v-for="item in computedCustomerOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

    <span slot="footer" class="dialog-footer">
        <el-button type="">新建</el-button>
        <el-button type="primary" @click="openAddMemberWindws">确 定</el-button>
    </span>

  </el-dialog>
  <!-- 会员关键字窗口 -> END -->

  <!-- 添加会员组件 Start-->
  <member-add v-if="memberAddWindowVisible" :inputNumber="inputNumber" v-on:AddMemberReturnData="AddMemberReturnData($event)"></member-add>
  <!-- 添加会员组件 END-->

  <!-- 会员中心组件 Start-->
  <member-center v-if="memberCenterWindowVisible" ref="membercenter" :customerId="customerId" v-on:SelectMemberButton="SelectMemberButton($event)"></member-center>
  <!-- 会员中心组件 END-->
</div>
</template>

<script>
import _ from "lodash"
import MemberAdd from "@/components/MemberAdd.vue"
import MemberCenter from "@/components/MemberCenter.vue"
import {
  getCustomer,
  findCustomers
} from "@/api/getData"
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'
import {
  apiResultMixin
} from '@/components/apiResultMixin'

export default {
  components: {
    "member-add": MemberAdd,
    "member-center": MemberCenter,
  },
  data() {
    return {
      customerList: [], //
      memberAddWindowVisible: false, //添加会员窗口显示标志位
      memberCenterWindowVisible: false, //会员中心窗口显示标志位
      inputNumber: "", //输入框
      memberData: "", //用户数据
      buttonRemaining: "", //按钮余额显示
      buttonNum: "", //按钮编号显示
      NoVisible: false, //按钮中"No"显示标志位
      returnSerVerData: {}, //SerVer返回的数据
      searchReturnData: {}, //搜索提示的电话号码数据
      searchValue: [],
      customerByMobile: {}, //通过电话号码搜索得到的会员信息
      customerId: null
    };
  },
  computed: {
    computedCustomerOptions: function() {

      return this.customerList.map((customer) => {
        return {
          value: customer.id,
          label: customer.mobile
        }
      })
    }
  },
  mixins: [DialogMixin, apiResultMixin],
  props: ['dialogVisible'],
  mounted() {
    this.getSverVerCustomer(456789).then(() => {
      console.log("应该返回会员数据了");
      console.log(this.returnSerVerData);
    });
  },
  methods: {
    handleOpen() {
      console.log("computedCustomerOptions", this.computedCustomerOptions)
    },
    handleClose(done) {
      this.$emit("MemberData", this.memberData)
      done()
      this.handleCloseDialog()
    },
    openAddMemberWindws() {
      if (this.inputNumber == "1234") {
        this.$alert('已经存在"1234"用户ID', "错误提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.memberAddWindowVisible = true;
      this.memberCenterWindowVisible = false;
    },
    //添加用户组件传回来的事件处理
    AddMemberReturnData(returnData) {
      this.memberData = returnData;
      this.memberAddWindowVisible = false; //关闭添加用户窗口
      this.memberCenterWindowVisible = true; //打开用户中心窗口
      this.$nextTick(() => {
        //利用ref实现父组件通知子组件
        this.$refs.membercenter.updateForId(this.memberData.id); //this.$refs.子组件的ref名称.子组件的所有方法
      });
    },
    //接收到会员中心窗口的数据后执行
    SelectMemberButton(memberCenterData) {
      console.log("SelectMemberButton = " + memberCenterData);
      this.dialogVisible = false; //关闭查询会员窗口
      this.memberCenterWindowVisible = false; //关闭会议中心窗口
      this.memberData = memberCenterData; //会员中心的修改数据给memberData
      this.buttonRemaining = this.memberData.memberCardRemaining; //改变会员按钮上的"余额"信息,显示会员余额
      this.NoVisible = true; //按钮上的"No"显示开关
      this.buttonNum = this.memberData.memberNum; //按钮上显示会员编号
      this.inputNumber = ""; //清空KeyWord输入框
      console.log("选好了***");
    },
    //获取SerVer用户数据,异步获取
    async getSverVerCustomer(Id) {
      let Ids = "id-" + Id;
      this.returnSerVerData = await getCustomer(Ids);
    },
    //从SerVer上获取模糊搜索的用户数据,异步获取
    searchCustomers(keyword) {
      console.log( "searchCustomers")
      this.searchCustomersAsync( keyword, this);
    },
    //通过电话号码得从SerVer上获取用户数据,异步获取
    async customerFromMobile(mobile) {
    },
    //远程搜索输入框函数-----提示功能
    searchCustomersAsync:_.debounce(( keyword, vm) => {
      findCustomers({q:{mobile_or_username_cont:keyword }}).then((customersResult)=>{
        vm.customerList =  vm.buildCustomers(customersResult)
        console.log("customersResult2",vm.customerList)
      })
    },450),
    //提示功能的过滤函数-----去掉多余不符合条件的项
    createStateFilter(keyword) {
      return inputNumber => {
        return (
          inputNumber.value.toLowerCase().indexOf(keyword.toLowerCase()) ===
          0
        );
      };
    },
    //点击选中建议项时触发-----通过选中的电话号码提交SerVer得到特定会员 mobile
    handleSelect(item) {
      let obj = {
        q: {
          "mobile_cont": ""
        }
      };
      obj.q.mobile_cont = item.value;
      this.customerFromMobile(obj).then(() => {
        this.customerId = this.customerByMobile.users[0].id;
        this.dialogVisible = false;
        this.memberCenterWindowVisible = true;
      });

      console.log("选择了" + item);
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped >

</style>

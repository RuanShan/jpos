<template>
  <div class="customer_container">
    <div class="customer-button" @click="dialogVisible = true">
      <div>
        <h4 style='padding-top:10px;'>{{buttonName}}&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="font-size:12px;background:#ebb563;" v-if="NoVisible">No:&nbsp;&nbsp;{{buttonNum}}
          </span>
        </h4>
      </div>
      <div>
        <h6 style='padding-top:10px; padding-bottom:5px'>余额:&nbsp;&nbsp;{{buttonRemaining}}&nbsp;&nbsp;元</h6>
      </div>
    </div>

    <!-- 会员关键字窗口 -> START -->
    <el-dialog title="会员关键字" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @close="closeMemberKeyWordWindow()">
      <el-input v-model="inputNumber" placeholder="请输入会员/手机号"></el-input>
      <el-autocomplete v-model="inputNumber" :fetch-suggestions="querySearchAsync" placeholder="请输入会员手机号码" @select="handleSelect" :trigger-on-focus="false"></el-autocomplete>

      <span slot="footer" class="dialog-footer">
        <el-button type="">选择</el-button>
        <el-button type="">新建</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="openAddMemberWindws">确 定</el-button>
      </span>
      <el-button type="danger" @click="test()">测试</el-button>

    </el-dialog>
    <!-- 会员关键字窗口 -> END -->

    <!-- 添加会员组件 Start-->
    <member-add v-if="memberAddWindowVisible" :inputNumber="inputNumber" v-on:AddMemberReturnData="AddMemberReturnData($event)"></member-add>
    <!-- 添加会员组件 END-->

    <!-- 会员中心组件 Start-->
    <member-center v-if="memberCenterWindowVisible" ref="membercenter" :memberData="memberData" v-on:SelectMemberButton="SelectMemberButton($event)"></member-center>
    <!-- 会员中心组件 END-->
  </div>
</template>

<script>
import MemberAdd from "@/components/MemberAdd.vue";
import MemberCenter from "@/components/MemberCenter.vue";
import { getCustomer } from "@/api/getData";
import { findCustomers } from "@/api/getData";

export default {
  components: {
    "member-add": MemberAdd,
    "member-center": MemberCenter
  },
  data() {
    return {
      dialogVisible: false, //是否显示窗口标志位
      memberAddWindowVisible: false, //添加会员窗口显示标志位
      memberCenterWindowVisible: false, //会员中心窗口显示标志位
      inputNumber: "", //输入框
      memberData: "", //用户数据
      buttonName: "来宾", //按钮姓名显示
      buttonRemaining: "", //按钮余额显示
      buttonNum: "", //按钮编号显示
      NoVisible: false, //按钮中"No"显示标志位
      returnSerVerData: {}, //SerVer返回的数据
      searchReturnData: {}, //搜索提示的电话号码数据
      searchValue: [],
      restaurants: [],
      timeout: null,
      searchFlag: false
    };
  },
  mounted() {
    this.getSverVerCustomer(456789).then(() => {
      console.log("应该返回会员数据了");
      console.log(this.returnSerVerData);
    });
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
      this.buttonName = this.memberData.memberName; //改变会员按钮上的"来宾"名称,显示会员姓名
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
    async searchCustomers() {
      this.searchReturnData = await findCustomers();
    },
    //关闭窗口时处理函数-----发射memberData数据给父组件
    closeMemberKeyWordWindow() {
      this.$emit("MemberData", this.memberData);
    },
    test() {
      this.searchCustomers().then(() => {
        this.searchReturnData.users.forEach(user => {
          let val = { value: user.mobile };
          this.searchValue.push(val);
        });
        console.log("搜索用户数据成功了,感谢您!!!");
      });
    },
    querySearchAsync(queryString, cb) {
      if (this.searchFlag == true) {
        console.log("searchFlag = true 了!!!!");
        var restaurants = this.searchValue;
        var results = queryString
          ? restaurants.filter(this.createStateFilter(queryString))
          : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 10 * Math.random());
      }
    },
    createStateFilter(queryString) {
      return inputNumber => {
        return (
          inputNumber.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) { //点击选中建议项时触发
      console.log("选择了" + item);
    }
  },
  watch: {
    inputNumber: function() {
      if (this.inputNumber.length == 4) {
        this.searchCustomers().then(() => {
          this.searchReturnData.users.forEach(user => {
            let val = { value: user.mobile };
            this.searchValue.push(val);
          });
          // console.log("搜索用户数据成功了,感谢您!!!");
        });
        this.searchFlag = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped >
.customer-button {
  height: 50px;
  text-align: center;
  font-size: 21px;
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
</style>

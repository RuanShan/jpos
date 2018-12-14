<style lang="scss" scoped>
// .content {
//   position: relative;
//   background-color: #fbd570;
//   margin-left: 100px;
//   margin-right: 150px;
//   height: 250px;
// }

// .wrap {
//   position: absolute;
//   left: 50px;
//   width: 100%;
// }

// .left {
//   position: absolute;
//   top: 0;
//   left: -100px;
//   width: 100px;
//   background: #00f;
//   height: 180px;
// }

// .right {
//   position: absolute;
//   top: 0;
//   right: 0;
//   width: 150px;
//   background: #0f0;
//   height: 200px;
//   margin-right: -150px;
// }

// .center {
//   position: absolute;
//   top: 0;
//   left: 0;
//   background: #b373da;
//   height: 150px;
//   min-width: 150px;
//   width: 100%;
// }

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

<template>

    <div style="height:100%">
        <member-expense-calendar :dialog-visible.sync="memberExpCalWindowVisible" :customer-data="customerData"></member-expense-calendar>
        <member-center-new :dialog-visible.sync="memberCenterNewWindowVisible" :customer-data="customerData"></member-center-new>
        <member-recharge-record :dialog-visible.sync="memberRechargeRecordWindowVisible" :customer-data="customerData"></member-recharge-record>
        <member-edit :dialog-visible.sync="memberEditWindowVisible" :customer-data="customerData"></member-edit>
        <el-container style="height:100%">
            <el-aside width="50px">Aside</el-aside>
            <el-container style="height:100%;">
                <el-header>Header</el-header>
                <el-main style="margin-bottom: 110px;">
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" round @click="openCustomerButton()">会员按钮组件测试</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="success" round>成功按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="warning" round>警告按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="danger" round>危险按钮</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" @click="openExpenseCalendarButton">会员消费窗口</el-button>

                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="primary" @click="openCenterNewButton">会员中心窗口</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" @click="openRechargeRecordButton">会员充值记录窗口</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="danger" @click="openMemberEdit">会员编辑</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" round>主要按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="success" round>成功按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="warning" round>警告按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="danger" round>危险按钮</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" round>主要按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="success" round>成功按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="warning" round>警告按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="danger" round>危险按钮</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" round>主要按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="success" round>成功按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="warning" round>警告按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="danger" round>危险按钮</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="primary" round>主要按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="success" round>成功按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <el-button type="warning" round>警告按钮</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light">
                                <el-button type="danger" round>危险按钮</el-button>
                            </div>
                        </el-col>
                    </el-row>

                </el-main>
                <el-footer class="footer">Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import MemberExpenseCalendar from "./members/MemberExpenseCalendar.vue";
import MemberRechargeRecord from "./members/MemberRechargeRecord.vue";
import MemberCenterNew from "./members/MemberCenterNew.vue";
import MemberEdit from "./members/MemberEdit.vue";
import { getCustomer } from "@/api/getData";
import { apiResultMixin } from '@/components/apiResultMixin';

export default {
    mixins: [apiResultMixin],
    components: {
        "member-expense-calendar": MemberExpenseCalendar,
        "member-center-new": MemberCenterNew,
        "member-recharge-record": MemberRechargeRecord,
        "member-edit": MemberEdit
    },
    data() {
        return {
            memberExpCalWindowVisible: false,
            memberCenterNewWindowVisible: false,
            memberRechargeRecordWindowVisible: false,
            memberEditWindowVisible: false,
            returnServerCustomerData: {}, //调用接口,返回的数据
            customerData: {}, //整理過的顧客數據
        }
    },

    methods: {
        //获取SerVer用户数据,异步获取
        async getSverVerCustomer(Id) {
            this.returnServerCustomerData = await getCustomer(Id);
        },
        openCustomerButton() {

        },
        openExpenseCalendarButton() {
            // console.log("会员消费记录");
            let id = 8;
            this.getSverVerCustomer(id).then(() => {
                this.customerData = this.buildCustomer(this.returnServerCustomerData);
                this.returnServerCustomerData = {};
                this.memberExpCalWindowVisible = true;  //打開會員消費記錄窗口
            });
        },
        openCenterNewButton() {
            console.log("会员中心记录");
            let id = 8;
            this.getSverVerCustomer(id).then(() => {
                this.customerData = this.buildCustomer(this.returnServerCustomerData);
                this.returnServerCustomerData = {};
                this.memberCenterNewWindowVisible = true;  //打開會員中心窗口
            });
        },
        openRechargeRecordButton() {
            let id = 8;
            this.getSverVerCustomer(id).then(() => {
                this.customerData = this.buildCustomer(this.returnServerCustomerData);
                this.returnServerCustomerData = {};
                this.memberRechargeRecordWindowVisible = true;
            });
        },
        openMemberEdit() {
            let id = 8;
            this.getSverVerCustomer(id).then(() => {
                this.customerData = this.buildCustomer(this.returnServerCustomerData);
                this.returnServerCustomerData = {};
                this.memberEditWindowVisible = true;
            });
        }
    }
};
</script>

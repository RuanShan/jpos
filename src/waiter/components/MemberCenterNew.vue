<style lang="scss">
.member-container {
    .main-content {
        padding: 18px;
    }
    .box-card {
        border: 1px solid silver;
        .member-profile {
            padding: 0 16px;
            .member-table {
                th {
                    border: 1px solid silver;
                }
                td {
                    width: 12.5%;
                    border: 1px solid silver;
                }
            }
        }
        .cards-wrap {
            padding: 0 16px;
            position: absolute;
            left: 0;
            right: 0;
            top: 110px;
            bottom: 16px;
            .card-tabs {
                .card-table {
                    th {
                        border: 1px solid silver;
                    }
                    td {
                        width: 12.5%;
                        border: 1px solid silver;
                    }
                }
            }
            .card-records-wrap {
                position: absolute;
                top: 150px;
                bottom: 0;
                left: 0;
                right: 0;
            }
        }
    }
}
</style>

<template>
<div class="member-container " v-if="customerData">
  <card-form :dialog-visible.sync="cardFormVisible" :customer-data="customerData" @card-created-event="handleCustomerChanged"></card-form>
  <member-card-recharge :dialog-visible.sync="displayRecharge" :customer-data="customerData" :card-data="cardData"  @deposit-order-created-event="handleDepositOrderCreated"></member-card-recharge>
  <member-edit :dialog-visible.sync="displayMemberEdit" :customer-data="customerData" @customer-changed-event="handleCustomerChanged"></member-edit>
  <member-card-edit :dialog-visible.sync="displayMemberCardEdit" :customer-data.sync="customerData" :card-data.sync="cardData" @card-changed-event="handleCardChanged"></member-card-edit>
  <div class="cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="'0'" :modal="false" @open="openWindow()">
      <div slot="title" class="title-wrap">
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div>会员中心</div>
      </div>
      <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->
      <div class="box-card fillcontain">
        <!-- 会员基本信息 START-->
        <div class="member-profile">
          <div class="head">
            <span>会员信息 (消费 ¥{{statis.normalOrderTotal}}) </span>
            <el-button type="info" size="mini" @click="curentEdit" class="right">会员编辑</el-button>
          </div>
          <table class="member-table">
            <tr>
              <th> 会员姓名 </th>
              <td> {{customerData.userName}} </td>
              <th> 会员电话 </th>
              <td> {{customerData.mobile}}</td>
              <th> 会员性别</th>
              <td> {{customerData.displayGender}}</td>
              <th> 会员生日</th>
              <td> {{customerData.displayBirth}}</td>
            </tr>
            <tr>
              <th> 所属门店</th>
              <td> {{customerData.storeName}}</td>
              <th> 注册日期</th>
              <td> {{customerData.displayCreatedAt}}</td>
              <th> 备注</th>
              <td colspan="3"> {{customerData.memo}}</td>

            </tr>
          </table>
        </div>
        <!-- 会员基本信息 END-->
        <div class="cards-wrap" style="margin-top: 10px;">
          <el-button type="danger" size="mini" @click="addCardButtonClicked" style="float: right;z-index: 999;position: relative;">添&nbsp;&nbsp;加&nbsp;&nbsp;会&nbsp;&nbsp;员&nbsp;&nbsp;卡</el-button>
          <el-tabs type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick" class="card-tabs cel-scrollable-tabs">
            <el-tab-pane v-for="(item) in cards" :key="item.code" :label="item.title" :name="item.code">
              <div class="clear ">
                <div class="left">
                  <span>余额</span>
                  <span>¥ {{item.amountRemaining}}</span>
                </div>
                <div class="left">
                  <span>充值记录</span>
                  <span>¥ {{item.amount}}</span>
                </div>
                <div class="left">
                  <span>消费记录</span>
                  <span>¥ {{item.amountUsed}}</span>
                </div>
                <div class="right">
                  <el-button type="info" size="mini" @click="cardEdit(item)">卡编辑</el-button>
                  <el-button type="danger" plain size="mini" @click="cardRecharge(item)">会员卡充值</el-button>
                </div>
              </div>
              <!-- 在tab中的卡详情表 START -->
              <table class="card-table">
                <tr>
                  <th>会员卡号</th>
                  <td>{{item.code}}</td>
                  <th>会员卡类型</th>
                  <td>{{item.displayStyle}}</td>
                  <th>会员卡级别</th>
                  <td>{{item.name}}</td>
                  <th>会员卡状态</th>
                  <td>{{item.displayStatus}}</td>
                </tr>
                <tr>
                  <th>开卡门店</th>
                  <td>{{item.openCardSite}}</td>
                  <th>开卡日期</th>
                  <td>{{item.displayCreatedAt}}</td>
                  <th>到期时间</th>
                  <td>{{item.displayExpireAt}}</td>
                  <th>备注</th>
                  <td>{{item.memo}}</td>
                </tr>
                <tr>
                </tr>
              </table>
              <div class="card-records-wrap">
                <el-tabs type="border-card" v-model="cardRecordTabName" class="card-records  cel-scrollable-tabs">
                  <el-tab-pane label="消费记录" name="orders">
                      <card-order-list :customer-data="customerData" :card-data="item"></card-order-list>
                  </el-tab-pane>
                  <el-tab-pane label="充值记录" name="deposits">
                      <card-deposit-list :customer-data="customerData" :card-data="item"></card-deposit-list>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>

    </el-dialog>
  </div>
</div>
</template>


<script>
import {
  DialogMixin
} from "@/components/mixin/DialogMixin";

import {
  getCustomerStatis,
  findOrders
} from "@/api/getData";
import {
  getOrder
} from "@/api/getData";
import CardForm from "@/components/common/CardForm.vue";
import CardOrderList from "@/components/common/CardOrderList.vue";
import CardDepositList from "@/components/common/CardDepositList.vue";
import MemberCardRecharge from "@/components/MemberCardRecharge.vue";
import MemberExpenseCalendar from "@/components/MemberExpenseCalendar.vue";
import MemberRechargeRecord from "@/components/MemberRechargeRecord.vue";
import MemberEdit from "@/components/MemberEdit.vue";
import MemberCardEdit from "@/components/MemberCardEdit.vue";


export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin],
  components: {
    "card-form": CardForm,
    "member-card-recharge": MemberCardRecharge,
    "member-expense-calendar": MemberExpenseCalendar,
    "member-recharge-record": MemberRechargeRecord,
    "card-order-list": CardOrderList,
    "card-deposit-list": CardDepositList,
    "member-edit": MemberEdit,
    "member-card-edit": MemberCardEdit
  },
  data() {
    return {
      customer: null,
      cardFormVisible: false,
      tabsNumber: "", //每次点击别的tab是tabsNumber动态变化
      amountRemaining: "", //每张卡的余额
      statis: {},
      cardData: {}, //选中的当前会员卡的数据
      cardRecordTabName: 'orders',
      displayRecharge: false, //会员卡充值界面是否显示标志位
      displayMemberEdit: false, //会员编辑窗口是否打开标志位
      displayMemberCardEdit: false, // 会员卡编辑窗口是否打开标志位
    };
  },
  computed:{
    cards: function(){
      //顾客会员卡数组
      let arr = []
      if( this.customerData.cards ){
        this.customerData.cards.forEach((card) => {
          let obj = {};
          obj.title = "卡号: " + card.code;
          Object.assign(obj, card)
          arr.push(obj);
        })
      }
      const nocard = { title: "无卡消费", code: ""   }
      arr.push(nocard)
      return arr
    }
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
    // "cards": [{  //这是我MJPos上的数据
    //         "id": 1,
    //         "user_id": 8,
    //         "code": "056",
    //         "current_value": "1000.0",
    //         "name": "PrepaidCard1000 - Master",
    //         "card_type": "储值卡",
    //         "card_grade": "8000元---5折",
    //         "card_state_now": "可用",
    //         "create_time": "2018-05-24",
    //         "indate": "3年",
    //         "open_card_site": "青云街店",
    //         "memo": "不包括皮衣皮包貂皮",
    //         "stop_time": "2021-05-24"
    //     },
    async openWindow() {
      this.initData()
    },
    async initData() {
      const result = await getCustomerStatis(this.customerData.id)
      this.statis = this.buildCustomerStatis(result)
      this.tabsNumber = this.cards[0].code //openWindos后选中第一个tabs,之后每次点击别的tab是tabsNumber动态变化
    },
    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      console.log(this.tabsNumber);
    },
    //当前卡的充值按钮事件处理函数-----调到充值界面
    cardRecharge(item) {

      this.cardData = item
      this.displayRecharge = true
      // console.log("应该打开充值窗口了");
    },

    //当前卡的消费记录按钮事件处理函数-----调到充值界面
    cardExpenseCalendar() {

    },
    //会员编辑按钮单击事件处理函数-----
    curentEdit() {
      console.log("会员编辑 -- 按钮点击了!!!");
      this.displayMemberEdit = true;
    },
    //返回按钮事件处理函数-----
    returnWindow() {
      this.dialogVisible = false;
    },
    //当前会员卡编辑按钮单击事件处理函数-----
    cardEdit( item ) {
      this.displayMemberCardEdit = true
      this.cardData = item
    },
    //添加会员卡点击事件处理函数-----
    addCardButtonClicked() {
      console.log("--addCardButtonClicked--")
      this.cardFormVisible = true
    },
    //会员卡充值组件传过来的发射事件
    cardRechargeOnOff() {
      console.log("接收到了发射过来的消息了**********");
      this.displayRecharge = false;
    },
    handleCustomerChanged(newCustomer) {
      console.log("handleCustomerChanged", newCustomer)
      //处理会员卡添加，会员信息更改
      this.$emit('update:customerData', newCustomer)
      //上面的语句更新了customerData,但是会员列表页没有自动刷新
      this.$emit("customer-changed-event", newCustomer);
    },
    handleCardChanged(changedCard){
      //构造新的客户对象，
      const newCustomer = Object.assign({}, this.customerData)
      let index = newCustomer.cards.findIndex((card)=>{
        return changedCard.id == card.id
      })
      newCustomer.cards.splice(index, 1, changedCard)
      this.handleCustomerChanged( newCustomer )
    },
    handleDepositOrderCreated( changedCard){
      console.log("handleDepositOrderCreated", changedCard)
      this.$bus.$emit('deposit-order-created-gevent')
      this.handleCardChanged(changedCard)
    },
    //接收到会员编辑窗口子组件发射来的事件处理函数-----
    memberEditOnOff() {
      this.displayMemberEdit = false;
    },
    //接收到会员卡卡卡编辑窗口子组件发射来的事件处理函数-----
    memberCardEditOnOff() {
      this.displayMemberCardEdit = false;
    },

  }
};
</script>

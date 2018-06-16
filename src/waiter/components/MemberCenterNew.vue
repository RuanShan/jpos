<style lang="scss">
.member-container {
    .main-content {
        padding: 18px;
    }
    .box-card {
        border: 1px solid silver;
        .member-profile {
            padding: 0 16px;
            .member-table{
              th{ border: 1px solid silver;}
              td{
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
              .card-table{
                th{ border: 1px solid silver;}
                td{
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
<div class="member-container ">
  <card-form :dialog-visible.sync="cardFormVisible" :customer-data.sync="customerData" @card-created-event="handleCardCreated"></card-form>
  <member-expense-calendar :dialog-visible.sync="memberExpCalWindowVisible" :customer-data="customerData"></member-expense-calendar>
  <member-recharge-record :dialog-visible.sync="memberRechargeRecordWindowVisible" :customer-data="customerData"></member-recharge-record>
  <member-card-recharge v-if="displayRecharge" :cardData="cardData" :customer-data="customerData" @onOff="onOff($event)"></member-card-recharge>
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
          <table class="member-table" >
            <tr>
              <th> 会员姓名 </th>
              <td> {{customerData.userName}} </td>
              <th> 会员电话 </th>
              <td> {{customerData.mobile}}</td>
              <th> 会员性别</th>
              <td> {{customerData.sex}}</td>
              <th> 会员生日</th>
              <td> {{customerData.displayBirth}}</td>
            </tr>
            <tr>
              <th> 所属门店</th>
              <td > {{customerData.address}}</td>
              <th> 创建日期</th>
              <td > {{customerData.address}}</td>
              <th> 备注</th>
              <td colspan="3"> {{customerData.address}}</td>

            </tr>
          </table>
        </div>
        <!-- 会员基本信息 END-->
        <div class="cards-wrap" style="margin-top: 10px;">
          <el-button type="danger" size="mini" @click="addCardButtonClicked" style="float: right;z-index: 999;position: relative;">添&nbsp;&nbsp;加&nbsp;&nbsp;会&nbsp;&nbsp;员&nbsp;&nbsp;卡</el-button>
          <el-tabs type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick" class="card-tabs cel-scrollable-tabs">
            <el-tab-pane v-for="(item) in cards" :key="item.name" :label="item.title" :name="item.name">
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
                  <el-button type="info" size="mini" @click="cardEdit">卡编辑</el-button>
                  <el-button type="primary" size="mini" @click="cardRecharge">会员卡充值</el-button>
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
                  <td >{{item.memo}}</td>
                </tr>
                <tr>
                </tr>
              </table>
              <div class="card-records-wrap">
                <el-tabs type="border-card" @tab-click="handleClick" class="card-records  cel-scrollable-tabs">
                  <el-tab-pane label="消费记录" name="first">
                    <card-order-list :customer-data="customerData"></card-order-list>
                  </el-tab-pane>
                  <el-tab-pane label="充值记录" name="second">
                    <card-order-list :customer-data="customerData"></card-order-list>
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
  apiResultMixin
} from '@/components/apiResultMixin';
import {
  getCustomerStatis,
  findOrders
} from "@/api/getData";
import {
  getOrder
} from "@/api/getData";
import CardForm from "@/components/common/CardForm.vue";
import CardOrderList from "@/components/common/CardOrderList.vue";
import MemberCardRecharge from "@/components/MemberCardRecharge.vue";
import MemberExpenseCalendar from "@/components/MemberExpenseCalendar.vue";
import MemberRechargeRecord from "@/components/MemberRechargeRecord.vue";

export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  components: {
    "card-form": CardForm,
    "member-card-recharge": MemberCardRecharge,
    "member-expense-calendar": MemberExpenseCalendar,
    "member-recharge-record": MemberRechargeRecord,
    "card-order-list": CardOrderList
  },
  data() {
    return {
      customer: null,
      cardFormVisible: false,
      memberExpCalWindowVisible: false,
      memberRechargeRecordWindowVisible: false,
      tabsNumber: "", //每次点击别的tab是tabsNumber动态变化
      amountRemaining: "", //每张卡的余额
      cards: [], //顾客会员卡数组
      statis: {},
      cardData: {}, //选中的当前会员卡的数据
      displayRecharge: false, //会员卡充值界面是否显示标志位
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

      this.cards = []
      if (this.customerData.cards.length > 0) {
        this.customerData.cards.forEach((card) => {
          let obj = {};
          obj.title = "卡号: " + card.code;
          Object.assign(obj, card)
          this.cards.push(obj);
        })
      } else {
        const nocard = {
          title: "无",
          name: "无"
        }
        this.cards.push(nocard);
      }

      this.tabsNumber = this.cards[0].name; //openWindos后选中第一个tabs,之后每次点击别的tab是tabsNumber动态变化
    },
    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      console.log(this.tabsNumber);
    },
    //当前卡的充值按钮事件处理函数-----调到充值界面
    cardRecharge() {
      let which = this.cards.findIndex((values, index, arr) => { //找第几个对象中包含当前的tabsNumber,也就是当前是当前会员的哪一张会员卡
        return values.name == this.tabsNumber;
      });
      this.cardData = this.cards[which];
      this.displayRecharge = true;
      // console.log("应该打开充值窗口了");
    },
    //当前卡的充值记录事件处理函数-----调到充值界面
    cardRechargeRecord() {


    },
    //当前卡的消费记录按钮事件处理函数-----调到充值界面
    cardExpenseCalendar() {

    },
    //当前顾客全部的充值记录按钮事件处理函数-----调到充值界面
    openRechargeRecordWindow() {
      this.memberRechargeRecordWindowVisible = true
    },
    //当前顾客全部的消费记录按钮事件处理函数-----调到充值界面
    openExpenseCalendarWindow() {
      this.memberExpCalWindowVisible = true
    },
    //会员编辑按钮单击事件处理函数-----
    curentEdit() {

    },
    //返回按钮事件处理函数-----
    returnWindow() {
      this.dialogVisible = false;
    },
    //当前会员卡编辑按钮单击事件处理函数-----
    cardEdit() {

    },
    //添加会员卡点击事件处理函数-----
    addCardButtonClicked() {
      console.log("--addCardButtonClicked--")
      this.cardFormVisible = true
    },
    handleCardCreated(newCustomer) {
      this.customerData = newCustomer
      console.log("--handleCardCreated--")
    },
    //会员卡充值组件传过来的发射事件
    onOff(flage) {
      console.log("接收到了发射过来的消息了**********");
      this.displayRecharge = flage;
      this.memberCardRechargeWindowVisible = flage;
    }
  }
};
</script>

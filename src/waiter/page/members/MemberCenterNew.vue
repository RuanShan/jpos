<style lang="scss">
.member-container {
    .main-content {
        padding: 18px;
    }
    .box-card {
        border: 1px solid #ebeef5;
        .member-profile {
            padding: 0 16px;
            .head {
                line-height: 36px;
            }
            .member-table {
                th {
                    border: 1px solid #ebeef5;
                }
                td {
                    width: 12.5%;
                    border: 1px solid #ebeef5;
                }
            }
        }
        .cards-wrap {
            padding: 0 16px;
            position: absolute;
            left: 0;
            right: 0;
            top: 100px;
            bottom: 16px;
            .card-tabs {
                .card-table {
                    th {
                        width: 100px;
                        border: 1px solid #ebeef5;
                    }
                    td {
                        border: 1px solid #ebeef5;
                    }
                }
            }
            .card-records-wrap {
                position: absolute;
                top: 100px;
                bottom: 0;
                left: 0;
                right: 0;
                &.nocard-records-wrap{
                  top:34px;
                }
            }
        }
    }
    .edit-member-button{
      margin: 5px 0 0 0;
    }
    .edit-card-buttons{
      margin: 0 0 5px 5px;
    }
    .add-card-button{
      margin: 5px;
      z-index: 999;
      position: relative;
    }
    .money-wrap{
      line-height: 20px;
    }
    .wxfollower-cell{
      position: relative;
      .nickname{
        display: inline-block;
        max-width: 14em;
        padding-right: 1em;
      }
      .discard-wxfollower-button{
        padding: 0;
        position: absolute;
        right: 5px;
        top: 6px;
        background-color: #fff;
        border-color:  transparent;
      }
    }

}
</style>

<template>
<div class="member-container " v-if="customerData">
  <CardTransfer :dialog-visible.sync="cardTransferVisible" :customer-data="customerData" :card-data="cardData"  @card-transfered-event="handleCardChanged"></CardTransfer>
  <card-form :dialog-visible.sync="cardFormVisible" :customer-data="customerData" @card-created-event="handleCardChanged"></card-form>
  <member-card-recharge :dialog-visible.sync="displayRecharge" :customer-data="customerData" :card-data="cardData" @deposit-order-created-event="handleDepositOrderCreated"></member-card-recharge>
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
            <el-button type="success" size="mini" @click="curentEdit" class="right edit-member-button">会员编辑</el-button>
          </div>
          <table class="member-table table">
            <tr>
              <th> 会员姓名 </th>
              <td> {{customerData.userName}} <span v-show="customerData.cards.length==0"> [{{customerData.customerType}}] </span></td>
              <th> 会员电话 </th>
              <td> {{customerData.mobile}}</td>
              <th> 会员性别</th>
              <td> {{customerData.displayGender}}</td>
              <th> 关联微信</th>
              <td class="wxfollower-cell">
                <span v-show="customerData.wxFollowerNickname" class="nickname ellipsis"> {{customerData.wxFollowerNickname}} </span>
                <el-button type="danger" icon="el-icon-delete" circle class="discard-wxfollower-button" v-show="customerData.wxFollowerNickname" @click="handleDiscardWxfollower"></el-button>
                <span v-show="!customerData.wxFollowerNickname"> 无 </span>

              </td>
            </tr>
            <tr>
              <th> 所属门店</th>
              <td> {{customerData.storeName}}</td>
              <th> 注册日期</th>
              <td> {{customerData.displayCreatedDate}}</td>
              <th> 备注</th>
              <td colspan="3"> {{customerData.memo}}</td>

            </tr>
          </table>
        </div>
        <!-- 会员基本信息 END-->
        <div class="cards-wrap" style="">
          <el-button type="success" size="mini" @click="addCardButtonClicked" class="right add-card-button">添加会员卡</el-button>
          <el-tabs type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick" class="card-tabs cel-scrollable-tabs">
            <el-tab-pane v-for="(item) in cards" :key="item.code"  :name="item.code">
              <span slot="label">  <i class="el-icon-circle-check-outline" v-show="item.state=='enabled'"></i>
                <i class="el-icon-circle-close-outline" v-show="item.state=='disabled'"></i>
               {{item.title}}</span>

              <div class="clear ">
                <div class="left clear" v-if="item.style==CardStyleEnum.prepaid">
                  <div class="left money-wrap">
                    <span>当前余额</span>
                    <span>¥ {{item.amountRemaining}}</span>
                  </div>
                  <div class="left money-wrap">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;充值金额</span>
                    <span>¥ {{item.amount}}</span>
                  </div>
                  <div class="left money-wrap">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费金额</span>
                    <span>¥ {{item.amountUsed}}</span>
                  </div>
                </div>
                <div class="left clear" v-if="item.style==CardStyleEnum.times">
                  <div class="left money-wrap">
                    <span>剩余次数</span>
                    <span> {{item.amountRemaining}}</span>
                  </div>
                  <div class="left money-wrap">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费次数</span>
                    <span> {{item.amountUsed}}</span>
                  </div>
                </div>

                <div class="right edit-card-buttons">
                  <el-button-group v-show="item.id" >
                    <el-button type="success" size="mini" @click="cardEdit(item)">会员卡编辑</el-button>
                    <el-button type="success" size="mini" @click="cardRecharge(item)">会员卡充值</el-button>
                    <el-button type="success" size="mini" @click="cardTransfer(item)">会员卡转卡</el-button>
                  </el-button-group>

                </div>
              </div>
              <!-- 在tab中的卡详情表 START -->
              <table class="card-table table">
                <tr>
                  <th>会员卡号</th>
                  <td>{{item.code}}</td>
                  <th>会员卡类型</th>
                  <td>{{item.displayStyle}}</td>
                  <th>会员卡级别</th>
                  <td>{{item.name}}</td>
                  <th>会员卡状态</th>
                  <td>{{item.displayState}}</td>
                </tr>
                <tr>
                  <th>开卡门店</th>
                  <td>{{item.storeName}}</td>
                  <th>开卡日期</th>
                  <td>{{item.displayCreatedAt}}</td>
                  <th>到期日期</th>
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
                    <card-order-list :customer-data="customerData" :card-data="item"  @order-changed-event="handleOrderChanged"></card-order-list>
                  </el-tab-pane>
                  <el-tab-pane label="充值记录" name="deposits"  v-if="item.code.length>0">
                    <card-deposit-list :customer-data="customerData" :card-data="item" @card-changed-event="handleCardChanged"></card-deposit-list>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>

            <el-tab-pane label="无卡消费" name="">
              <div class="clear ">
                <div class="left money-wrap">
                  <span>消费金额</span>
                  <span>¥ {{this.statis.nocardOrderTotal}}</span>
                </div>

              </div>
              <!-- 在tab中的卡详情表 START -->

              <div class="card-records-wrap nocard-records-wrap">
                <el-tabs type="border-card" v-model="cardRecordTabName" class="card-records  cel-scrollable-tabs">
                  <el-tab-pane label="消费记录" name="orders">
                    <card-order-list :customer-data="customerData" ></card-order-list>
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
  CelUIMixin
} from '@/components/mixin/CelUIMixin';
import {
  getCustomerStatis,
  findOrders,
  discardWxfollower
} from "@/api/getData";
import {
  getOrder
} from "@/api/getData";
import CardForm from "@/components/common/CardForm.vue";
import CardTransfer from "@/components/common/CardTransfer.vue";
import CardDepositList from "./components/CardDepositList.vue";
import CardOrderList from "./components/CardOrderList.vue";
import MemberCardRecharge from "./MemberCardRecharge.vue";
import MemberRechargeRecord from "./MemberRechargeRecord.vue";
import MemberEdit from "./MemberEdit.vue";
import MemberCardEdit from "./MemberCardEdit.vue";


export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, CelUIMixin],
  components: {
    CardTransfer,
    "card-form": CardForm,
    "member-card-recharge": MemberCardRecharge,
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
      cardTransferVisible: false,
      tabsNumber: "", //每次点击别的tab是tabsNumber动态变化
      amountRemaining: "", //每张卡的余额
      statis: {},
      cardData: {}, //选中的当前会员卡的数据
      cardRecordTabName: 'orders',
      displayRecharge: false, //会员卡充值界面是否显示标志位
      displayMemberEdit: false, //会员编辑窗口是否打开标志位
      displayMemberCardEdit: false, // 会员卡编辑窗口是否打开标志位
      ordersWithoutCard:{
        amountRemaining:0,
        amount:0,
        amountUsed:0
      }
    };
  },
  created(){
    // handle user repay
    this.$bus.$on('customer-changed-gevent', (newCustomer) => {
      console.log('on customer-changed-gevent')
      this.handleCustomerChanged(newCustomer)
      this.initData()
    })
  },
  computed: {
    cards: function () {
      //顾客会员卡数组
      let arr = []
      if (this.customerData.cards) {
        this.customerData.cards.forEach((card) => {
          let obj = {}
          obj.title = "卡号: " + card.code
          let store = this.stores.find((s) => {
            return s.id == card.storeId
          })
          if (store) {
            obj.storeName = store.name
          }
          Object.assign(obj, card)
          arr.push(obj)
        })
      }
      //const nocard = {
      //  title: "无卡消费",
      //  code: ""
      //}
      //arr.push(nocard)
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

    openWindow() {
      this.initData()
    },
    async initData() {
      const result = await getCustomerStatis(this.customerData.id)
      this.statis = this.buildCustomerStatis(result)
      if( this.cardData.code != null){
        this.tabsNumber = this.cardData.code
      }
      else if( this.cards.length>0){
        this.tabsNumber = this.cards[0].code //openWindos后选中第一个tabs,之后每次点击别的tab是tabsNumber动态变化
      }
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
    cardEdit(item) {
      this.cardData = item
      this.displayMemberCardEdit = true
    },
    //当前会员卡转卡按钮单击事件处理函数-----
    cardTransfer(item) {
      this.cardData = item
      this.cardTransferVisible = true
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
    handleCardChanged(changedCard) {
      //添加会员卡或者修改会员卡信息，
      //构造新的客户对象，
      const newCustomer = Object.assign({}, this.customerData)
      let index = newCustomer.cards.findIndex((card) => {
        return changedCard.id == card.id
      })
      console.log( " handleCardChanged: ", changedCard)
      if( index >=0){ //修改
        this.$set( newCustomer.cards, index, changedCard)
      }else{// 添加
        newCustomer.cards.push( changedCard )
      }
      // update newCustomer.prepaidCard
      newCustomer.prepaidCard = newCustomer.cards.find((card)=>{ return (card.state == this.CardStateEnum.enabled && card.style== this.CardStyleEnum.prepaid)})
      newCustomer.timesCard = newCustomer.cards.find((card)=>{ return (card.state == this.CardStateEnum.enabled && card.style== this.CardStyleEnum.times)})
      newCustomer.card = newCustomer.prepaidCard || newCustomer.timesCard
      this.handleCustomerChanged(newCustomer)
    },
    handleOrderChanged(changes){
      // 订单信息改变，需要更新对应支付使用的会员卡信息
      let { changedCard } = changes

      if( changedCard){
        this.handleCardChanged(changedCard)
      }
      // 重新统计订单消费金额
      this.initData()

    },
    handleDepositOrderCreated(changedCard) {
      console.log("handleDepositOrderCreated", changedCard)
      this.$bus.$emit('deposit-order-created-gevent')
      this.handleCardChanged(changedCard)
    },
    handleDiscardWxfollower(){
      //删除关联会员
      this.deleteConfirm(()=>{
        discardWxfollower( this.customerData.id ).then(()=>{
          let newCustomer = Object.assign({}, this.customerData )
          newCustomer.wxFollowerNickname = null
          this.handleCustomerChanged(newCustomer)
        })
      })
    }
    //接收到会员卡卡卡编辑窗口子组件发射来的事件处理函数-----

  }
};
</script>

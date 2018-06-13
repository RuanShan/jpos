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
  <div class="add_member_container ">
    <div class="cel-window" >
      <!-- 会员添加窗口 -> START -->
      <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="openWindow()" >
        <div slot="title" class="title-wrap">
          <div class="left back">
            <i class="el-icon-back" @click="handleCloseDialog()"></i>
          </div>
          <div>会&nbsp;&nbsp;&nbsp;员&nbsp;&nbsp;&nbsp;中&nbsp;&nbsp;&nbsp;心</div>
        </div>
        <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->
        <el-row>
          <el-col :span="1">
            <div class="grid-content"></div>
          </el-col>
          <el-col :span="22">
            <div class="grid-content">
              <el-row>
                <el-col :span="7">
                  <div class="grid-content bg-purple" style="margin-top: 10px;">
                    <fieldset>
                      <legend>会员信息</legend>
                      <!-- 会员基本信息 START-->
                      <div id="basic" style="margin-top: 10px;">
                        <el-row>
                          <el-col :span="10">
                            <div class="grid-content bg-purple">会员姓名</div>
                          </el-col>
                          <el-col :span="14">
                            <div class="grid-content bg-purple-light">{{customerData.userName}}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="10">
                            <div class="grid-content bg-purple">会员电话</div>
                          </el-col>
                          <el-col :span="14">
                            <div class="grid-content bg-purple-light">{{customerData.mobile}}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="10">
                            <div class="grid-content bg-purple">会员性别</div>
                          </el-col>
                          <el-col :span="14">
                            <div class="grid-content bg-purple-light">{{customerData.sex}}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="10">
                            <div class="grid-content bg-purple">会员生日</div>
                          </el-col>
                          <el-col :span="14">
                            <div class="grid-content bg-purple-light">{{customerData.displayBirth}}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="10">
                            <div class="grid-content bg-purple">地址</div>
                          </el-col>
                          <el-col :span="14">
                            <div class="grid-content bg-purple-light">{{customerData.address}}</div>
                          </el-col>
                        </el-row>
                      </div>
                      <!-- 会员基本信息 END-->
                      <!-- 该会员的充值记录和消费记录 START-->
                      <table border="1" cellspacing="0" width="100%" style="margin-top:25px;">
                        <tr>
                          <td width="30%">充值记录</td>
                          <td width="30%">X</td>
                          <td width="30%">
                            <el-button type="primary" size="mini" @click="addCard" style="float: right;z-index: 999;position: relative;">查&nbsp;&nbsp;看</el-button>
                          </td>
                        </tr>
                        <tr>
                          <td width="30%">消费记录</td>
                          <td width="30%">X</td>
                          <td width="30%">
                            <el-button type="primary" size="mini" @click="addCard" style="float: right;z-index: 999;position: relative;">查&nbsp;&nbsp;看</el-button>
                          </td>
                        </tr>
                      </table>
                      <!-- 该会员的充值记录和消费记录 END-->
                      <el-row>
                        <el-col :span="24">
                          <div class="grid-content bg-purple-dark" style="text-align:center;margin-top:25px;">
                            <el-button type="info" @click="curentEdit">会员编辑</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </fieldset>

                  </div>
                </el-col>
                <el-col :span="17">
                  <div class="grid-content " style="margin-top: 10px;">
                    <el-button type="danger" size="mini" @click="addCard" style="float: right;z-index: 999;position: relative;">添&nbsp;&nbsp;加&nbsp;&nbsp;会&nbsp;&nbsp;员&nbsp;&nbsp;卡</el-button>
                    <el-tabs type="border-card" v-model="tabsNumber" @tab-click="tabHandleClick">
                      <el-tab-pane v-for="(item) in cards" :key="item.name" :label="item.title" :name="item.name">
                        <el-row>
                          <el-col :span="4">
                            <div class="grid-content "></div>
                          </el-col>
                          <el-col :span="16" id="basic">
                            <div class="grid-content ">
                              <el-row>
                                <el-col :span="8">
                                  <div class="grid-content bg-purple-light" style="text-align:center;">
                                    <div>余&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额</div>
                                    <div>¥ {{item.currentValue}}</div>
                                    <div>
                                      <el-button type="primary" size="mini" @click="cardRecharge">充&nbsp;&nbsp;值</el-button>
                                    </div>
                                  </div>
                                </el-col>
                                <el-col :span="8">
                                  <div class="grid-content bg-purple" style="text-align:center;">
                                    <div>充&nbsp;值&nbsp;记&nbsp;录</div>
                                    <div>¥ {{currentValue}}</div>
                                    <div>
                                      <el-button type="primary" size="mini" @click="cardRechargeRecord">查&nbsp;&nbsp;看</el-button>
                                    </div>
                                  </div>
                                </el-col>
                                <el-col :span="8">
                                  <div class="grid-content bg-purple-light" style="text-align:center;">
                                    <div>消&nbsp;费&nbsp;记&nbsp;录</div>
                                    <div>¥ {{currentValue}}</div>
                                    <div>
                                      <el-button type="primary" size="mini" @click="cardExpenseCalendar">查&nbsp;&nbsp;看</el-button>
                                    </div>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div class="grid-content "></div>
                          </el-col>
                        </el-row>
                        <!-- 在tab中的卡详情表 START -->
                        <table border="1" cellspacing="0" width="100%" style="margin-top: 25px;">
                          <tr>
                            <td width="25%">会员卡类型</td>
                            <td width="25%">{{item.cardType}}</td>
                            <td width="25%">会员卡级别</td>
                            <td width="25%">{{item.cardGrade}}</td>
                          </tr>
                          <tr>
                            <td width="25%">会员卡当前状态</td>
                            <td width="25%">{{item.cardStateNow}}</td>
                            <td width="25%">开卡日期</td>
                            <td width="25%">{{item.createTime}}</td>
                          </tr>
                          <tr>
                            <td>有效期限</td>
                            <td>{{item.indate}}</td>
                            <td>到期时间</td>
                            <td>{{item.stopTime}}</td>
                          </tr>
                          <tr>
                            <td>开卡地址</td>
                            <td colspan="3">{{item.openCardSite}}</td>
                          </tr>
                          <tr>
                            <td>备注</td>
                            <td colspan="3">{{item.memo}}</td>
                          </tr>
                        </table>
                        <!-- 在tab中的卡详情表 END -->
                        <!-- 在tab中的下面的四个按钮 START -->
                        <el-row style="text-align:center; margin-top:28px">
                          <el-col :span="6">
                            <div >
                            <el-button type="info" @click="returnWindow">返回</el-button>
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div >
                            <el-button type="info" @click="cardEdit">卡编辑</el-button>
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div >
                            <el-button type="primary" @click="cardRecharge">会员卡充值</el-button>
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div style="float:right;">
                            <el-button type="danger" @click="selectCurrent">选中会员</el-button>
                            </div>
                          </el-col>
                        </el-row>
                        <!-- 在tab中的下面的四个按钮 END -->
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content "></div>
          </el-col>
        </el-row>

      </el-dialog>
    </div>
    <member-card-recharge v-if="displayRecharge" :member-card-recharge-window-visible="memberCardRechargeWindowVisible" :thisCardData="thisCardData" :customer-data="customerData" @onOff="onOff($event)"></member-card-recharge>
  </div>
</template>


<script>
import { DialogMixin } from "@/components/mixin/DialogMixin";
import { apiResultMixin } from '@/components/apiResultMixin';
import { findOrders } from "@/api/getData";
import { getOrder } from "@/api/getData";
import MemberCardRecharge from "@/components/MemberCardRecharge.vue";

export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  components: {
    "member-card-recharge": MemberCardRecharge
  },
  data() {
    return {
      top: "0", /* 去除直接传 0 产生的 需要参数为string的警告 */
      memberCardRechargeWindowVisible:false,
      tabsNumber: "",//每次点击别的tab是tabsNumber动态变化
      currentValue: "", //每张卡的余额
      cards: [], //顾客会员卡数组
      thisCardData:{},//选中的当前会员卡的数据
      displayRecharge:false,  //会员卡充值界面是否显示标志位
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
    openWindow() {
      this.cards = [];
      for (let index of this.customerData.cards) {
        let obj = new Object();
        obj.title = "卡号: " + index.code;
        obj.name = index.code;
        obj.code = index.code;
        obj.currentValue = index.current_value;
        obj.cardGrade = index.card_grade;
        obj.cardType = index.card_type;
        obj.cardStateNow = index.card_state_now;
        obj.createTime = index.create_time;
        obj.indate = index.indate;
        obj.stopTime = index.stop_time;
        obj.openCardSite = index.open_card_site;
        obj.memo = index.memo;
        obj.currentValue = index.current_value;
        this.cards.push(obj);
      }
      this.tabsNumber = this.cards[0].name;   //openWindos后选中第一个tabs,之后每次点击别的tab是tabsNumber动态变化
      // this.currentValue = this.cards[0].currentValue;  //卡余额,openWindos后显示第一张卡余额,之后每次在点击tab事件中改变
    },
    //点击标签的事件处理函数-----
    tabHandleClick(tab, event) {
      console.log(this.tabsNumber);
    },
    //当前卡的充值按钮事件处理函数-----调到充值界面
    cardRecharge() {
      this.displayRecharge = true;
      this.memberCardRechargeWindowVisible = true;
      let which = this.cards.findIndex((values,index,arr) =>{ //找第几个对象中包含当前的tabsNumber,也就是当前是当前会员的哪一张会员卡
        return values.code == this.tabsNumber;
      });
      this.thisCardData = this.cards[which];
      // console.log("应该打开充值窗口了");
    },
    //当前卡的充值记录事件处理函数-----调到充值界面
    cardRechargeRecord() {
     
      
    },
    //当前卡的消费记录按钮事件处理函数-----调到充值界面
    cardExpenseCalendar() {

    },
    //当前顾客全部的充值记录按钮事件处理函数-----调到充值界面
    currentRechargeRecord() {

    },
    //当前顾客全部的消费记录按钮事件处理函数-----调到充值界面
    currentExpenseCalendar() {

    },
    //会员编辑按钮单击事件处理函数-----
    curentEdit() {

    },
    //返回按钮事件处理函数-----
    returnWindow(){
      this.dialogVisible = false;
    },
    //当前会员卡编辑按钮单击事件处理函数-----
    cardEdit(){

    },
    //选中会员按钮事件处理函数-----
    selectCurrent(){

    },
    //添加会员卡点击事件处理函数-----
    addCard() {

    },
    //会员卡充值组件传过来的发射事件
    onOff(flage){
      console.log("接收到了发射过来的消息了**********");
      this.displayRecharge = flage;
      this.memberCardRechargeWindowVisible = flage;
    }
  }
};
</script>

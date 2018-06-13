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
.fieldsethtight {
  height: 50px;
}
</style>

<template>
  <div class="add_member_container cel-window" style="height:100%">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="top" :modal="false" @open="openWindow()">
      <div slot="title" class="title-wrap">
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div>会&nbsp;&nbsp;&nbsp;员&nbsp;&nbsp;&nbsp;充&nbsp;&nbsp;&nbsp;值&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;&nbsp;录</div>
      </div>
      <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->

      <el-row>
        <el-col :span="1">
          <div class="grid-content ">
          </div>
        </el-col>
        <el-col :span="22">
          <div class="grid-content ">
            <!-- 会员基本信息 START-->
            <div id="basic" style="margin-top: 10px;">
              <el-row>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员姓名</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.userName}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员性别</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.sex}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员生日</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.displayBirth}}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div class="grid-content bg-purple">会员电话</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.mobile}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">地址</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.address}}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">备注</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">{{customerData.memo}}</div>
                </el-col>
              </el-row>
            </div>
            <!-- 会员基本信息 END-->

            <el-row>
              <el-col :span="12">
                <div class="grid-content">
                  <!-- 时间选择 START-->
                  <fieldset class="fieldsethtight">
                    <legend>时间选择</legend>
                    日期区间
                    <el-date-picker v-model="dateSection" type="daterange" align="right" size="mini" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </fieldset>
                  <!-- 时间选择 END-->
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <!-- 卡选择 START-->
                  <fieldset class="fieldsethtight">
                    <legend>卡选择</legend>
                    <el-row>
                      <!-- 支付方式 START-->
                      <el-col :span="12">
                        <div class="grid-content ">
                          <el-select v-model="payValue" placeholder="支付方式选择" @change="changeForPay" size="mini">
                            <el-option v-for="item in payOptions" :key="item.value" :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </el-col>
                      <!-- 支付方式 END-->
                      <!-- 卡号选择 START-->
                      <el-col :span="12">
                        <div class="grid-content">
                          <el-select v-model="cardCode" placeholder="会员卡号选择" @change="changeForCard" size="mini">
                            <el-option v-for="item in cardsOptions" :key="item.value" :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </el-col>
                      <!-- 卡号选择 END-->
                    </el-row>
                  </fieldset>
                  <!-- 卡选择 END-->
                </div>
              </el-col>
            </el-row>

            <!-- 充值记录表格 START   -->
            <el-table id="recharge-recored-table" :data="tableData" style="width: 100%:" height="292" border>
              <el-table-column prop="code" label="卡号" width="50">
              </el-table-column>
              <el-table-column prop="username" label="会员姓名" width="78">
              </el-table-column>
              <el-table-column prop="card_type" label="会员类型" width="78">
              </el-table-column>
              <el-table-column prop="card_grade" label="会员类型" width="104">
              </el-table-column>
              <el-table-column prop="payDate" label="缴费日期" width="95">
              </el-table-column>
              <el-table-column prop="payWay" label="付款方式" width="78">
              </el-table-column>
              <el-table-column prop="payMoney" label="充值金额" width="78">
              </el-table-column>
              <el-table-column prop="payState" label="充值店铺" width="78">
              </el-table-column>
              <el-table-column prop="stopDate" label="到期时间" width="95">
              </el-table-column>
              <el-table-column prop="operator" label="操作员" width="70">
              </el-table-column>
              <el-table-column prop="memo" label="备注">
              </el-table-column>
            </el-table>
            <!-- 充值记录表格 END-->

          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content "></div>
        </el-col>
      </el-row>
      <!-- 分页器 START-->
      <div class="" style="position: absolute;bottom: 15px;right:4%;margin-top: 10px;">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
      <!-- 分页器 END-->
    </el-dialog>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { DialogMixin } from "@/components/mixin/DialogMixin";
import { apiResultMixin } from '@/components/apiResultMixin';


export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  data() {
    return {
      top: "0" /* 去除直接传 0 产生的 需要参数为string的警告 */,
            tableData: [
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
        {
        code: "056",
        username: '刘德华',
        card_type: "储值卡",
        card_grade: "8000-5折",
        payDate:"18-05-18",
        payWay:"现金",
        payMoney:"2036",
        payState:"青云街店",
        stopDate:"22-09-05",
        operator:"张三",
        memo:"大家好"        
      }, 
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      payOptions: [{  //支付方式选项
        value: '现金',
      }, {
        value: '微信',
      }, {
        value: '支付宝',
      }, {
        value: '银行卡',
      }],
      payValue: '', //支付方式选择结果
      cardsOptions: [],//卡号选项
      cardCode: "",  //当前顾客卡号选择结果
      dateSection: "", //选择的日期时间
      orderDatasByUserId: {}, //根据会议ID提交SerVer,返回的订单数据
      orderDataByNumber: {},  //根据订单号number提交SerVer,返回对应的订单数据
      expenseTableData: [], //主表格数据
      expendRow: [],  //UI需要
      totalPage: 0,  //分页器显示的总页数
      perPage: 12, //主表每页显示12行
      currentPage: 1,//根据分页器的选择,提交SerVer数据,表示当前是第几页
      getOrderDataById: {},  //某行展开后提交SerVer后得到的数据,这样做是为了把已经从SerVer得到的数据保存起来,下次不用再次提交SerVer,减少SerVer交互
    };
  },
  methods: {
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    openWindow() {
      this.customerData.cards
      for (let value of this.customerData.cards) {
        let codes = new Object();
        codes.value = value.code;
        console.log("value.code = ",value.code);
        console.log("codes.value = ",codes.value);
        
        this.cardsOptions.push(codes);
      }
    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
      let requestDataByUserId = { //查询条件
        "page": this.currentPage, //分页器选择的当前页数
        "per_page": 12, //每页显示12行数据
        "q": {
          "user_id_eq": this.customerData.id  //根据顾客的id
        }
      };
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId);
        console.log("得到了会员得订单数据了!");
      });
    },
    //支付方式选择器事件函数-----
    changeForPay() {
      console.log(this.payValue);
    },
    //卡号选择器事件函数-----
    changeForCard() {
      console.log(this.cardCode);
    },
    expandChange(row, expandedRows) { }
  }
};
</script>

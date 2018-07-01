<style lang="scss" >
.member-expense-container {
    .customer-wrap {
        padding: 18px 0;
    }
    .grid-content {
        padding: 18px;
    }
    .scrollable-table {
        position: absolute;
        top: 200px;
        bottom: 100px;
        left: 18px;
        right: 18px;
        background-color: purple;
    }
}
</style>

<template>
<div class="member-expense-container cel-window">
  <!-- 会员添加窗口 -> START -->
  <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="'0'" :modal="false" @open="openWindow()">
    <div slot="title" class="title-wrap">
      <div class="left back">
        <i class="el-icon-back" @click="handleCloseDialog()"></i>
      </div>
      <div>会&nbsp;&nbsp;&nbsp;员&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;&nbsp;费&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;&nbsp;录</div>
    </div>
    <!-- <el-button type="danger" @click="test()">主要按钮</el-button> -->

    <div class="grid-content ">
      <!-- 会员基本信息 START-->
      <div class="customer-wrap">
        <customer-profile :customer-data="customerData"> </customer-profile>
      </div>
      <!-- 会员基本信息 END-->

      <!-- 时间选择 START-->
      <fieldset>
        <legend>时间选择</legend>
        日期区间选择
        <el-date-picker v-model="dateSection" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
        </el-date-picker>
      </fieldset>
      <!-- 时间选择 END-->

      <!-- 会员消费表格 START   -->
      <div class="scrollable-table">
        <el-table class="cel-scrollable-table" :data="expenseTableData" border style="width: 100%;margin-top: 10px;" :expand-row-keys="expendRow" :row-key="row => row.id">
          <!-- <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" @cell-mouse-enter="mouseEnter" :row-key="row => row.id"> -->
          <el-table-column type="expand">
            <template slot-scope="props">
                <el-table :data="props.row.lineItems" :span-method="objectSpanMethod" border >
                  <el-table-column prop="groupNumber" label="物品编号" width="180">
                  </el-table-column>
                  <el-table-column prop="cname" label="服务项目">
                  </el-table-column>
                  <el-table-column prop="saleUnitPrice" label="单价">
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量">
                  </el-table-column>
                  <el-table-column prop="discountPercent" label="折扣">
                  </el-table-column>
                  <el-table-column prop="price" label="金额">
                  </el-table-column>
                  <el-table-column prop="memo" label="备注">
                  </el-table-column>
                </el-table>
              </template>
          </el-table-column>
          <el-table-column label="订单编号" prop="number">
          </el-table-column>
          <el-table-column label="消费日期" prop="displayCreatedAt">
          </el-table-column>
          <el-table-column label="店铺名称" prop="storeName">
          </el-table-column>
          <el-table-column label="应收金额" prop="saleTotal">
          </el-table-column>
          <el-table-column label="实收金额" prop="total">
          </el-table-column>
          <el-table-column label="操作员" prop="creatorName">
          </el-table-column>
        </el-table>
      </div>
      <!-- 会员消费表格 END-->

    </div>

    <!-- 分页器 START-->
    <div class="" style="position: absolute;bottom: -16px;right:4%;margin-top: 10px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页器 END-->
  </el-dialog>

</div>
</template>


<script>
import {
  DialogMixin
} from "@/components/mixin/DialogMixin"

import {
  apiResultMixin
} from '@/components/apiResultMixin'
import {
  findOrders,
  getOrder
} from "@/api/getData"

import customerProfile from "@/components/common/customerProfile.vue"

export default {
  props: ["dialogVisible", "customerData"],
  mixins: [DialogMixin, apiResultMixin],
  components: {
    "customer-profile": customerProfile
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [{
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
      dateSection: "", //选择的日期时间
      orderDatasByUserId: {}, //根据会议ID提交SerVer,返回的订单数据
      orderDataByNumber: {}, //根据订单号number提交SerVer,返回对应的订单数据
      expenseTableData: [], //主表格数据
      expendRow: [], //UI需要
      totalCount: 0, //数据总行数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      getOrderDataById: {}, //某行展开后提交SerVer后得到的数据,这样做是为了把已经从SerVer得到的数据保存起来,下次不用再次提交SerVer,减少SerVer交互
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
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    openWindow() {
      let queryParams = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: 12, //每页显示12行数据
        q: {
          user_id_eq: this.customerData.id //根据顾客的id
        }
      };
      findOrders(queryParams).then((result) => {
        const orders = this.buildOrders(result)
        this.totalCount = result.total_count; //得到当前共计多少页
        this.expenseTableData = orders
        console.log("得到了会员得订单数据了!");
      });
    },
    //表格展开后的事件处理函数
    expandChange(row, expandedRows) {
      // if (this.findIsOpenFlag(row.number) === false) {  //意思是没有找到,前一个状态时没有展开,刚刚被展开,故需要和SevVer交互
      //   this.isOpenFlag[row.number] = true; //展开了,打开了
      //   this.getOrderFromSverVer(row.number); //根据number号得到SerVer数据
      //   this.isGetOrederFlag[row.number] = true; //只要是展开过,就保存
      // } else {  //关闭了展开
      //   delete this.isOpenFlag[row.number];
      // }
    },
    //去标志对象中去找,找到返回true,没有找到返回false
    findIsOpenFlag(id) {
      if (this.isOpenFlag.hasOwnProperty(id)) {
        return true;
      } else {
        return false;
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
          "user_id_eq": this.customerData.id //根据顾客的id
        }
      };
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId);
        console.log("得到了会员得订单数据了!");
      });
    },
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0) {
        let group = row.group
        let i = group.lineItems.findIndex((item) => {
          return row.id == item.id
        })
        // console.log("group",group,i)
        if (i === 0) {
          return {
            rowspan: group.lineItems.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>

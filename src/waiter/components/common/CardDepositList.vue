<style lang="scss" >
.card-deposit-container {
  height: 100%;
    .scrollable-table {
        position: absolute;
        top: 0px;
        bottom: 50px;
        left: 0;
        right: 0;
    }
}
</style>

<template>
<div class="card-deposit-container">
      <!-- 会员消费表格 START   -->
      <div class="scrollable-table">
        <el-table class="cel-scrollable-table" :data="expenseTableData" border  :row-key="row => row.id">
          <!-- <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" @cell-mouse-enter="mouseEnter" :row-key="row => row.id"> -->
          <el-table-column label="订单编号" prop="number">
          </el-table-column>
          <el-table-column label="充值日期" prop="displayCreatedAt">
          </el-table-column>
          <el-table-column label="店铺名称" prop="storeName">
          </el-table-column>

          <el-table-column label="充值金额" prop="total">
          </el-table-column>
          <el-table-column label="操作员" prop="creatorName">
          </el-table-column>
        </el-table>
      </div>
      <!-- 会员消费表格 END-->


    <!-- 分页器 START-->
    <div class="" style="position: absolute;bottom: 15px;right:4%;margin-top: 10px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页器 END-->

</div>
</template>


<script>


import {
  findOrders
} from "@/api/getData"


export default {
  props: [ "customerData", "cardData"],
  data() {
    return {
      dateSection: "", //选择的日期时间
      expenseTableData: [], //主表格数据
      totalCount: 0, //数据总行数
      perPage: 12, //主表每页显示12行
      currentPage: 1 //根据分页器的选择,提交SerVer数据,表示当前是第几页
    };
  },
  created: function(){
    this.initData()
  },
  methods: {
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    initData() {
      let params =this.buildParams()
      findOrders(params).then((result) => {
        const orders = this.buildOrders(result)
        this.totalCount = result.total_count; //得到当前共计多少页
        this.expenseTableData = orders
        console.log("得到了会员得订单数据了!");
      });
    },
    buildParams(){
      let queryParams = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: 12, //每页显示12行数据
        q: {
          card_type_type: 1, //充值订单
          user_id_eq: this.customerData.id, //根据顾客的id
          line_items_card_id_eq: this.cardData.id
        }
      }
      return queryParams
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
      }
      this.getOrdersByUserId(requestDataByUserId).then(() => {
        this.expenseTableData = this.buildOrders(this.orderDatasByUserId);
        console.log("得到了会员得订单数据了!");
      })
    }
  }
};
</script>

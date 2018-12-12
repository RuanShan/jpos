<style lang="scss" >
.card-order-container {
    height: 100%;
    .scrollable-table {
        position: absolute;
        top: 0;
        bottom: 40px;
        left: 0;
        right: 0;
    }
    .pagination-wrap{
      position: absolute;bottom: 0;right:5px;
    }
}
</style>

<template>
<div class="card-order-container">
  <!-- 会员消费表格 START   -->
  <div class="scrollable-table">
    <el-table class="cel-scrollable-table" :data="expenseTableData" border :row-key="row => row.id">
      <!-- <el-table id="expensecalendartable" :data="expenseTableData" border style="width: 100%;margin-top: 10px" @cell-mouse-enter="mouseEnter" :row-key="row => row.id"> -->

      <el-table-column label="订单编号" prop="number">
      </el-table-column>
      <el-table-column label="消费日期" prop="displayCreatedAt">
      </el-table-column>
      <el-table-column label="店铺名称" prop="storeName">
      </el-table-column>
      <el-table-column label="订单状态" prop="displayState">
      </el-table-column>
      <el-table-column label="实收金额" prop="total">
      </el-table-column>
      <el-table-column label="操作员" prop="creatorName">
      </el-table-column>
      <el-table-column label="操作">
       <template slot-scope="scope">
         <el-button
           size="mini"  type="success"
           @click="handleShowDetail( scope.row)">详情</el-button>
         <el-button
             size="mini" type="danger" @click="handleCancel( scope.row)" :disabled="scope.row.state!='cart'">取消</el-button>

       </template>
     </el-table-column>
    </el-table>
  </div>
  <!-- 会员消费表格 END-->

  <!-- 分页器 START-->
  <div class="pagination-wrap" style="">
    <el-pagination @current-change="handlePageChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next" :total="totalCount">
    </el-pagination>
  </div>
  <!-- 分页器 END-->

  <el-dialog  title="订单详情"  :visible.sync="dialogVisible" append-to-body class="cel-body-dialog">
    <OrderDetail :order-detail="orderDetail"> </OrderDetail>
  </el-dialog>
</div>
</template>


<script>
import {
  findOrders,
  cancelOrder
} from "@/api/getData"
import  OrderDetail from '@/components/common/OrderDetail.vue'
import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin';


export default {
  //如果cardData 为空，表示非会员卡消费列表
  props: ["customerData", "cardData"],
  components:{
    OrderDetail, CelUIMixin
  },
  mixins: [ CelUIMixin],
  data() {
    return {
      dateSection: "", //选择的日期时间
      expenseTableData: [], //主表格数据
      totalCount: 0, //数据总行数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      dialogVisible: false,
      orderDetail: null
    };
  },
  created: function() {
    this.initData()
  },
  methods: {
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    initData() {
      let queryParams =  this.buildParams()
      findOrders(queryParams).then((result) => {
        const orders = this.buildOrders(result)
        this.totalCount = result.total_count; //得到当前共计多少页
        this.expenseTableData = orders
        console.log("得到了会员得订单数据了!");
      });
    },
    buildParams(){
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: {
          order_type_eq: 0,
          user_id_eq: this.customerData.id //根据顾客的id
        }
      }
      //会员卡订单
      if( this.cardData ){
        //params.q.payment_method_id =1
        params.q.payments_source_id_eq = this.cardData.id
      }else{
      //非会员卡订单
        params.q.payments_source_id_null = true
      }
      return params
    },
    //分页器的改变选择时事件处理函数
    handlePageChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      console.log(this.currentPage)
      this.initData()
    },
    handleShowDetail( row ){
      this.dialogVisible = true
      console.log("显示当前订单的详细信息...", row);
      this.orderDetail = row
    },
    handleCancel( row ){
        let id = row.id
console.log( "handleCancel row =", row)
        this.cancelOrderConfirm( ( )=>{
          cancelOrder( id ).then((res)=>{
            if( res.id ){
              this.$emit('order-state-changed')

              if( this.itemList.length == 1 && this.currentPage > 1 ){
                this.handlePageChange( this.currentPage -1 )
              }else{
                this.initData()
              }
              this.$message({
                type: 'success',
                message: "恭喜你，订单取消成功"
              })
            }
          })
        })
    }
  }
};
</script>

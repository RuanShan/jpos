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
    <el-table class="cel-scrollable-table" :data="orderList" border :row-key="row => row.id">
      <!-- <el-table id="expensecalendartable" :data="orderList" border style="width: 100%;margin-top: 10px" @cell-mouse-enter="mouseEnter" :row-key="row => row.id"> -->

      <el-table-column label="订单编号" prop="number" width="120">
      </el-table-column>
      <el-table-column label="消费日期" prop="displayCreatedAt" width="120">
      </el-table-column>
      <el-table-column label="店铺名称" prop="storeName" width="150">
      </el-table-column>
      <el-table-column label="订单状态" prop="displayState" width="120">
          <template slot-scope="scope">
            <p type="danger" v-if="scope.row.state=='canceled'">{{scope.row.displayState}}({{scope.row.memo}}) </p>
            <p v-else>{{scope.row.displayState}} </p>
          </template>
      </el-table-column>
      <el-table-column label="物品-服务项目[备注]" >
        <template slot-scope="scope">
          <dl v-for="group in scope.row.lineItemGroups" class="clear">
            <dt class="left">
              {{scope.row.id}}{{group.number}} -
            </dt>
            <dd class="left">
              <div v-for="item in group.lineItems">{{item.cname}} <span class="memo" v-show="item.memo"> [ {{item.memo}} ] </span></div>
            </dd>
          </dl>
        </template>
      </el-table-column>
      <el-table-column label="实收" prop="paymentTotal" width="100">
        <template slot-scope="scope">
          {{ getPaymentAmountByPayment(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="操作员" prop="creatorName" width="80">
      </el-table-column>

      <el-table-column label="操作" width="160">
       <template slot-scope="scope">
         <el-button
           size="mini"  type="success"
           @click="handleShowDetail( scope.row)">详情</el-button>
         <el-button
             size="mini" type="danger" @click="handleCancel( scope.row)" :disabled="!isCancelable(scope.row)">取消</el-button>

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

  <el-dialog  title="订单详情"  :visible.sync="dialogVisible"  :modal="false" class="cel-scrollable-dialog">
    <OrderDetail :customer-data="customerData" :order-data.sync="currentOrder" :order-position="currentOrderPosition"> </OrderDetail>
  </el-dialog>
</div>
</template>


<script>
import {
  getCard,
  findOrders,
  cancelOrder
} from "@/api/getData"
import  OrderDetail from '@/components/common/OrderDetail.vue'
import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin'

/// 订单列表
///
export default {
  //如果cardData 为空，表示非会员卡消费列表
  props: ["customerData", "cardData"],
  components:{
    OrderDetail
  },
  mixins: [ CelUIMixin],
  data() {
    return {
      dateSection: "", //选择的日期时间
      orderList: [], //主表格数据
      totalCount: 0, //数据总行数
      perPage: 12, //主表每页显示12行
      currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
      dialogVisible: false,
      currentOrder: null,
    };
  },
  created: function() {
    this.initData()

    this.$bus.$on('order-changed-gevent', () => {
      console.log('on order-changed-gevent')
      this.dialogVisible = false  // 用户点击办卡支付，订单改变事件， 关闭订单详情
      this.initData()
    })
  },
  computed:{
    currentOrderPosition(){  // 当前order在用户order列表中的顺序，
      if( this.currentOrder == null ){
         return -1
      }
      let i = this.orderList.findIndex( (o)=> o.number == this.currentOrder.number )
      return  i+1 + (this.currentPage-1)*this.perPage
    }
  },
  methods: {
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    initData() {
      let queryParams =  this.buildParams()
      findOrders(queryParams).then((result) => {
        const orders = this.buildOrders(result)
        console.log( "findOrders ", queryParams, orders)
        this.totalCount = result.total_count; //得到当前共计多少页
        this.orderList = orders

        if( this.currentOrder ){
          this.currentOrder = this.orderList.find( ( order)=>{ return order.id == this.currentOrder.id } )
        }
      });
    },
    buildParams(){
      let params = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: this.perPage, //每页显示12行数据
        q: {
          order_type_eq: 0,
          user_id_eq: this.customerData.id, //根据顾客的id
          //payments_state_eq: this.PaymentStateEnum.completed,// when we want to filter out void?
          s:[ 'created_at desc']
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
      this.currentOrder = row
      console.log("显示当前订单的详细信息...", this.currentOrder)
    },
    handleCancel( row ){
        let id = row.id
        this.cancelOrderConfirm( ( {memo} )=>{
          console.log( " handleCancel=", memo)
          cancelOrder( id, { order:{ memo}} ).then((res)=>{
            if( res.id ){
              const order = this.buildOrder( res )
              if( this.cardData != null){
                getCard( this.cardData.id).then((res) =>{
                  let card = this.buildCard( res )
                  card.customer =  this.customerData
                  this.$emit('order-changed-event', {changedCard: card, changedOrder: order})
                })
              }else{
                this.$emit('order-changed-event', { changedOrder: order})
              }
              let index = this.orderList.findIndex((o)=>{ return o.id == order.id})
              this.$set( this.orderList, index, order )

              this.$message({
                type: 'success',
                message: "恭喜你，订单取消成功"
              })
            }
          })
        })
    },
    isCancelable(order){
      // 在店内的商品才可以取消
      return (order.state == 'cart') && (order.groupState == 'ready' || order.groupState == 'pending' )
    },
    getPaymentAmountByPayment( order ){
      let mounts = 0
      // 根据支付方式取得订单付款金额
      if( this.cardData != null ){
        mounts = order.payments.reduce( (prev,cur,index,arr) => {
          if( cur.sourceId == this.cardData.id ){
            prev += cur.amount
          }
          return prev
        }, 0)
      }else{
        mounts = order.payments.reduce( (prev,cur,index,arr) => {
          if( cur.sourceId == null ){
            prev += cur.amount
          }
          return prev
        }, 0)

      }
      return mounts
    }
  },
  watch:{
    customerData:{
      handler:function(val,oldval){
          this.initData()
      }
    }
  }
};
</script>

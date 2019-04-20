<style lang="scss" >
.card-deposit-container {
  height: 100%;
    .scrollable-table {
        position: absolute;
        top: 0px;
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
<div class="card-deposit-container">
      <!-- 会员消费表格 START   -->
      <div class="scrollable-table">
        <el-table class="cel-scrollable-table" :data="depositOrders" border  :row-key="row => row.id">
          <!-- <el-table id="expensecalendartable" :data="depositOrders" border style="width: 100%;margin-top: 10px" @cell-mouse-enter="mouseEnter" :row-key="row => row.id"> -->
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
          <el-table-column label="充值状态" prop="displayState" width="120">
              <template slot-scope="scope">
                <p type="danger" v-if="scope.row.state=='canceled'">{{scope.row.displayState}}({{scope.row.memo}}) </p>
                <p v-else>{{scope.row.displayState}} </p>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
           <template slot-scope="scope">
             <el-button
                 size="mini" type="danger" @click="handleCancel( scope.row)" :disabled="!isDepositCancelable(scope.row)">取消</el-button>

           </template>
         </el-table-column>
        </el-table>
      </div>
      <!-- 会员消费表格 END-->


    <!-- 分页器 START-->
    <div class="pagination-wrap"  >
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="12" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页器 END-->

</div>
</template>


<script>


import {
  findOrders, cancelOrder
} from "@/api/getData"

import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin'

export default {
  props: [ "customerData", "cardData"],
  mixins: [ CelUIMixin],
  data() {
    return {
      dateSection: "", //选择的日期时间
      depositOrders: [], //主表格数据
      totalCount: 0, //数据总行数
      perPage: 12, //主表每页显示12行
      currentPage: 1 //根据分页器的选择,提交SerVer数据,表示当前是第几页
    };
  },
  created: function(){
    this.initData()
    //当有新的充值数据时，重新加载数据
    this.$bus.$on('deposit-order-created-gevent', () => {
      this.initData()
    })

  },
  methods: {
    //打开窗口时事件处理函数-----根据分页器,显示第一页数据
    initData() {
      let params =this.buildParams()
      findOrders(params).then((result) => {
        const orders = this.buildOrders(result)
        this.totalCount = result.total_count; //得到当前共计多少页
        this.depositOrders = orders
        console.log("得到了会员得订单数据了!");
      });
    },
    buildParams(){
      let queryParams = { //查询条件
        page: this.currentPage, //分页器选择的当前页数
        per_page: 12, //每页显示12行数据
        q: {
          order_type_in: [1,2], //充值订单
          user_id_eq: this.customerData.id, //根据顾客的id
          line_items_card_id_eq: this.cardData.id,
          s:[ 'created_at desc']
        }
      }
      return queryParams
    },
    //分页器的改变选择时事件处理函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      console.log(this.currentPage);
      this.initData()
    },
    handleCancel( row ){
        let id = row.id
        this.cancelOrderConfirm( ( {memo} )=>{
          console.log( " handleCancel=", memo)
          cancelOrder( id, { order:{ memo}} ).then((res)=>{
            if( res.id ){
              const order = this.buildOrder( res )
              let index = this.depositOrders.findIndex((o)=>{ return o.id == order.id})
              this.$set( this.depositOrders, index, order )

              let card = order.customer.cards.find((item)=>{ return item.id == this.cardData.id })
              this.$emit( 'card-changed-event', card )

              this.$message({
                type: 'success',
                message: "恭喜你，订单取消成功"
              })
            }
          })
        })
    },
    isDepositCancelable( depositOrder ){

      return   depositOrder.state== this.OrderStateEnum.cart && this.cardData.amountRemaining >= depositOrder.total
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

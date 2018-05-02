<style lang="scss" >

@import '../style/mixin';
.order-flow-container{
  .el-dialog__body{
    /*fullscreen process dialog*/
    height: 90%;
  }
  .location{
    float: left;
    padding: 6px;
    border: 2px dashed #c5c5c5;
    width: 40%;
    &.ship{
      width: 20%;
      border-color: transparent;
      background-color: gray;
      text-align: center;
    }
  }
  .step{
    position:relative;
    float:left;
    padding: 20px;
    width: 50%;
    height: 140px;
    .title{
      @include center
      background-color: #32CD32;
    }
    .linex{
      @include center
      height: 2px;
      width: 100%;
      border-color: inherit;
      background-color: #c0c4cc;

      &.offset-l50{
        width:50%;
        transform: translate(0, -50%);
      }
      &.offset-r50{
        width:50%;
        transform: translate(-100%,-50%);
      }
    }
    .liney{
      @include center
      height: 100%;
      width: 2px;
      border-color: inherit;
      background-color: #c0c4cc;
      &.offset-t50{
        height:50%;
        transform: translate(-50%, 0);
      }
      &.offset-b50{
        height:50%;
        transform: translate(-50%,-100%);
      }
    }
    .badge{
      position: relative;
      vertical-align: middle;
      display: inline-block;
      sup{
        background-color: #f56c6c;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
        border: 1px solid #fff;
      }
    }

  }
}
.table_container {
    padding: 20px 0;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}



</style>

<template>
<!--
# 记录商品的处理流程
# pending : 店里收到商品
# ready_for_factory: 准备发货到工厂
# processing: 工厂处理
# ready_for_store: 准备发货到店里
# ready: 可以交给客户了
# shipped: 已交付客户
-->
<div class="order-flow-container fillcontain">
  <scan-product :order-state="currentOrderState" :dialog-visible.sync="scanShipmentDialogVisible" @order-state-changed="orderStateChanged"> </scan-product>
  <process-order :order-state="currentOrderState" :dialog-visible.sync="processOrderDialogVisible" @order-state-changed="orderStateChanged" > </process-order>
  <process-item :order-state="currentOrderState" :dialog-visible.sync="processItemDialogVisible" @order-state-changed="orderStateChanged" > </process-item>

  <div class="table_container ">
    <div class="steps clear">

      <div class="location clear">
        <div class="step">
          <div class="linex offset-l50" style=""> </div>
          <div class="title"> new orders  <div  class="badge"> <sup> {{orderCount.pending}} </sup> </div>
            <div>
              <el-button @click="processItems('pending')">Item</el-button>
              <el-button @click="processOrders('pending')">处理</el-button>
              <el-button @click="handleScanOrders('pending')">Scan</el-button>
            </div>
          </div>


        </div>
        <div class="step">
          <div class="linex "> </div>
          <div class="title"> ready for factory  <div  class="badge"> <sup> {{orderCount.ready_for_factory}} </sup> </div>
            <div>
              <el-button @click="processItems('ready_for_factory')">Item</el-button>
              <el-button @click="processOrders('ready_for_factory')">处理</el-button>
              <el-button @click="handleScanOrders('ready_for_factory')">Scan</el-button>
            </div>
          </div>
        </div>
        <div class="step" style="float:right;">
          <div class="linex offset-l50" style=""> </div>
          <div class="title"> ready  <div  class="badge"> <sup> {{orderCount.ready}} </sup> </div>
            <div>
              <el-button @click="processItems('ready')">Item</el-button>
              <el-button @click="processOrders('ready')">处理</el-button>
              <el-button @click="handleScanOrders('ready')">Scan</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="location ship">
        <div class="step" style="width:100%;">  <div class="title"> car </div> </div>
        <div class="step" style="width:100%;">  <div class="title"> car </div>  </div>
       </div>

      <div class="location clear">
        <div class="step" style="width:100%;">
          <div class="linex offset-r50"> </div>
          <div class="liney offset-t50" > </div>
          <div class="title"> processing  <div  class="badge"> <sup> {{orderCount.processing}} </sup> </div>
            <div>
              <el-button @click="processItems('processing')">Item</el-button>
              <el-button @click="processOrders('processing')">处理</el-button>
              <el-button @click="handleScanOrders('processing')">Scan</el-button>
            </div>
          </div>
        </div>
        <div class="step" style="width:100%;">
          <div class="linex offset-r50"> </div>
          <div class="title"> ready_for_store  <div  class="badge"> <sup> {{orderCount.ready_for_store}} </sup> </div>
            <div>
              <el-button @click="processItems('ready_for_store')">Item</el-button>
              <el-button @click="processOrders('ready_for_store')">处理</el-button>
            </div>
          </div>
        </div>

      </div>


    </div>
  </div>
</div>

</template>

<script>

import headTop from '@/components/headTop'
import processOrder from '@/components/processOrder'
import processItem from '@/components/processItem'
import scanProduct from '@/components/scanProduct'
import {
    getOrderList, getPosOrderCounts
}
from '@/api/getData'
import {
    userDataMixin
}
from '@/components/userDataMixin'

export default {
    data() {
            return {
              processOrderDialogVisible: false,
              processItemDialogVisible: false,
                scanShipmentDialogVisible: false,
                tableData: [],
                currentRow: null,
                currentOrderState: null,
                perPage: 2,
                count: 0,
                currentPage: 1,
                storeId: null,
                orderCount:{
                    pending: 0,
                    ready_for_factory: 0,
                    processing: 0,
                    ready_for_store: 0,
                    ready: 0,
                    shipped: 0
                },
                filters: {
                    keyword: '',
                    startEndTime: null,
                    shipment_state: 'all',
                    storeId: 0
                },
                multipleSelection: [],
                orderStateOptions: [{
                    value: 'all',
                    label: 'all'
                }, {
                    value: 'pending',
                    label: 'pending'
                }, {
                    value: 'partial',
                    label: 'partial'
                }, {
                    value: 'ready_for_factory',
                    label: 'ready_for_factory'
                }, {
                    value: 'ready',
                    label: 'ready'
                }]

            }
        },
        components: {
            headTop,
            processOrder,
            processItem,
            scanProduct
        },
        mixins: [userDataMixin],
        created() {
            this.getAdminData().then(res => {
                if (this.userInfo.id) {
                    this.initData()
                } else {
                    this.$router.push('/login')
                }
            })
        },

        methods: {
            async initData() {
                const orderCounstResult  = await getPosOrderCounts( )
                Object.assign( this.orderCount, orderCounstResult )
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.offset = (val - 1) * this.limit
                this.getOrders()
            },
            processItems( orderState ) {
                this.processItemDialogVisible=true
                this.currentOrderState = orderState
                console.log('processItems')
            },
            processOrders( orderState ) {
                this.processOrderDialogVisible=true
                this.currentOrderState = orderState
                console.log('processOrders')
            },
            handleScanOrders( orderState ) {
                this.scanShipmentDialogVisible=true
                this.currentOrderState = orderState
                console.log('handleScanOrders')
            },
            orderStateChanged( ){
                this.initData()
            },

            async getOrders() {
                let queryParams = {
                    page: this.currentPage,
                    per_page: this.perPage,
                }
                if (this.filters.storeId > 0) {
                    queryParams["q[store_id_eq]"] = this.filters.storeId

                }

                if (this.filters.keyword.length > 0) {
                    // order.number ||  || order.users.username
                    queryParams["q[user_username_cont]"] = this.filters.keyword
                }
                if (this.filters.shipment_state.length > 0 && this.filters.shipment_state != 'all') {
                    // order.number ||  || order.users.username
                    queryParams["q[group_state_eq]"] = this.filters.shipment_state
                }

                const ordersResult = await getOrderList(queryParams)
                this.count = ordersResult.total_count
                console.log("total_count", this.count)
                this.tableData = []
                ordersResult.orders.forEach((item, index) => {
                    const rowData = {}
                    rowData.id = item.id
                    rowData.number = item.number
                    rowData.total_amount = item.display_total
                    rowData.status = item.state
                    rowData.user_id = item.user_id
                    rowData.store_id = item.store_id
                    rowData.index = index
                    rowData.shipment_state = item.shipment_state
                    rowData.payment_state = item.payment_state
                    this.tableData.push(rowData)
                })
            },
        }
}

</script>

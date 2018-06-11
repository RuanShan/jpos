<style lang="scss" >
@import '../style/mixin';
.item-flow-container {
    position: absolute;
    top: 80px;
    left: 80px;
    right: 30px;
    bottom: 30px;
    border-top: 1px solid #d3dce6;

    .steps {
        height: 100%;
        .location {
            position: relative;
            float: left;
            border: 2px dashed #c5c5c5;
            width: 45%;
            height: 100%;
            &.ship {
                width: 10%;
                border-color: transparent;
                background-color: gray;
                text-align: center;
            }
            .head {
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                text-align: center;
            }
            .actions {
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
            }
            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background-color: #fff;
                opacity: 0.5;
            }
        }
        .step {
            position: relative;
            float: left;
            height: 100%;
            &.step0 {
                min-height: 300px;
            }
            &.step1 {
                width: 50%;
                min-height: 400px;
                background-color: #32CD32;
            }
            &.step2 {
                width: 50%;
                float: right;
                min-height: 400px;
                background-color: #32CD32;
            }
            &.transfer1 {
                width: 50%;
                height: 50%;
                position: absolute;
                right: 0;
            }
            &.transfer2 {
                width: 50%;
                height: 50%;
                position: absolute;
                left: 0;
            }
            .ready {
                position: absolute;
                top: 50%;
            }
            .pending {}
            .title {
                @include center padding: 8px;
                background-color: #32CD32;
            }
            .linex {
                @include center height: 2px;
                width: 100%;
                border-color: inherit;
                background-color: #c0c4cc;
                &.offset-l50 {
                    width: 50%;
                    transform: translate(0, -50%);
                }
                &.offset-r50 {
                    width: 50%;
                    transform: translate(-100%, -50%);
                }
            }
            .liney {
                @include center height: 100%;
                width: 2px;
                border-color: inherit;
                background-color: #c0c4cc;
                &.offset-t50 {
                    height: 50%;
                    transform: translate(-50%, 0);
                }
                &.offset-b50 {
                    height: 50%;
                    transform: translate(-50%, -100%);
                }
            }
            .badge {
                position: relative;
                vertical-align: middle;
                display: inline-block;
                sup {
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
            .part-top {
                height: 50%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            }
            .part-bottom {
                height: 50%;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
        }
    }
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
<div class="item-flow-container ">
  <product-scan :order-state="currentOrderState" :dialog-visible.sync="scanProductDialogVisible" @order-state-changed="orderStateChanged"> </product-scan>
  <item-process :order-state="currentOrderState" :dialog-visible.sync="processItemDialogVisible" @order-state-changed="orderStateChanged"> </item-process>
  <product-transfer :order-state="currentOrderState" :next-order-state="nextOrderState" :dialog-visible.sync="transferProductDialogVisible" @order-state-changed="orderStateChanged"> </product-transfer>
  <WorkerPerformance :order-state="currentOrderState" :dialog-visible.sync="workerPermormanceDialogVisible" @order-state-changed="orderStateChanged"> </WorkerPerformance>


  <div class="fillcontain ">
    <div class="steps clear">

      <div class="location clear">

        <div class="step step1">
          <div class="head"> 门店 </div>
          <div class="pending part-top">
            <div class="title">
              <el-button @click="processItems('pending')">
                客户物品
                <div class="badge"> <sup> {{itemCounts.pending}} </sup> </div>
              </el-button>

            </div>
          </div>

          <div class="ready part-bottom">
            <div class="title">
              <el-button @click="processItems('ready')"> 等待交付
                <div class="badge"> <sup> {{itemCounts.ready}} </sup> </div>
              </el-button>
            </div>
          </div>

        </div>

        <div class="step transfer1">
          <div class="linex "> </div>
          <div class="title">
            <el-button @click="handleTransferProducts('pending', 'ready_for_factory')">门店发货
              <div class="badge"> <sup> {{itemCounts.ready_for_factory}} </sup> </div>
            </el-button>
          </div>
        </div>


        <div class="step transfer1" style="top:50%;">
          <div class="linex " style=""> </div>
          <div class="title">
            <el-button @click="handleTransferProducts('ready_for_store', 'ready')">
              门店待验收
              <div class="badge"> <sup> {{itemCounts.ready_for_store}} </sup> </div>
            </el-button>
          </div>
        </div>
      </div>

      <div class="location ship">
        <div class="step step0" style="width:100%;">
          <div class="title"> 运输 </div>
        </div>
        <div class="step step0" style="width:100%;">
          <div class="title"> 运输 </div>
        </div>
      </div>

      <div class="location clear">
        <div class="overlayx"></div>
        <div class="step step2">
          <div class="head"> 工厂 </div>
          <div class="title">
            <el-button @click="processItems('processing')">
              <div class="badge"> <sup> {{itemCounts.processing}} </sup> </div> 专业服务
              <div class="badge"> <sup> {{itemCounts.processed}} </sup> </div>
            </el-button>
          </div>
          <div class="actions">
            <el-button @click="handleWorkerPerformance('processing')">工作量录入</el-button>
          </div>
        </div>
        <div class="step transfer2">
          <div class="linex"> </div>
          <div class="title">
            <el-button @click="handleTransferProducts('ready_for_factory', 'processing')"> 工厂待收货
              <div class="badge"> <sup> {{itemCounts.ready_for_factory}} </sup> </div>
            </el-button>
          </div>
        </div>

        <div class="step transfer2" style="top:50%;">
          <div class="linex"> </div>
          <div class="title">
            <el-button @click="handleTransferProducts('processed', 'ready_for_store')" size="small"> 工厂发货
              <div class="badge"> <sup> {{itemCounts.ready_for_store}} </sup> </div>
            </el-button>
          </div>
        </div>
      </div>


    </div>
  </div>
</div>
</template>

<script>
import headTop from '@/components/headTop'
import ItemProcess from '@/components/ItemProcess'
import ProductScan from '@/components/ProductScan'
import ProductTransfer from '@/components/ProductTransfer'
import WorkerPerformance from '@/components/WorkerPerformance'
import {
  getLineItemGroupCounts
}
from '@/api/getData'
import {
  userDataMixin
}
from '@/components/userDataMixin'

export default {
  data() {
    return {
      processItemDialogVisible: false,
      scanProductDialogVisible: false,
      transferProductDialogVisible: false,
      workerPermormanceDialogVisible: false,
      tableData: [],
      currentRow: null,
      currentOrderState: null,
      nextOrderState: null,
      perPage: 12,
      count: 0,
      currentPage: 1,
      itemCounts: {
        pending: 0,
        ready_for_factory: 0,
        processing: 0,
        processed: 0,
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
    ItemProcess,
    ProductScan,
    ProductTransfer,
    WorkerPerformance
  },
  mixins: [userDataMixin],
  created() {
    this.$bus.$on('OrderCreatedEvent', () => {
      console.log('on OrderCreatedEvent')
      this.initData()
    })

    this.initData()
  },

  methods: {
    async initData() {
      let queryParams = {
        q: {
          store_id_eq: this.storeId
        }
      }
      const orderCounstResult = await getLineItemGroupCounts(queryParams)
      Object.assign(this.itemCounts, orderCounstResult)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },

    processItems(orderState) {
      this.processItemDialogVisible = true
      this.currentOrderState = orderState
      console.log('processItems')
    },
    handleScanOrders(orderState) {
      this.scanProductDialogVisible = true
      this.currentOrderState = orderState
      console.log('handleScanOrders')
    },
    handleTransferProducts(orderState, nextOrderState) {
      this.currentOrderState = orderState
      this.nextOrderState = nextOrderState
      this.transferProductDialogVisible = true
      console.log('handleScanOrders')
    },
    handleWorkerPerformance(orderState) {
      this.workerPermormanceDialogVisible = true
      this.currentOrderState = orderState
      console.log('handleScanOrders')
    },
    orderStateChanged() {
      this.initData()
    }
  }
}
</script>

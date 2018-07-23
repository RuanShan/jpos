<style lang="scss" >
@import '../style/mixin';
.item-flow-container {
  .item-flow>.title-wrap {
    text-align: center;
    line-height: 48px;
    background-color: #f9fafc;
    margin: 0 18px;
    border-bottom: 1px solid #d3dce6;
  }
  .item-flow>.filters{

    padding: 6px 18px;
    &.el-form-item{
      margin-bottom: 0;
    }
  }
  .item-flow-control {
        position: absolute;
        top: 50px;
        left: 18px;
        right: 18px;
        bottom: 50px;
        background-color: #ffffff;

        .location {
            position: relative;
            float: left;

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
                z-index: 1;
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
<div>
  <headTop></headTop>
  <leftNav></leftNav>
  <div class="item-flow-container page-content">

    <product-scan :order-state="currentOrderState" :dialog-visible.sync="scanProductDialogVisible" @order-state-changed="orderStateChanged"> </product-scan>
    <item-process :order-state="currentOrderState" :dialog-visible.sync="processItemDialogVisible" @order-state-changed="orderStateChanged"> </item-process>
    <product-transfer :order-state="currentOrderState" :next-order-state="nextOrderState" :dialog-visible.sync="transferProductDialogVisible" @order-state-changed="orderStateChanged"> </product-transfer>
    <WorkerPerformance :order-state="currentOrderState" :dialog-visible.sync="workerPermormanceDialogVisible" @order-state-changed="orderStateChanged"> </WorkerPerformance>

    <div class="item-flow ">
      <div class="filters" style="display:none;">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <store-select  v-bind:value.sync="formData.storeId" />
          <el-form-item>
            <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="item-flow-control clear">

        <div class="location clear">

          <div class="step step1">
            <div class="head">

              <el-select  v-model="formData.storeId" size="mini" @change="handleStoreChanged" v-if="authorizeMultiStore">
                <el-option v-for="item in storeOptions" :key="item.value" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <span v-else> 门店 </span>
            </div>
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
</div>
</template>

<script>
import leftNav from "@/components/layout/LeftNav.vue"
import headTop from "@/components/layout/headTop.vue";

import StoreSelect from '@/components/common/StoreSelect.vue'
import ItemProcess from '@/components/ItemProcess.vue'
import ProductScan from '@/components/ProductScan.vue'
import ProductTransfer from '@/components/ProductTransfer.vue'
import WorkerPerformance from '@/components/WorkerPerformance.vue'
import {
  getLineItemGroupCounts
}
from '@/api/getData'

export default {
  components: {
    leftNav,
    headTop,
    StoreSelect,
    ItemProcess,
    ProductScan,
    ProductTransfer,
    WorkerPerformance
  },
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
      formData: {
        startEndTime: null,
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
  created() {
    this.$bus.$on('order-created-gevent', () => {
      console.log('on order-created-gevent')
      this.initData()
    })
    this.$bus.$on('order-changed-gevent', () => {
      console.log('on order-changed-gevent')
      this.initData()
    })
    this.formData.storeId = this.storeId
    this.initData()
  },
  computed:{
    storeOptions(){
      let options= []
      let stores = this.stores.map((item) => { return { id: item.id, name: item.name } })
      options = [{ id: 0, name: "全部店铺" }].concat(stores)
      return options
    }
  },
  methods: {
    beforeRouteEnter (to, from, next) {
      console.log( "itemflows -> beforeRouteEnter->")
    },
    async initData() {
      let q = { }
      if( this.formData.storeId > 0){
        q['store_id_eq'] = this.formData.storeId
      }
      const orderCounstResult = await getLineItemGroupCounts( {q} )
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
    },
    handleStoreChanged(){
      this.initData()
    },
    onSubmit() {
      this.initData()
    }
  }
}
</script>

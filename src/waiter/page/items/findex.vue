<style lang="scss" >
@import '../../style/mixin';
.factory-item-flow-container {
  background-color: #f4f4f4;
  .item-flow>.title-wrap {
    text-align: center;
    line-height: 48px;
    background-color: #f9fafc;
    margin: 0 18px;
    border-bottom: 1px solid #d3dce6;
  }
  .item-flow>.filters{

    width: 160vmin;
    padding: 6px 0;
    margin: auto;
    &.el-form-item{
      margin-bottom: 0;
    }
  }
  .cover{
    @include allcover();
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.1;
  }
  .item-flow-control {
        position: absolute;
        top: 50px;
        left: 18px;
        right: 18px;
        bottom: 100px;
        display: flex;
        .locations{
          width: 90vw;
          margin: auto;
        }
        .heads-wrap{
          .head{
            background: #f4b22c;
            width: 38vw;
            float: left;
            text-align: center;
            padding: 8px;
            span, i { font-size: 1.6em; color: #fff; }
          }
        }
        .location {
            position: relative;
            float: left;
            width: 38vw;
            height: 60vmin;
            &.ship {
              width: 14vw;
                border-color: transparent;
                text-align: center;
                .step{
                  background-color: transparent;
                }
            }
            .actions {
                text-align: center;
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
            .arraw{
              position: absolute;
              background-color: #f4b22c;
              width: 60px;
              height: 8px;
              transform: translate(-50%, -50%);
              /* point right, position top half part*/
              &.pr-pc{
                top: 25%;
                left: 50%;
              }
              &.pr-pr{
                top: 25%;
                right: 0;
                transform: translate(50%,-50%);
              }
              &.pl-pc{
                top: 75%;
                left: 50%;
              }
              &.pl-pr{
                top: 75%;
                right: 0;
                transform:  translate(50%,-50%);
              }
              &.pl-pc{
                top: 75%;
                left: 50%;
              }
              &.pl-pl{
                top: 75%;
                left: 0;
                transform: translate(-50%, -50%);
              }
              &.pr-pl{
                top: 25%;
                left: 0;
                transform: translate(-50%, -50%);
              }
              &.pr-plr{
                top: 25%;
                left: 50%;
                right: 25%;
                width: auto;
                transform: translate(0, -50%);
              }
              &.pl-plr{
                top: 75%;
                left: 50%;
                right: 25%;
                width: auto;
                transform: translate(0, -50%);
              }
              &.pb-ptc{
                bottom: 60%;
                top: 25%;
                width: 8px;
                left:75%;
                height: auto;
                transform: translate(-50%, -4px);
              }
              &.pt-pbc{/* point top, position bottom center */
                bottom: 25%;
                top: 60%;
                width: 8px;
                height: auto;
                left:75%;
                transform: translate(-50%, 4px);
              }
            }
          .location-store{
            background-color: #f4f4f4;
          }
          .location-factory{
            background-color: #fef6e9;
          }
          .performance-btn{
            background-color: #6a3906;
            span{
              color: #fff;
            }
          }
        }
        .step {
            position: relative;
            float: left;
            height: 100%;
            background-color: #ffffff;

            &.step0 {
              height: 30vmin;
              font-size: 14px;
            }
            &.step1 {
                width: 50%;
                /*min-height: 400px;*/
             }
            &.step2 {
                width: 50%;
                float: right;
                /*min-height: 400px;*/
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
        .order-state-btn{
          width: 12em;
          background-color: transparent;
          cursor: pointer;
          img{
            width: 50px;
          }
          .badge{
            line-height: 36px;
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
    <div class="factory-item-flow-container page-content">

      <product-scan :selected-store-id="formData.storeId" :order-state="currentOrderState" :dialog-visible.sync="scanProductDialogVisible" @order-state-changed="orderStateChanged"> </product-scan>
      <item-process :selected-store-id="formData.storeId" :order-state="currentOrderState" :dialog-visible.sync="processItemDialogVisible" @order-state-changed="orderStateChanged"> </item-process>
      <product-transfer :selected-store-id="formData.storeId" :order-state="currentOrderState" :next-order-state="nextOrderState" :dialog-visible.sync="transferProductDialogVisible" @order-state-changed="orderStateChanged"> </product-transfer>
      <WorkerPerformance :selected-store-id="formData.storeId" :order-state="currentOrderState" :dialog-visible.sync="workerPermormanceDialogVisible" @order-state-changed="orderStateChanged"> </WorkerPerformance>

      <div class="item-flow ">
        <div class="filters" style="display:none">
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <store-select  v-bind:value.sync="formData.storeId" />
            <el-form-item>
              <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-flow-control clear">
          <div class="clear locations" >
            <div class="heads-wrap clear" style="">
              <div class="head"><i class="fa fa-2x fa-home "></i> <span> 门店 </span> </div>
              <div class="head right"><i class="fa fa-2x  fa-university "></i>  <span class=" ">工厂 </span> </div>
            </div>
            <div class="clear">
              <div class="location location-store clear">
                <div class="step step1">
                  <div class="pending part-top">
                    <div class="title">
                      <button class="order-state-btn" @click="processItems('pending')">
                        <img src="../../assets/img/order/states/pending.png">
                        <div class=""> <span> 客户物品 </span>
                           <el-badge :value="itemCounts.pending" />
                         </div>
                      </button>
                    </div>
                  </div>

                  <div class="ready part-bottom">
                    <div class="title">
                      <button  class="order-state-btn" @click="processItems('ready')">
                        <img src="../../assets/img/order/states/ready.png">
                        <div class=""> <span> 等待交付 </span>
                           <el-badge :value="itemCounts.ready" />
                         </div>
                      </button>
                    </div>
                  </div>

                </div>

                <div class="step transfer1">
                  <div class="title">
                    <button  class="order-state-btn" @click="handleTransferProducts('pending', 'ready_for_factory')">
                      <img src="../../assets/img/order/states/ready_for_factory1.png">
                      <div class=""> <span> 门店发货 </span>
                         <el-badge :value="itemCounts.ready_for_factory" />
                       </div>
                    </button>
                  </div>
                </div>

                <div class="step transfer1" style="top:50%;">
                  <div class="title">
                    <button  class="order-state-btn" @click="handleTransferProducts('ready_for_store', 'ready')">
                      <img src="../../assets/img/order/states/ready_for_store2.png">
                      <div class=""> <span> 门店待验收 </span>
                         <el-badge :value="itemCounts.ready_for_store" />
                       </div>
                    </button>

                  </div>
                </div>

                <div class="arraw pr-pc"> </div>
                <div class="arraw pr-pr"> </div>
                <div class="arraw pl-pc"> </div>
                <div class="arraw pl-pr"> </div>
                <div class="cover"> </div>

              </div>

              <div class="location ship">
                <div class="step step0" style="width:100%;">
                  <div class="title">  <img src="../../assets/img/order/states/truck1.png"> 运输 </div>
                </div>
                <div class="step step0" style="width:100%;">
                  <div class="title">  <img src="../../assets/img/order/states/truck2.png">运输 </div>
                </div>
              </div>

              <div class="location location-factory clear">
                <div class="overlayx"></div>
                <div class="step step2">
                  <div class="title">
                    <button class="order-state-btn" @click="processItems('processing')">
                      <img src="../../assets/img/order/states/processing.png">
                      <div class="">
                        <el-badge :value="itemCounts.processing" />
                        <span> 专业服务 </span>
                         <el-badge :value="itemCounts.processed" />
                       </div>
                    </button>
                    <div class="actions">
                      <el-button @click="handleWorkerPerformance('processing')" class="performance-btn" size="mini">工作量录入</el-button>
                    </div>
                  </div>

                </div>
                <div class="step transfer2">
                  <div class="title">
                    <button  class="order-state-btn" @click="handleTransferProducts('ready_for_factory', 'processing')">
                      <img src="../../assets/img/order/states/ready_for_factory2.png">
                      <div class=""> <span> 工厂待接收 </span>
                         <el-badge :value="itemCounts.ready_for_factory" />
                       </div>
                    </button>
                  </div>
                </div>

                <div class="step transfer2" style="top:50%;">
                  <div class="title">

                    <button  class="order-state-btn" @click="handleTransferProducts('processed', 'ready_for_store')">
                      <img src="../../assets/img/order/states/ready_for_store1.png">
                      <div class=""> <span> 工厂发货 </span>
                         <el-badge :value="itemCounts.ready_for_store" />
                       </div>
                    </button>
                  </div>
                </div>

                <div class="arraw pr-plr"> </div>
                <div class="arraw pr-pl"> </div>
                <div class="arraw pl-plr"> </div>
                <div class="arraw pl-pl"> </div>
                <div class="arraw pb-ptc"> </div>
                <div class="arraw pt-pbc"> </div>

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
import ItemProcess from './ItemProcess.vue'
import ProductScan from './ProductScan.vue'
import ProductTransfer from './ProductTransfer.vue'
import WorkerPerformance from './WorkerPerformance.vue'
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
      itemStateImagePath:{
        pending: '../../assets/img/order/state.png',
        ready_for_factory: '../../assets/img/order/state.png',
        processing: '../../assets/img/order/state.png',
        ready_for_store: '../../assets/img/order/state.png',
        ready: '../../assets/img/order/state.png'
      },
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
      multipleSelection: []

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
    //this.formData.storeId = this.storeId
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
      let q = { order_state_eq: this.OrderStateEnum.cart }
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
      if(this.isLocationFactory()){
        // pending, ready
        if( orderState == this.LineItemGroupStateEnum.pending ||
          orderState == this.LineItemGroupStateEnum.ready ){
          return
        }
      }

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
      if(this.isLocationFactory()){
        // pending, ready_for_factory
        if( orderState == this.LineItemGroupStateEnum.pending ||
          orderState == this.LineItemGroupStateEnum.ready_for_store ){
          return
        }
      }

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

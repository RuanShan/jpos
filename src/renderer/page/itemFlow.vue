<style lang="scss" >

@import '../style/mixin';
.item-flow-container {
    .el-dialog__body {
        /*fullscreen process dialog*/
        height: 90%;
    }
    .location {
        position: relative;
        float: left;
        padding: 6px;
        border: 2px dashed #c5c5c5;
        width: 45%;
        &.ship {
            width: 10%;
            border-color: transparent;
            background-color: gray;
            text-align: center;
        }
        .head{
          position: absolute;
          top:0;
          right:0;
          left:0;
          text-align:center;
        }
        .actions{
          position: absolute;
          bottom:0;
          right:0;
          left:0;
        }
    }
    .step {
        position: relative;
        float: left;
        padding: 20px;
        height: 140px;
        &.step0 {
            min-height: 300px;
        }
        &.step1 {
            width: 50%;
            min-height: 600px;
            background-color: #32CD32;
        }
        &.step2 {
            width: 50%;
            float: right;
            min-height: 600px;
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
            @include center
            padding: 8px;
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
            left:0;
            right: 0;
        }
        .part-bottom {
            height: 50%;
            position: absolute;
            bottom: 0;
            left:0;
            right: 0;
        }
    }
}

.table_container {
    padding: 20px 0;
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
<div class="item-flow-container fillcontain">
    <scan-product :order-state="currentOrderState" :dialog-visible.sync="scanProductDialogVisible" @order-state-changed="orderStateChanged"> </scan-product>
    <process-item :order-state="currentOrderState" :dialog-visible.sync="processItemDialogVisible" @order-state-changed="orderStateChanged"> </process-item>
    <transfer-product :order-state="currentOrderState" :next-order-state="nextOrderState" :dialog-visible.sync="transferProductDialogVisible" @order-state-changed="orderStateChanged"> </transfer-product>
    <worker-performance :order-state="currentOrderState" :dialog-visible.sync="workerPerformanceDialogVisible" @order-state-changed="orderStateChanged"> </worker-performance>

    <div class="table_container ">
        <div class="steps clear">

            <div class="location clear">

                <div class="step step1">
                  <div class="head"> 门店                </div>
                    <div class="pending part-top">
                      <div class="title">
                        <el-button @click="processItems('pending')" >
                          客户物品  <div class="badge"> <sup> {{itemCounts.pending}} </sup> </div>
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
                      <el-button @click="handleTransferProducts('pending', 'ready_for_factory')" >门店发货
                        <div class="badge"> <sup> {{itemCounts.ready_for_factory}} </sup> </div>
                      </el-button>
                    </div>
                </div>


                <div class="step transfer1" style="top:50%;">
                    <div class="linex " style=""> </div>
                    <div class="title">
                      <el-button @click="handleTransferProducts('ready_for_store', 'ready')" >
                        门店待验收  <div class="badge"> <sup> {{itemCounts.ready_for_store}} </sup> </div>
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

                <div class="step step2">
                  <div class="head"> 工厂                </div>
                    <div class="title">
                      <el-button @click="processItems('processing')">
                        <div class="badge"> <sup> {{itemCounts.processing}} </sup> </div> 专业服务
                        <div class="badge"> <sup> {{itemCounts.processed}} </sup> </div>
                      </el-button>
                    </div>
                    <div class="actions">
                        <el-button @click="handleWorkerPerformance('processing')">工作量录入</el-button>
                        <el-button @click="handleScanOrders('processing')">扫码验收</el-button>
                    </div>
                </div>
                <div class="step transfer2">
                    <div class="linex"> </div>
                    <div class="title">
                      <el-button @click="handleTransferProducts('ready_for_factory', 'none')" > 工厂待收货
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

import headTop from '@/components/layout/headTop'
import processOrder from '@/components/processOrder'
import processItem from '@/components/processItem'
import scanProduct from '@/components/scanProduct'
import transferProduct from '@/components/transferProduct'
import workerPerformance from '@/components/workerPerformance'
import {
    findOrders, getLineItemGroupCounts
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
                scanProductDialogVisible: false,
                transferProductDialogVisible: false,
                workerPerformanceDialogVisible: false,
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
            processOrder,
            processItem,
            scanProduct,
            transferProduct,
            workerPerformance
        },
        mixins: [userDataMixin],
        created() {
          //  this.getCurrentUser().then(res => {
          //      if (this.userInfo.id) {
                    this.initData()
          //      } else {
          //          this.$router.push('/login')
          //      }
          //  })
        },

        methods: {
            async initData() {
                    const orderCounstResult = await getLineItemGroupCounts()
                    Object.assign(this.itemCounts, orderCounstResult)
                },
                handleSizeChange(val) {
                    console.log(`每页 ${val} 条`)
                },
                handleCurrentChange(val) {
                    this.currentPage = val
                    this.offset = (val - 1) * this.limit
                    this.getOrders()
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
                    this.workerPerformanceDialogVisible = true
                    this.currentOrderState = orderState
                    console.log('handleWorkerPerformance')
                },

                orderStateChanged() {
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

                    const ordersResult = await findOrders(queryParams)
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

<style lang="scss">

@import '../style/mixin';
.order-process-container {
    position: relative;
    .order-list {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 0;
        width: 30%;
        padding: 16px;
        border: 1px #efefef solid;
    }
    .order-detail {
        position: absolute;
        width: 70%;
        top: 80px;
        bottom: 0;
        right: 0;
        padding: 16px;
        border: 1px #efefef solid;
        .actions {
            position: absolute;
            bottom: 16px;
            left: 16px;
            right: 16px;
            text-align: right;
        }
    }
    table {
        width: 100%;
        td {
            vertical-align: top;
        }
    }
    .pagination {
        position: absolute;
        right: 16px;
        bottom: 16px;
    }
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

.filters {
    margin: 0 0 20px 0;
    border: 1px #efefef solid;
    padding: 10px;
    background: #f9f9f9;
    .filter {
        display: inline-block;
        width: auto;
        padding: 10px;
        border-radius: 5px;
        .el-select {
            display: inline-block;
        }
    }
    .el-input {
        width: 150px;
        display: inline-block;
    }
}

</style>

<template>

<el-dialog title="提示" :visible="computedVisible" fullscreen :before-close="handleDialogClose" @open="handleDialogOpen">

    <div class="order-process-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入订单号或用户名" v-model="filters.keyword" @change="handleKeywordChange"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.shipmentState" placeholder="All">
                    <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->

        <div class="order-list">

            <el-table :data="shipmentList" highlight-current-row @current-change="handleCurrentRowChange" :row-key="row => row.number" style="width: 100%">

                <el-table-column label="ShipmentNumber" prop="id">
                </el-table-column>
                <el-table-column label="service" prop="totalAmount">
                </el-table-column>
                <el-table-column label="价格" prop="totalAmount">
                </el-table-column>
                <el-table-column label="订单状态" prop="shipmentState">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>

        </div>

        <div class="order-detail">
            <div class="shipments-container" v-if="currentOrder">
                <table style="width: 100%">
                    <tr>
                        <td> 用户名 </td>
                        <td> <span>{{ currentOrder.userName }}</span></td>
                    </tr>
                    <tr>
                        <td> 店铺名称 </td>
                        <td> <span>{{ currentOrder.storeName }}</span></td>
                    </tr>
                </table>
                <template v-for="shipment in currentOrder.shipments">
                    <table style="width: 100%">
                        <tr>
                            <td>GroupNumber</td>
                            <td> {{shipment.number}} </td>
                            <td>State</td>
                            <td> {{shipment.state}} </td>
                        </tr>
                        <tr>
                            <td> Services </td>
                            <td>
                                <div v-for="lineItem in shipment.lineItems">
                                    <span>{{ lineItem.name }}</span>
                                    <span>{{ lineItem.price }}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Images</td>
                            <td> {{shipment.number}} </td>
                        </tr>
                    </table>
                </template>

                <div class="actions">
                    <el-button @click="ChangeCurrentOrderState(false)">DrawBack</el-button>
                    <el-button @click="ChangeCurrentOrderState(true)" type="primary">NextStep</el-button>
                </div>
            </div>

        </div>
    </div>
</el-dialog>

</template>

<script>

import {
    getOrder, evolvePosOrders
}
from '@/api/getData'
import {
    userDataMixin
}
from '@/components/userDataMixin'
import {
    apiResultMixin
}
from '@/components/apiResultMixin'


export default {
    data() {
            return {
                shipmentList: [],
                currentOrder: null,
                orderDetailList: [],
                perPage: 2,
                count: 0,
                currentPage: 1,
                storeId: null,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    shipmentState: '',
                    storeId: 0
                },
                multipleSelection: [],
                orderStateOptions: [{
                    value: 'pending',
                    label: '新订单'
                }, {
                    value: 'ready_for_factory',
                    label: '准备发工厂'
                }, {
                    value: 'processing',
                    label: 'processing'
                }, {
                    value: 'ready_for_store',
                    label: 'ready_for_store'
                }, {
                    value: 'ready',
                    label: '待交付'
                }]

            }
        },
        mixins: [userDataMixin, apiResultMixin],
        props: ['dialogVisible', 'orderState', 'orderCounts'],
        created() {
            console.log('processOrder created')
        },
        computed: {
            computedVisible: function() {
                return this.dialogVisible
            },
        },
        methods: {
            async initData() {
            },
            ChangeOrderStates(forward = true) {
                let orderNumbers = this.multipleSelection.map((order) => order.number)
                if (orderNumbers.length == 0) {
                    this.$message({
                        message: '警告哦，Please select a order at least',
                        type: 'warning'
                    });
                    return;
                }

                this.MoveOrderToNextState( orderNumbers,forward )
            },
            ChangeCurrentOrderState(forward = true) {
                if (this.currentOrder == null) {
                    this.$message({
                        message: '警告哦，Please select a order at least',
                        type: 'warning'
                    });
                    return;
                }
                let orderNumbers = [ this.currentOrder.number ]

                this.MoveOrderToNextState( orderNumbers,forward )
            },

            async MoveOrderToNextState( orderNumbers = [], forward = true) {
                let queryParams = {
                    order_numbers: orderNumbers,
                    forward
                }
                console.log('ChangeOrderStates', queryParams)
                const posOrdersReturn = await evolvePosOrders(queryParams)
                if (posOrdersReturn.count > 0) {

                    this.$emit('order-state-changed')
                }
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleDialogClose(done) {

                this.$emit('update:dialogVisible', false)
                done();

            },
            handleDialogOpen(){
              this.filters.shipmentState = this.orderState
              this.shipmentList.length = 0
              console.log('handleDialogOpen yeah')
            },
            handleKeywordChange(value){
              //const pattern = /[\d]{14}/
              //if(pattern.test(value)){

              //}
            },
            async handleCurrentRowChange(row) {
                if( row ){
                  const detailIndex = this.orderDetailList.findIndex(function(currentValue) {
                      return currentValue.number == row.number
                  })
                  if (detailIndex < 0) {
                      //const storeInfo = await getStore(row.store_id)
                      //const userInfo = await getUserInfo(row.user_id)
                      const orderResult = await getOrder(row.number)
                      const orderDetail = this.buildOrderFromApiResult(orderResult)
                      console.log("orderDetail", orderDetail)
                      this.currentOrder = orderDetail
                      this.$nextTick(() => {
                          this.orderDetailList.push(orderDetail)
                      })
                  } else {
                      this.currentOrder = this.orderDetailList[detailIndex];
                  }
                  console.log('handleCurrentRowChange', row, this.currentOrder)

                }else{
                  this.currentOrder = null
                }
            }
        }
}

</script>

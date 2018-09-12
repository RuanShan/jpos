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
        .group-container{
          border-bottom: 1px solid #ebeef5;
        }
        .actions {
            position: absolute;
            bottom: 16px;
            left: 16px;
            right: 16px;
            text-align: right;
        }
    }
    table.bordered {
        width: 100%;
        td {
            vertical-align: top;
            border-bottom: 1px solid #ebeef5;
        }
        tr:hover{
          background-color: #f5f7fa;
        }
    }
    .pagination {
        position: absolute;
        right: 16px;
        bottom: 16px;
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
}



</style>

<template>

<el-dialog title="提示" :visible="computedVisible" fullscreen :before-close="handleDialogClose" @open="handleDialogOpen">

    <div class="order-process-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入订单号或用户名" v-model="filters.keyword"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.groupState" placeholder="All">
                    <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->

        <div class="order-list">
            <el-table :data="orderList" highlight-current-row @current-change="handleCurrentRowChange" :row-key="row => row.index" style="width: 100%">
                <el-table-column label="订单 ID" prop="id">
                </el-table-column>
                <el-table-column label="总价格" prop="totalAmount">
                </el-table-column>
                <el-table-column label="订单状态" prop="groupState">
                </el-table-column>
            </el-table>
            <div class="pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="currentPage" :page-size="perPage" layout="total,  pager" :total="count">
                </el-pagination>
            </div>
        </div>

        <div class="order-detail">
            <div class="line-item-groups-container" v-if="currentOrder">
                <table class="bordered" style="width: 100%">
                    <tr>
                        <td> 用户名 </td>
                        <td> <span>{{ currentOrder.userName }}</span></td>
                    </tr>
                    <tr>
                        <td> 店铺名称 </td>
                        <td> <span>{{ currentOrder.storeName }}</span></td>
                    </tr>
                </table>
                  <div v-for="lineItemGroup in currentOrder.lineItemGroups" class="group-container">
                    <table style="width: 100%">
                        <tr>
                            <td>GroupNumber</td>
                            <td> {{lineItemGroup.number}} </td>
                            <td>State</td>
                            <td> {{lineItemGroup.state}} </td>
                        </tr>
                        <tr>
                            <td> Services </td>
                            <td>
                                <div v-for="lineItem in lineItemGroup.lineItems">
                                    <span>{{ lineItem.name }}</span>
                                    <span>{{ lineItem.price }}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Images</td>
                            <td> line item group images </td>
                        </tr>
                    </table>
                </div>

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
    findOrders, getOrder, evolvePosOrders
}
from '@/api/getData'

import {
    apiResultMixin
}
from '@/components/apiResultMixin'


export default {
    data() {
            return {
                orderList: [],
                currentOrder: null,
                orderDetailList: [],
                perPage: 2,
                count: 0,
                currentPage: 1,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    groupState: '',
                    storeId: 0
                },
                multipleSelection: [],

            }
        },
        mixins: [ apiResultMixin],
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
                    this.getOrders()
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
                    this.getOrders()
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
              this.orderDetailList = []
              this.filters.groupState = this.orderState
              this.initData()
              console.log('handleDialogOpen yeah')
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
            },

            handleCurrentPageChange(val) {
                this.currentPage = val
                this.offset = (val - 1) * this.limit
                this.getOrders()
            },
            async getOrders() {
                let queryParams = {
                    page: this.currentPage,
                    per_page: this.perPage,
                }

                if (this.filters.keyword.length > 0) {
                    // order.number || order.users.username
                    queryParams["q[user_username_cont]"] = this.filters.keyword
                }
                if (this.filters.groupState.length > 0 ) {

                    queryParams["q[group_state_eq]"] = this.filters.groupState
                }

                console.log("queryParams", queryParams)
                const ordersResult = await findOrders(queryParams)
                this.count = ordersResult.total_count
                this.orderList.splice( 0, this.orderList.length, ...this.buildOrders(ordersResult))
                this.$emit('myLog','async init')

            },
            async handleCurrentRowChange(row) {
                if( row ){
                  const detailIndex = this.orderDetailList.findIndex(function(currentValue) {
                      return currentValue.number == row.number
                  })
                  if (detailIndex < 0) {
                      //const storeInfo = await getStore(row.store_id)
                      //const userInfo = await getUserInfo(row.user_id)
                      const orderResult = await getOrder(row.id)
                      const orderDetail = this.buildOrder(orderResult)
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

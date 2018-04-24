<style lang="scss">

@import '../style/mixin';
.scan-product-container {
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

    <div class="scan-product-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入订单号或用户名" v-model="filters.keyword" @change="handleKeywordChange"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.lineItemGroupState" placeholder="All">
                    <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->

        <div class="order-list">

            <el-table :data="lineItemGroupList" highlight-current-row @current-change="handleCurrentRowChange" @selection-change="handleSelectionChange" :row-key="row => row.number" style="width: 100%">
               <el-table-column  type="selection"  width="55"> </el-table-column>

                <el-table-column label="GroupNumber" prop="number">
                </el-table-column>
                <el-table-column label="订单状态" prop="state">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" size="mini" circle ></el-button>                    
                  </template>
                </el-table-column>
            </el-table>

        </div>

        <div class="order-detail">
            <div class="line-item-groups-container" v-if="currentOrder">
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
                            <td> {{lineItemGroup.number}} </td>
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
    evolvePosOrders, findOrderByGroupNumber
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
                currentOrder: null,
                currentGroup: null,// a order may have several line_item_groups
                orderDetailList: [],
                lineItemGroupList: [],
                storeId: null,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    lineItemGroupState: '',
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
            console.log('scanProduct created')
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
                if (this.currentGroup == null) {
                    this.$message({
                        message: '警告哦，Please select a order at least',
                        type: 'warning'
                    });
                    return;
                }
                let orderNumbers = [ this.currentGroup.number ]

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
              this.filters.keyword = ""
              this.filters.lineItemGroupState = this.orderState
              this.lineItemGroupList.length = 0
              console.log('handleDialogOpen yeah')
            },
            handleKeywordChange(value){
              const pattern = /[\d]{14}/
              if(pattern.test(value)){
                this.findOrderByGroupNumber( value )
              }
            },
            async handleCurrentRowChange(row) {
                if( row ){
                  this.currentGroup = row;
                  this.currentOrder = this.currentGroup.order

                  console.log('handleCurrentRowChange', this.currentOrder, this.currentGroup)
                }else{
                  this.currentGroup = null
                }
            },
            async findOrderByGroupNumber(number) {
              // find in orderDetailList
              this.currentOrder = this.orderDetailList.find((order)=>{
                let found = order.lineItemGroups.find((group) => {
                  return group.number == number
                })
                return found != null
              })

              if( this.currentOrder ){
                this.currentGroup = this.currentOrder.lineItemGroups.find( (group)=>{
                  return group.number == number
                })
              }else{
                // find by network
                const orderResult = await findOrderByGroupNumber(number)
                const orderDetail = this.buildOrderFromApiResult(orderResult)
                this.currentOrder = orderDetail
                this.currentGroup = this.currentOrder.lineItemGroups.find(function( group, index){
                  return group.number == number
                })
                //this.orderDetail.find
                this.$nextTick(() => {
                  this.orderDetailList.push(this.currentOrder)
                  this.lineItemGroupList.push(this.currentGroup)
                })
              }

            }

        }
}

</script>

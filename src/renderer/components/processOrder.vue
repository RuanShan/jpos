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

<el-dialog title="提示" :visible="computedVisible" fullscreen :before-close="handleClose">

    <div class="order-process-container fillcontain clear">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字:
                <el-input label="Keyword" placeholder="请输入订单号或用户名" v-model="filters.keyword"  size="medium"></el-input>
            </div>
            <div class="filter">
                状态:
                <el-select v-model="filters.shipment_state" placeholder="All"  size="medium">
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
                <el-table-column label="总价格" prop="total_amount">
                </el-table-column>
                <el-table-column label="订单状态" prop="status">
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="count">
                </el-pagination>
            </div>
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
                <template  v-for="shipment in currentOrder.shipments">
                <table>
                    <tr>
                        <td>ShippmentNumber</td>
                        <td> {{shipment.number}} </td>
                    </tr>
                    <tr>
                        <td> Services </td>
                        <td>
                            <div v-for="lineItem in shipment.lineItems">
                                <el-form-item label="name">
                                    <span>{{ lineItem.name }}</span>
                                </el-form-item>
                                <el-form-item label="price">
                                    <span>{{ lineItem.price }}</span>
                                </el-form-item>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Images</td>
                        <td> {{shipment.number}} </td>
                    </tr>
                </table>
                </template>

            </div>
        </div>
    </div>
</el-dialog>

</template>

<script>

import {
    getOrderList, getOrder
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
                orderList: [],
                currentOrder: null,
                orderDetailList: [],
                perPage: 2,
                count: 0,
                currentPage: 1,
                store_id: null,
                filters: {
                    keyword: '',
                    startEndTime: null,
                    shipment_state: 'pending',
                    store_id: 0
                },
                multipleSelection: [],
                orderStateOptions: [{
                    value: 'pending',
                    label: '新订单'
                }, {
                    value: 'partial',
                    label: 'partial'
                }, {
                    value: 'ready_for_factory',
                    label: '准备发工厂'
                }, {
                    value: 'ready',
                    label: '待交付'
                }]

            }
        },
        mixins: [userDataMixin, apiResultMixin],
        props: ['dialogVisible'],
        created() {
        console.log('processOrder created')
            if (this.userInfo.id) {
                this.storeId = this.userInfo.store_id
                this.initData()
            }
        },
        computed: {
            computedVisible: function() {
                return this.dialogVisible
            }
        },
        methods: {
            async initData() {
                    this.getOrders()
                },
                handleClose(done) {
                    this.$confirm('确认关闭？')
                        .then(_ => {
                            this.$emit('update:dialogVisible', false)
                            done();
                        })
                        .catch(_ => {});
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
                    if (this.filters.shipment_state.length > 0 && this.filters.shipment_state != 'all') {

                        queryParams["q[shipment_state_eq]"] = this.filters.shipment_state
                    }

                    const ordersResult = await getOrderList(queryParams)
                    this.count = ordersResult.total_count
                    console.log("total_count", this.count)
                    this.orderList = this.buildOrdersFromApiResult(  ordersResult )
                },
                async handleCurrentRowChange(row) {
                    const detailIndex = this.orderDetailList.findIndex(function(currentValue){
                      return currentValue.number == row.number
                    })
                    if( detailIndex < 0) {
                        //const storeInfo = await getStore(row.store_id)
                        //const userInfo = await getUserInfo(row.user_id)
                        const orderResult = await getOrder(row.number)
                        const orderDetail = this.buildOrderFromApiResult( orderResult )
                        console.log("orderDetail", orderDetail)
                        this.currentOrder = orderDetail
                        this.$nextTick(() => {
                            this.orderDetailList.push(orderDetail)
                        })
                    } else {
                        this.currentOrder = this.orderDetailList[detailIndex];
                    }
                    console.log('handleCurrentRowChange', row, this.currentOrder)
                }
        }
}

</script>

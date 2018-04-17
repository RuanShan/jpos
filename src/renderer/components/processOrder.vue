<style lang="scss">

@import '../style/mixin';
.order-process-container {
    position: relative;
    .order-list {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 30%;
        padding: 16px;
        border: 1px #efefef solid;
    }
    .order-detail {
        position: absolute;
        width: 70%;
        top: 0;
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
        <div class="order-list">
            <!-- filters start -->
            <div class="filters">
                <div class="filter">
                    Keyword:
                    <el-input label="Keyword" placeholder="请输入number or username" v-model="filters.keyword"></el-input>
                </div>
                <div class="filter">
                    OrderState:
                    <el-select v-model="filters.shipment_state" placeholder="All">
                        <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                </div>
                <el-button type="primary" @click="handleSearch()">搜索</el-button>
            </div>
            <!-- filters end -->

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

            <div class="shipments-container" v-if="currentRow">
                <table style="width: 100%">
                    <tr>
                        <td> 用户名 </td>
                        <td> <span>{{ currentRow.userName }}</span></td>
                    </tr>
                    <tr>
                        <td> 店铺名称 </td>
                        <td> <span>{{ currentRow.storeName }}</span></td>
                    </tr>
                </table>
                <table v-for="shipment in currentRow.shipments">
                    <tr>
                        <td>ShippmentNumber</td>
                        <td> {{shipment.number}} </td>
                    </tr>
                    <tr>
                        <td> Services </td>
                        <td>
                            <div v-for="lineItem in currentRow.lineItems">
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


            </div>
        </div>
    </div>
</el-dialog>

</template>

<script>

import {
    getOrderList, getStore, getUserInfo, getOrder
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
                currentRow: null,
                expandedRows: [],
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
        mixins: [userDataMixin, apiResultMixin],
        props: ['dialogVisible'],
        created() {
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
                    console.log('handleCurrentRowChange', row)
                    this.currentRow = row;

                    if (this.expandedRows.indexOf(row) < 0) {
                        //const storeInfo = await getStore(row.store_id)
                        //const userInfo = await getUserInfo(row.user_id)
                        const orderInfo = await getOrder(row.number)
                        const lineItems = []
                        orderInfo.line_items.forEach((item, index) => {
                            const rowData = {}
                            rowData.name = item.variant.name
                            rowData.options_text = item.variant.options_text
                            rowData.price = item.price
                            lineItems.push(rowData)
                        })
                        console.log("orderInfo.line_items", lineItems)

                        this.orderList.splice(row.index, 1, {...row, ... {
                                storeName: orderInfo.store_name,
                                userName: orderInfo.user_name,
                                createdAt: orderInfo.created_at,
                                lineItems: lineItems
                            }
                        })
                        this.$nextTick(() => {
                            this.expendRow.push(row.index)
                        })
                    } else {
                        const index = this.expendRow.indexOf(row.index)
                        this.expendRow.splice(index, 1)
                    }
                }
        }
}

</script>

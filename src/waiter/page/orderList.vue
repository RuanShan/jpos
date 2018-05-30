<style lang="scss" scoped>

.orders-container {
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
    .pagination-wrapper {
        float:right;
        padding: 30px;
    }
    .collection-options{
       padding: 30px;
       float:left;
    }
}

</style>

<template>

<div class="orders-container main">
    <leftNav></leftNav>
    <div class="container">
        <h3> order list </h3>
        <!-- filters start -->
        <div class="filters">

            <div class="filter">
                Keyword: <el-input label="Keyword" placeholder="请输入number or username" v-model="filters.keyword"></el-input>
            </div>
            <div class="filter">
                OrderState: <el-select v-model="filters.shipment_state" placeholder="All">
                            <el-option
                              v-for="item in orderStateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>

            </div>
            <div class="filter">
                起止时间：
                <el-date-picker type="datetimerange" placeholder="选择时间范围" style="width:350px" v-model="filters.startEndTime"></el-date-picker>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </div>
        <!-- filters end -->

        <el-table :data="tableData" @selection-change="handleSelectionChange" @expand-change='expand' :expand-row-keys='expendRow' :row-key="row => row.index" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="用户名">
                            <span>{{ props.row.user_name }}</span>
                        </el-form-item>
                        <el-form-item label="店铺名称">
                            <span>{{ props.row.restaurant_name }}</span>
                        </el-form-item>
                        <el-form-item label="收货地址">
                            <span>{{ props.row.address }}</span>
                        </el-form-item>
                        <el-form-item label="店铺 ID">
                            <span>{{ props.row.restaurant_id }}</span>
                        </el-form-item>
                        <el-form-item label="店铺地址">
                            <span>{{ props.row.restaurant_address }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55" :reserve-selection="reserveSelection"></el-table-column>

            <el-table-column label="订单 ID" prop="number">
            </el-table-column>
            <el-table-column label="总价格" prop="total_amount">
            </el-table-column>
            <el-table-column label="shipment状态" prop="shipment_state">
            </el-table-column>
            <el-table-column label="payment状态" prop="payment_state">
            </el-table-column>
            <el-table-column  width="150" label="操作">
              <template slot-scope="scope">
                <el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>

        <div class="collection-options">
          <el-button @click="ChangeOrderStates">Next Step</el-button>
          <el-button @click="ChangeOrderStates(false)">Draw Back</el-button>
          <el-button >print</el-button>

        </div>
        <div class="pagination-wrapper" >
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="perPage" layout="total, prev, pager, next" :total="count">
            </el-pagination>
        </div>
    </div>

</div>

</template>

<script>

import leftNav from '@/components/LeftNav/LeftNav.vue'
import headTop from '../components/headTop'
import {
    findOrders, evolvePosOrders, getStore, getUserInfo, getAddressById
}
from '@/api/getData'
import {
    userDataMixin
}
from '@/components/userDataMixin'

export default {
    data() {
            return {
                tableData: [],
                currentRow: null,
                perPage: 2,
                count: 4,
                currentPage: 1,
                storeId: null,
                reserveSelection: false,
                expendRow: [],
                filters: { keyword: '', startEndTime: null, shipment_state: 'all' },
                multipleSelection: [],
                orderStateOptions: [{ value: 'all', label: 'all' },
                  { value: 'pending', label: 'pending' },
                  { value: 'partial', label: 'partial' },
                  { value: 'ready_for_factory', label: 'ready_for_factory' },
                  { value: 'ready', label: 'ready' }]

            }
        },
    components: {
        headTop,
        leftNav
    },
    mixins: [userDataMixin],
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            console.log(' beforeRouteEnter ')
        })
    },
    created() {
        this.storeId = this.userInfo.storeId
        this.initData()
    },
    mounted() {

    },
    methods: {
        async initData() {
            try {

                this.getOrders()
            } catch (err) {
                console.log('获取数据失败', err)
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getOrders()
        },
        handleSearch() {
            this.initData()
        },
        async getOrders() {
          let queryParams = {
              page: this.currentPage,
              per_page: this.perPage,
              "q[store_id_eq]": this.storeId
          }
          if ( this.filters.keyword.length>0){
            // order.number ||  || order.users.username
            queryParams["q[user_username_cont]"] = this.filters.keyword
          }
          if ( this.filters.shipment_state.length>0 && this.filters.shipment_state != 'all' ){
            // order.number ||  || order.users.username
            queryParams["q[group_state_eq]"] = this.filters.shipment_state
          }

            const ordersResult = await findOrders(queryParams)
            this.count = ordersResult.total_count
            this.tableData = []
            ordersResult.orders.forEach((item, index) => {
                const tableData = {}
                tableData.id = item.id
                tableData.number = item.number
                tableData.total_amount = item.display_total
                tableData.status = item.state
                tableData.user_id = item.user_id
                tableData.store_id = item.store_id
                tableData.address_id = item.address_id
                tableData.index = index
                tableData.shipment_state = item.shipment_state
                tableData.payment_state = item.payment_state
                this.tableData.push(tableData)
            })
        },
        async expand(row, status) {
            if (status) {
                const restaurant = await getStore(row.store_id)
                const userInfo = await getUserInfo(row.user_id)
                const addressInfo = await getAddressById(row.address_id)

                this.tableData.splice(row.index, 1, {...row, ... {
                        restaurant_name: restaurant.name,
                        restaurant_address: restaurant.address,
                        address: addressInfo.address,
                        user_name: userInfo.username
                    }
                })
                this.$nextTick(() => {
                    this.expendRow.push(row.index)
                })
            } else {
                const index = this.expendRow.indexOf(row.index)
                this.expendRow.splice(index, 1)
            }
        },
        handleEditSave() {
        /*  editUser(this.editForm).then(() => {
            this.fetchData()
            this.editDialog = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          })
          */
        },
        handleSave() {
        /*
          addUser(this.createForm).then(() => {
            this.fetchData()
            this.createDialog = false
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
          */
        },
        handleEdit($index, row) {
          this.editForm.id = row.id
          this.editDialog = true
        },
        handleDelete($index, row) {
          this.$confirm('是否删除此条信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          /*
            removeUser({
              id: row.id
            }).then(() => {
              this.fetchData()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            })
            */
          })
        },

        handleSelectionChange(val) {
          this.multipleSelection = val
        },
        async ChangeOrderStates(forward = true){
          let orderNumbers = this.multipleSelection.map((order)=> order.number)
          if( orderNumbers.length == 0){
            this.$message({
              message: '警告哦，Please select a order at least',
              type: 'warning'
            });
            return;
          }

          const posOrdersReturn = await evolvePosOrders( { order_numbers: orderNumbers, forward } )
          if( posOrdersReturn.count>0 ){
            this.getOrders()
          }

          console.log( 'ChangeOrderStates', orderNumbers)
        }
    },
}

</script>

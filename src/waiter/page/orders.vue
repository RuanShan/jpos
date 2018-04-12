<style lang="scss">

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
        text-align: center;
        padding: 30px;
    }
}

</style>

<template>

<div class="orders-container">
    <leftNav></leftNav>
    <div class="table_container">
        <h3> order list </h3>
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                <el-input placeholder="请输入number or username" v-model="filters.keyword"></el-input>
            </div>
            <div class="filter">
                起止时间：
                <el-date-picker type="datetimerange" placeholder="选择时间范围" style="width:350px" v-model="filters.startEndTime"></el-date-picker>
            </div>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" @click="createDialog = true">创建</el-button>
        </div>
        <!-- filters end -->

        <el-table :data="tableData" @expand-change='expand' :expand-row-keys='expendRow' :row-key="row => row.index" style="width: 100%">
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

            <el-table-column label="订单 ID" prop="id">
            </el-table-column>
            <el-table-column label="总价格" prop="total_amount">
            </el-table-column>
            <el-table-column label="订单状态" prop="status">
            </el-table-column>
            <el-table-column :context="_self" width="150" inline-template label="操作">
              <div>
                <el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
              </div>
            </el-table-column>
        </el-table>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="per_page" layout="total, prev, pager, next" :total="count">
            </el-pagination>
        </div>
    </div>

</div>

</template>

<script>

import leftNav from '@/components/LeftNav/LeftNav.vue'
import headTop from '../components/headTop'
import {
    getOrderList, getResturantDetail, getUserInfo, getAddressById
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
                per_page: 2,
                count: 4,
                currentPage: 1,
                store_id: null,
                reserveSelection: false,
                expendRow: [],
                filters: { keyword: '', startEndTime: null }
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
        this.store_id = this.userInfo.store_id;
        this.initData();
    },
    mounted() {

    },
    methods: {
        async initData() {
            try {

                this.getOrders();
            } catch (err) {
                console.log('获取数据失败', err);
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getOrders()
        },
        handleSearch() {
            this.initData();
        },
        async getOrders() {
          let queryParams = {
              page: this.currentPage,
              per_page: this.per_page,
              "q[store_id_eq]": this.store_id
          }
          if ( this.filters.keyword.length>0){
            // order.number ||  || order.users.username
            queryParams["q[user_username_cont]"] = this.filters.keyword
          }
          console.log( this.filters )
            const ordersResult = await getOrderList(queryParams);
            console.log(ordersResult)
            this.count = ordersResult.total_count
            this.tableData = [];
            ordersResult.orders.forEach((item, index) => {
                const tableData = {};
                tableData.id = item.id;
                tableData.number = item.number
                tableData.total_amount = item.display_total;
                tableData.status = item.state;
                tableData.user_id = item.user_id;
                tableData.store_id = item.store_id;
                tableData.address_id = item.address_id;
                tableData.index = index;
                this.tableData.push(tableData);
            })
        },
        async expand(row, status) {
            if (status) {
                const restaurant = await getResturantDetail(row.store_id);
                const userInfo = await getUserInfo(row.user_id);
                const addressInfo = await getAddressById(row.address_id);

                this.tableData.splice(row.index, 1, {...row, ... {
                        restaurant_name: restaurant.name,
                        restaurant_address: restaurant.address,
                        address: addressInfo.address,
                        user_name: userInfo.username
                    }
                });
                this.$nextTick(() => {
                    this.expendRow.push(row.index);
                })
            } else {
                const index = this.expendRow.indexOf(row.index);
                this.expendRow.splice(index, 1)
            }
        },
        handleEditSave() {
        /*  editUser(this.editForm).then(() => {
            this.fetchData();
            this.editDialog = false;
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
          });
          */
        },
        handleSave() {
        /*
          addUser(this.createForm).then(() => {
            this.fetchData();
            this.createDialog = false;
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          });
          */
        },
        handleEdit($index, row) {
          this.editForm.id = row.id;
          this.editDialog = true;
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
              this.fetchData();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            });
            */
          });
        },
    },
}

</script>

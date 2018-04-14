<template>
    <div class="fillcontain">
      <div class="table_container">
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


            <el-table
          :data="tableData"
          @expand='expand'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
          style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用户名" >
                  <span>{{ props.row.user_name }}</span>
                </el-form-item>
                <el-form-item label="店铺名称">
                  <span>{{ props.row.restaurant_name }}</span>
                </el-form-item>
                <el-form-item label="收货地址">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="店铺 ID">
                  <span>{{ props.row.store_id }}</span>
                </el-form-item>
                <el-form-item label="店铺地址">
                  <span>{{ props.row.restaurant_address }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="订单 ID"
            prop="id">
          </el-table-column>
          <el-table-column
            label="总价格"
            prop="total_amount">
          </el-table-column>
          <el-table-column
            label="订单状态"
            prop="status">
          </el-table-column>
      </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
      </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {getOrderList, getResturantDetail, getUserInfo, getAddressById} from '@/api/getData'
    export default {
      data () {
        return {
          tableData: [],
          currentRow: null,
          per_page: 2,
          count: 4,
          currentPage: 1,
          store_id: null,
          expendRow: [],
          filters: { keyword: '', startEndTime: null, shipment_state: 'all', store_id: 0 },
          multipleSelection: [],
          orderStateOptions: [{ value: 'all', label: 'all' },
            { value: 'pending', label: 'pending' },
            { value: 'partial', label: 'partial' },
            { value: 'ready_for_factory', label: 'ready_for_factory' },
            { value: 'ready', label: 'ready' }]

        }
      },
      components: {
        headTop
      },
      created () {
        this.store_id = this.$route.query.store_id
        this.initData()
    },
      mounted () {

      },
      methods: {
        async initData () {
          try {
            this.getOrders()
          } catch (err) {
            console.log('获取数据失败', err)
          }
        },
        handleSizeChange (val) {
          console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
          this.currentPage = val
          this.offset = (val - 1) * this.limit
          this.getOrders()
        },
        async getOrders () {
          let queryParams = {
              page: this.currentPage,
              per_page: this.per_page,
          }
          if ( this.filters.store_id>0){
            queryParams["q[store_id_eq]"] = this.filters.store_id

          }

          if ( this.filters.keyword.length>0){
            // order.number ||  || order.users.username
            queryParams["q[user_username_cont]"] = this.filters.keyword
          }
          if ( this.filters.shipment_state.length>0 && this.filters.shipment_state != 'all' ){
            // order.number ||  || order.users.username
            queryParams["q[shipment_state_eq]"] = this.filters.shipment_state
          }

          const ordersResult = await getOrderList(queryParams)
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
        async expand (row, status) {
          if (status) {
            const restaurant = await getResturantDetail(row.store_id)
            const userInfo = await getUserInfo(row.user_id)
            const addressInfo = await getAddressById(row.address_id)

            this.tableData.splice(row.index, 1, {...row, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, address: addressInfo.address, user_name: userInfo.username}})
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

<style lang="scss">
  @import '../style/mixin';
    .table_container{
        padding: 20px;
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

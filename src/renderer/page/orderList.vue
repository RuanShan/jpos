<template>
    <div class="order-container fillcontain">
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
          @expand-change='expandChange'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">

              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用户名" >
                  <span>{{ props.row.username }}</span>
                </el-form-item>
                <el-form-item label="店铺名称">
                  <span>{{ props.row.storeName }}</span>
                </el-form-item>
                <div v-for="lineItem in props.row.lineItems" >
                  <el-form-item label="name">
                    <span>{{ lineItem.name }}</span>
                  </el-form-item>
                  <el-form-item label="price">
                    <span>{{ lineItem.price }}</span>
                  </el-form-item>
                </div>
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
                  :current-page.sync="currentPage"
                  :page-size="perPage"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
      </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {getOrderList, getStore, getUserInfo, getOrder} from '@/api/getData'
    import {userDataMixin} from '@/components/userDataMixin'

    export default {
      data () {
        return {
          tableData: [],
          currentRow: null,
          perPage: 2,
          count: 0,
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
      mixins: [userDataMixin],
      created(){
        this.getAdminData().then(res=>{
          if (this.userInfo.id) {
            this.storeId = this.userInfo.store_id
            this.initData()
          }else{
            this.$router.push('/')
          }
        })
      },
      mounted () {

      },
      methods: {
        async initData () {
          this.getOrders()
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
              per_page: this.perPage,
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
          console.log( "total_count", this.count)
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
        async expandChange (row, expandedRows) {
        console.log('expandChange', expandedRows, row)
          if (expandedRows.indexOf(row)>=0) {
            const storeInfo = await getStore(row.store_id)
            const userInfo = await getUserInfo(row.user_id)
            const orderInfo = await getOrder(row.number)
            const lineItems = []
            orderInfo.line_items.forEach((item,index)=>{
              const rowData = {}
              rowData.name = item.variant.name
              rowData.options_text = item.variant.options_text
              rowData.price = item.price
              lineItems.push( rowData )
            })
            console.log("orderInfo.line_items", lineItems)

            this.tableData.splice(row.index, 1, {...row, ...{storeName: storeInfo.name, username: userInfo.username, createdAt: orderInfo.created_at, lineItems: lineItems }})
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
        padding: 20px 0;
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

<template>
    <div class="order-container fillcontain">
      <div class="table_container">
        <!-- filters start -->
        <div class="filters">
            <div class="filter">
                关键字: <el-input label="Keyword" placeholder="请输入订单ID" v-model="filters.keyword"></el-input>
            </div>
            <div class="filter">
                状态: <el-select v-model="filters.shipment_state" placeholder="不限" clearable >
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
          :data="orderList"
          @expand-change='expandChange'
                :expand-row-keys='expendRow'
                :row-key="row => row.id"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用户名" >
                  <span>{{ props.row.userName }}</span>
                </el-form-item>
                <el-form-item label="店铺名称">
                  <span>{{ props.row.storeName }}</span>
                </el-form-item>
                <div v-for="lineItemGroup in props.row.lineItemGroups" >
                  <el-form-item label="物品编码">
                    <span>{{ lineItemGroup.number }}</span>
                  </el-form-item>
                  <el-form-item label="服务">
                    <span>{{ lineItemGroup.name }}</span>
                  </el-form-item>
                </div>
                <div v-for="lineItem in props.row.extraLineItems" >
                  <el-form-item label="商品名称">
                    <span>{{ lineItem.name }}</span>
                  </el-form-item>
                  <el-form-item label="商品价格">
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
            label="店铺"
            prop="storeName">
          </el-table-column>
          <el-table-column
            label="总价格"
            prop="totalAmount">
          </el-table-column>
          <el-table-column
            label="订单状态"
            prop="groupState">
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="displayCreatedAt">
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
    import {findOrders, getOrder} from '@/api/getData'
    import {userDataMixin, orderDataMixin} from '@/components/mixin/commonDataMixin'
    import { apiResultMixin } from '@/components/apiResultMixin'
    export default {
      data () {
        return {
          orderList: [],
          currentRow: null,
          perPage: 12,
          count: 0,
          currentPage: 1,
          expendRow: [],
          filters: { keyword: '', startEndTime: null, shipment_state: 'all', storeId: 0 },
          multipleSelection: [],
        }
      },
      components: {
        headTop
      },
      mixins: [userDataMixin, orderDataMixin, apiResultMixin],
      created(){
        this.getAdminData().then(res=>{
          if (this.userInfo.id) {
            this.storeId = this.userInfo.storeId
            this.initData()
          }else{
            this.$router.push('/login')
          }
        })
      },
      computed: {
        newOrderStateOptions: function(){
          Array.of( ...this.orderStateOptions )
        }
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
          if ( this.filters.storeId>0){
            queryParams["q[store_id_eq]"] = this.filters.storeId

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

          this.orderList = this.buildOrders( ordersResult )
          console.log( "orderList", this.orderList)

        },
        async expandChange (row, expandedRows) {
          console.log('expandChange', row)
          //如果当前行没有订单详细数据，则加载 lineItems
          if (!row.lineItemGroups ) {
            //const userInfo = await getUserInfo(row.user_id)
            const orderResult = await getOrder(row.number)
            const orderDetail = this.buildOrderFromApiResult( orderResult )

            let orderIndex = this.orderList.indexOf(row)
            Object.assign( this.orderList[orderIndex], orderDetail )
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

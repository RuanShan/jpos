<style lang="scss">

  .statis-each-orders {
    .oreder-form-item {
      margin-bottom: 0;
    }
    .order-time-select {
      width: 230px;
    }
    .select-options {
      width: 120px;
    }

    .order-line-three-row {
      position: absolute;
      left: 10px;
      right: 10px;
      top: 100px;
      bottom: 55px;
    }
    .stati-sdata-order {
      display: inline-block;
      position: absolute;
      bottom: 20px;
      border: solid 1px #939393;
      .recordnum {
        color: red;
        display: inline-block;
      }
    }
    .stati-sdata-ordermoney {
      display: inline-block;
      position: absolute;
      bottom: 20px;
      left: 20px;
      line-height: 28px;
      font-size: 14px;
      .recordnum {
        color: red;
        display: inline-block;
      }
    }
    .pagiantion-wrap {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

</style>

<template>

  <div class="statis-each-orders">
    <el-form ref="form" :model="formData" :inline="true">
      <fieldset class="order-field-set filters">
        <legend>查询条件</legend>
        <store-select v-bind:value.sync="formData.storeId" v-if="authorizeMultiStore()" />
        <el-form-item class="oreder-form-item" label="消费日期">
          <el-date-picker class="order-time-select"
                          v-model="formData.selectedDates"
                          type="daterange"
                          align="right"
                          size="mini"
                          unlink-panels
                          range-separator="~"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions2"
                          format="yyyy-MM-dd"
                          :default-time="['00:00:00','23:59:59']"
                          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="支付方式">
          <el-select class="select-options" v-model="formData.paymentMethodId" size="mini" clearable placeholder="不限" @clear="handleClear">
            <el-option v-for="item in paymentMethodOptions" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select class="select-options" v-model="formData.orderState" size="mini" clearable placeholder="不限" @clear="handleClear">
            <el-option v-for="item in stateOptions" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会员电话">
          <el-select v-model="formData.customerKey" size="mini" placeholder="请输入手机号" filterable remote clearable :remote-method="searchCustomers">
            <el-option v-for="item in computedCustomerOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="order-ok" type="primary" size="mini" @click="handleSearch">确定</el-button>
        </el-form-item>
      </fieldset>
    </el-form>
    <!-- 订单统计表   START -->

    <div class="order-line-three-row">
      <el-table class="cel-scrollable-table" border :data="tableData" style="width: 100%">

        <el-table-column label="订单 ID" prop="number">
        </el-table-column>
        <el-table-column label="店铺" prop="storeName">
        </el-table-column>
        <el-table-column label="客户电话">
          <template slot-scope="scope">
              <span>{{ scope.row.customer.mobile}} </span>
              <span v-if="scope.row.customer.storeId!=scope.row.storeId">
                ({{scope.row.customer.storeName}})
              </span>
            </template>
        </el-table-column>
        <el-table-column label="日期" prop="displayCreatedAt">
        </el-table-column>
        <el-table-column label="订单状态" prop="displayState">
          <template slot-scope="scope">
              {{scope.row.displayState}} <span v-show="scope.row.memo">({{scope.row.memo}})</span>
            </template>
        </el-table-column>
        <el-table-column label="支付金额" prop="paymentTotalByMethod">
        </el-table-column>
        <el-table-column label="支付信息">
          <template slot-scope="scope">
              <el-tag v-for="item in scope.row.payments" :key="item.id" size="mini">
                {{ item.description }}
              </el-tag>
          </template>

        </el-table-column>
        <el-table-column label="商品信息"  width="240">
          <template slot-scope="scope">
              <el-tag v-for="item in scope.row.lineItems" :key="item.id" size="mini">
                {{ item.cname }} <template v-if="item.memo.length>0"> -{{ item.memo }} </template>
              </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作员" prop="creatorName" width="110">
        </el-table-column>

      </el-table>
    </div>
    <!-- 订单统计表   END -->

    <!-- 统计数据  START -->

    <div class="stati-sdata-ordermoney">
      <h4 style="display: inline-block;">合计支付金额:</h4>
      <h4 class="recordnum">¥{{paymentTotalSumByMethod}}</h4>
    </div>
    <!-- 统计数据  END -->

    <!-- 分页器 START-->
    <div class="pagiantion-wrap">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="total, prev, pager, next"
                     :total="totalPage">
      </el-pagination>
    </div>
    <!-- 分页器 END-->

    <el-dialog title="订单详情" :visible.sync="dialogVisible" :modal="false" class="cel-scrollable-dialog">
      <OrderDetail :customer-data="customerData" :order-data.sync="currentOrder" :order-position="orderPosition"> </OrderDetail>
    </el-dialog>

  </div>

</template>

<script>
  // 订单统计
  import moment from 'moment'
  import { findOrders, getOrderCount, findCustomers, repayable } from '@/api/getData'

  import StoreSelect from '@/components/common/StoreSelect.vue'
  import OrderDetail from '@/components/common/OrderDetail.vue'

  export default {
    components: {
      StoreSelect,
      OrderDetail
    },
    data() {
      return {
        //*********** 过滤条件 ***************/
        formData: {
          selectedDates: [], // [ "2018-06-04", "2018-06-14" ]
          storeId: null, // 必须为空，否则缺省情况 显示 0
          paymentMethodId: null, //支付方式选项
          orderState: null,
          oddCardPaid: false,
          customerKey: '' // 清除之后为 ''
        },
        loading: false, // 是否正在请求客户信息
        customerList: [],
        paymentMethodList: [],
        totalPage: 0, //分页器显示的总页数
        perPage: 18, //主表每页显示12行
        currentPage: 1, //根据分页器的选择,提交SerVer数据,表示当前是第几页
        pickerOptions2: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = moment().endOf('day')
                const endDate = end.toDate()
                const startDate = end
                  .subtract(6, 'days')
                  .startOf('day')
                  .toDate()
                picker.$emit('pick', [startDate, endDate])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = moment().endOf('day')
                const endDate = end.toDate()
                const startDate = end
                  .subtract(1, 'months')
                  .startOf('day')
                  .toDate()
                picker.$emit('pick', [startDate, endDate])
              }
            }
          ]
        },
        tableData: [],
        //*********** 逻辑需要的变量 ***************/
        returnServerCustomerData: {}, //调用接口,返回的数据
        customerData: {}, //整理過的顧客數據
        totalCount: 0, //统计数据之记录数
        totalSum: 0, //订单金额合计
        paymentTotalSum: 0, //支付金额合计
        paymentTotalSumByMethod: 0, // 某一个支付方式的金额合计，如会员卡，现金
        dialogVisible: false,
        currentOrder: null,
        orderPosition: 0
      }
    },
    mounted() {
      let start = moment().subtract(6, "days").startOf('day')
      let end = moment().endOf('day')
      this.formData.selectedDates = [start.toDate(), end.toDate()]
      this.formData.storeId = this.storeId
      this.initData()
      this.$bus.$on('order-changed-gevent', () => {
        console.log('on order-changed-gevent')
        this.dialogVisible = false  // 用户点击办卡支付，订单改变事件， 关闭订单详情
        this.initData()
      })
    },
    computed: {
      paymentMethodOptions: function() {
        let ps = this.paymentMethodList.map(payment => {
          return { id: payment.id, name: payment.name }
        })
        ps.push({ id: 0, name: '未付' })
        return ps
      },
      stateOptions: function() {
        let ps = [
          { id: this.OrderStateEnum.cart, name: this.getOrderDisplayState(this.OrderStateEnum.cart) },
          { id: this.OrderStateEnum.canceled, name: this.getOrderDisplayState(this.OrderStateEnum.canceled) }
        ]
        return ps
      },
      computedStartAt: function() {
        return this.formData.selectedDates[0]
      },
      computedEndAt: function() {
        return this.formData.selectedDates[1]
      },
      computedCustomerOptions() {
        let ops = this.customerList.map(customer => {
          //用户只有一个可用的充值卡
          if (customer.card) {
            return {
              value: customer.id,
              label: `${customer.userName} ${customer.mobile} (${customer.card.displayStyle} ${customer.card.code})`
            }
          } else {
            return {
              value: customer.id,
              label: customer.mobile
            }
          }
        })
        return ops
      }
    },
    methods: {
      async initData() {
        //this.formData.selectedDates =this.selectedDates
        let params = this.buildParams()
        getOrderCount(params).then(res => {
          this.totalCount = res.total_count
          this.totalSum = parseInt(res.total_sum)
          this.paymentTotalSum = parseInt(res.payment_total_sum)
          this.paymentTotalSumByMethod = parseInt(res.payment_total_sum_by_method)
        })
        this.getPaymentMethods().then(() => {
          this.paymentMethodList = this.paymentMethods.filter(payment => {
            return payment.active
          })
        })
        let result = await findOrders(params)
        this.totalPage = result.total_count
        this.tableData = this.buildOrders(result)
        this.addPaymentDescription()
        console.log('result=', result, 'this.tableData = ', this.tableData)
      },
      buildParams() {
        let params = {
          //查询条件
          page: this.currentPage, //分页器选择的当前页数
          per_page: this.perPage, //每页显示12行数据
          q: {
            created_at_gteq: this.computedStartAt,
            created_at_lteq: this.computedEndAt,
            order_type_eq: 3,
            s:[ 'created_at desc']
          }
        }
        if (this.formData.orderState) {
          params.q.state_eq = this.formData.orderState
        }
        if (parseInt(this.formData.storeId) > 0) {
          params.q.store_id_eq = this.formData.storeId
        }
        //if( this.formData.oddCardPaid ){
        //  params.q.odd_store_id_not_eq = 0
        //}
        if (this.formData.paymentMethodId != null) {
          if (this.formData.paymentMethodId > 0) {
            //选择了一个支付方式
            params.q.payments_payment_method_id_eq = this.formData.paymentMethodId
          } else {
            //所有未交款的
            params.q.payment_state_eq = this.OrderPaymentStateEnum.unpaid
          }
        }
        if (this.formData.customerKey != '') {
          params.q.user_id_eq = this.formData.customerKey
        }
        return params
      },
      //門店選擇改變時的事件處理函數-----
      handleSearch() {
        this.currentPage = 1
        this.initData()
      },
      searchCustomers(keyword) {
        findCustomers({
          q: {
            mobile_or_username_or_cards_code_cont: keyword
          }
        }).then(customersResult => {
          this.customerList = this.buildCustomers(customersResult)
        })
      },
      addPaymentDescription() {
        this.tableData.forEach(order => {
          // 如果选择了一个支付方式过滤条件
          if( this.formData.paymentMethodId != null ){
            order.paymentTotalByMethod = 0
          }else{
            order.paymentTotalByMethod = order.paymentTotal
          }
          order.payments.forEach(payment => {
            //7000五折卡(#0001)支付 ¥500
            //微信 支付 ¥100
            let method = this.paymentMethods.find(item => {
              return item.id == payment.paymentMethodId
            })
            if (payment.paymentMethodId == this.prepaidPaymentMethodId) {
              let card = order.customer.cards.find(card => {
                return card.id == payment.sourceId
              })
              payment.description = card.name + '(' + card.code + ')' + ' 支付 ¥' + payment.amount
            } else {
              payment.description = method.name + ' 支付 ¥' + payment.amount
            }

            // 如果选择了一个支付方式过滤条件，只计算这个支付方式支付的费用
            if( payment.paymentMethodId == this.formData.paymentMethodId){
              order.paymentTotalByMethod +=  payment.amount
            }
          })
        })
      },
      //分页器的改变选择时事件处理函数
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.currentPage = val
        console.log(this.currentPage)
        this.initData()
      },
      handleClear() {
        console.log(' Selected paymentMethodId = ', this.formData.paymentMethodId)
        this.formData.paymentMethodId = null
      },
      handleShowDetail(row) {
        console.log('显示当前订单的详细信息...', row)
        repayable(row.id).then(res => {
          this.customerData = row.customer
          this.currentOrder = row

          if (res.ret == true) {
            this.orderPosition = 1
          } else {
            this.orderPosition = 0
          }
          this.dialogVisible = true
        })
      },
      handleCustomerChanged() {}
    }
  }

</script>

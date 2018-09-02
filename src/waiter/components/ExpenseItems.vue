<template>
<!--
为了便于查看订单状态，这里允许查看搜索任意状态的物品
-->

  <div class="expense-items-container">


    <div class="customer-container clear">

      <div class="search-result clear">
        <el-form ref="expenseItemForm" :rules="rules" :model="newExpenseItem" size="mini"  :inline="true" class="search-form" >
          <table style="width:100%">
            <tr><th>费用类型</th><td>
              <el-select v-model="newExpenseItem.variant_id" placeholder="请选择费用类型" size="mini">
                <el-option  v-for="item in expenseList" :key="item.variant_id"  :label="item.name"  :value="item.variant_id">  </el-option>
              </el-select> </td>
            <th>支出项目</th>
            <td> <el-input v-model="newExpenseItem.cname" placeholder="" size="mini"></el-input> </td>
            <th>支出金额</th><td><el-input v-model="newExpenseItem.price" placeholder="" size="mini"></el-input></td>
            </tr>
            <tr ><th>发生时间</th><td> <el-date-picker  type="date" placeholder="选择日期" v-model="newExpenseItem.day" style="width: 100%;" size="mini"></el-date-picker></td>
              <th>备注</th>
              <td colspan="4"> <el-input v-model="newExpenseItem.memo" placeholder="" size="mini"></el-input> </td>
            </tr>
          </table>

          <el-form-item  >
            <el-button type="primary" @click="submitForm('expenseItemForm')" size="mini">立即创建</el-button>
            <el-button @click="resetForm('expenseItemForm')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="expenseItemList" border stripe style="width:100%;" class="order-item-list">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="displayCreatedAt" label="日期" width="120"></el-table-column>
      <el-table-column prop="cname" label="支付项目"></el-table-column>
      <el-table-column prop="price" label="金额" width="120"></el-table-column>
      <el-table-column prop="userName" label="创建人员"  width="120"></el-table-column>
      <el-table-column prop="memo" label="备注"></el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-minus" circle @click="discardLineItemGroup(scope.row)" size="mini"></el-button>
       </template>
      </el-table-column>
    </el-table>
    <div class="order-final">
      <div class="order-sum">
        <i>数量：</i>
        <span>{{totalCount}}</span>&nbsp;&nbsp;&nbsp;
        <i>金额：</i>
        <span>{{totalMoney}}</span>&nbsp;
        <i>元</i>
      </div>

    </div>

  </div>
</template>


<script>
import _ from "lodash"
import moment from "moment"
import {
  findExpenseItems, addExpenseItem, deleteExpenseItem, getExpenses
} from "@/api/getData"
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'


export default {
  mixins: [DialogMixin],

  data() {
    return {
      defaultExpenseItem: {
        day:  moment().format('YYYY-MM-DD')
      },
      expenseItemList: [],    //按关键字搜索到订单列表
      expenseList:[],
      newExpenseItem: {},
      rules: {
        cname: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
          ],
          variant_id: [
            { required: true, message: '请选择费用类型', trigger: 'change' }
          ],
          day: [
            { type: 'date', required: true, message: '请费用发生日期', trigger: 'change' }
          ],
      }
    }
  },
  created: function(){
    this.newExpenseItem = this.defaultExpenseItem
    this.initData()
  },
  computed:{

    computedOrderOptions: function() {
      console.log("orderList", this.orderList)
      let ops = this.orderList.map((order) => {
        return order.lineItemGroups.map((group)=>{
          return {
            value: [order.id, group.id ].join('_') ,
            label: order.number + '(#'+ group.number +')'
          }
        })
      })
      return _.flatten( ops )
    },

    //物品数量
    totalCount: function(){
      return this.expenseItemList.length
    },
    //物品价格
    totalMoney: function(){
      let t = this.expenseItemList.reduce((total, item)=>{
        return total += item.price
      }, 0)
      return Number(t).toFixed(2)
    }

  },
  methods:{
    buildPrams(){
      return {
        entry_day_eq: moment().format('YYYY-MM-DD'),
        store_id: this.storeId
      }
    },
    async initData(){
      let result = await getExpenses()
      this.expenseList = result.expenses;
      let params = this.buildPrams()
      result = await findExpenseItems( {q: params} )
      this.count = result.total_count
      this.expenseItemList = this.buildExpenseItems(result)
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let attrs = Object.assign( { "user_id": this.userInfo.id, "store_id": this.storeId}, this.newExpenseItem)


          addExpenseItem({ expense_item: attrs }).then((result)=>{
            if( result.id ){
              this.initData()
              this.$message({
                message: '费用支出添加成功！',
                type: 'success'
              });
            }
          })
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleDeliverOrders(){
      if( this.isDeliverable){
        //检查每件物品对应的Order用户是否付款， 如果没有，弹出结账对话框,
        if( this.checkoutTotal > 0){
          this.checkoutDialogVisible = true
        }else{
          //检查所有物品是否为待交付状态，如果是，弹出确认框
          //$confirm(message, title, options)
          this.$confirm("确定交付客户以上物品吗？").then(()=>{
            this.completeOrders()
          })
        }
      }else{
        this.$message({
          message: '抱歉，物品还有没全部处理好，暂时无法交付客户！',
          type: 'error'
        });
      }
    },
    completeOrders(){

    },
  }
}
</script>

<style lang="scss">
.expense-items-container{
  .order-sum{
    line-height: 30px;
  }
  .font-color{
    color: white;
  }
}
</style>

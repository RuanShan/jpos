<style lang="scss">
.expense-items-container{
  .order-sum{
    line-height: 30px;
  }
  .font-color{
    color: white;
  }
  .actions{
    padding: 4px 0;
  }
  .customer-container{
    /*height: 128px;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    */
    background-color: #fff;
    padding: 5px;
    .search-form{
      .el-form-item.el-form-item--mini{
        margin: 0;
      }
      .el-form-item__content{
        width: 100%;
      }
      table td,table th{
        padding: 6px 6px;
      }

      &.expense-form{
        th{ width: 6em;}
        td{ width: auto;}
      }
    }
  }

}
</style>

<template>
  <div class="expense-items-container">
    <div class="customer-container clear">
      <div class="search-result clear">
        <el-form ref="newExpenseItem" :rules="rules" :model="newExpenseItem" size="mini"  :inline="true" class="search-form expense-form" >
          <table style="width:100%">
            <tr><th>费用类型</th><td>
              <el-form-item prop="expense_category_id">
              <el-select v-model="newExpenseItem.expense_category_id" placeholder="请选择费用类型" size="mini" >
                <el-option  v-for="item in expenseCategories" :key="item.id"  :label="item.name"  :value="item.id">  </el-option>
              </el-select> </el-form-item></td>
            <th>支出项目</th>
            <td>  <el-form-item prop="cname" style="width: 100%;"> <el-input v-model="newExpenseItem.cname" placeholder="" size="mini" style="width: 100%;"></el-input></el-form-item> </td>

            </tr>
            <tr ><th>发生时间</th><td><el-form-item prop="day"><el-date-picker  type="date" placeholder="选择日期" v-model="newExpenseItem.day" style="width: 100%;" size="mini"></el-date-picker></el-form-item></td>
                 <th>支出金额</th><td><el-form-item prop="price" style="width: 100%;" ><el-input v-model="newExpenseItem.price" placeholder="" size="mini"></el-input></el-form-item></td>
            </tr>
          </table>

          <el-form-item class=" actions" >
            <el-button  @click="submitForm('newExpenseItem')" size="mini">立即创建</el-button>
           </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="order-item-list"  style="top:150px;">
      <el-table :data="expenseItemList" border stripe style="width:100%;" class="fillcontain" highlight-current-row  @current-change="handleCurrentGroupChange">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="displayCreatedAt" label="日期" width="120"></el-table-column>
        <el-table-column prop="cname" label="支付项目"></el-table-column>
        <el-table-column prop="price" label="金额(元)" width="120"></el-table-column>
        <el-table-column prop="userName" label="创建人员"  width="120"></el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDeleteExpenseItem(scope.row)" size="mini"></el-button>
         </template>
        </el-table-column>
      </el-table>
    </div>
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
  findExpenseItems, addExpenseItem, deleteExpenseItem, getExpenses, getExpenseItem //
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
      expenseCategories:[],
      newExpenseItem: {},
      rules: {
        cname: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
          ],
        expense_category_id: [
            { required: true, message: '请选择费用类型', trigger: 'change' }
          ],
        price: [
            { required: true, message: '请输入金额', trigger: 'change' }
          ],
        day: [
            {  required: true, message: '请选择费用发生日期', trigger: 'change' }
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
        store_id_eq: this.storeId
      }
    },
    async initData(){
      let result = await getExpenses()
      this.expenseCategories = result.expense_categories;
      let params = this.buildPrams()
      result = await findExpenseItems( {q: params} )
      this.count = result.total_count
      this.expenseItemList = this.buildExpenseItems(result)
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
console.log( "valid= ", valid, "formName", formName)
        if (valid) {
          let attrs = Object.assign( { "user_id": this.userInfo.id, "store_id": this.storeId}, this.newExpenseItem)

          addExpenseItem({ expense_item: attrs }).then((result)=>{
            if( result.id ){
              this.initData()
              this.$message({
                message: '费用支出添加成功！',
                type: 'success'
              });
              this.resetForm(formName)
            }
          })
         } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleDeleteExpenseItem( row ){
      console.log( 'handleDeleteExpenseItem', row)
      this.$confirm('此操作将永久删除该费用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteExpenseItem( row.id ).then( ()=>{
            this.expenseItemList = this.expenseItemList.filter(function (item) {
              return item.id != row.id
            })
            this.$message({
              message: '费用支出删除成功！',
              type: 'success'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

    },
    async handleCurrentGroupChange(row){
      if( row ){
        const result = await getExpenseItem(row.id)
        row.detail = this.buildExpenseItem(result)
        this.currentRow = row
        console.log( "currentRow", this.currentRow)
        this.$emit('current-item-changed', row.detail)
      }
    }
  }
}
</script>

<style lang="scss">
.stock-movements-container{
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
  <div class="stock-movements-container">
    <div class="customer-container clear">
      <div class="search-result clear">
        <el-form ref="newStockMovement" :rules="rules" :model="newStockMovement" size="mini"  :inline="true" class="search-form expense-form" >
          <table style="width:100%">
            <tr><th> 库存商品 </th><td>
              <el-form-item prop="stock_item_id">
              <el-select v-model="newStockMovement.stock_item_id" placeholder="请选择商品" size="mini" >
                <el-option  v-for="item in stockItems" :key="item.id"  :label="item.variantName"  :value="item.id">  </el-option>
              </el-select> </el-form-item></td>
              <th>数量</th><td><el-form-item prop="quantity" style="width: 100%;" ><el-input v-model="newStockMovement.quantity" placeholder="" size="mini"></el-input></el-form-item></td>
            </tr>
            <tr ><th>发生时间</th><td><el-form-item prop="day"><el-date-picker  type="date" placeholder="选择日期" v-model="newStockMovement.day" style="width: 100%;" size="mini"></el-date-picker></el-form-item></td>
              <th>备注</th> <td>  <el-form-item prop="memo" style="width: 100%;"> <el-input v-model="newStockMovement.memo" placeholder="" size="mini" style="width: 100%;"></el-input></el-form-item> </td>
            </tr>
          </table>

          <el-form-item class=" actions" >
            <el-button  @click="submitForm('newStockMovement')" size="mini">立即创建</el-button>
           </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="order-item-list"  style="top:150px;bottom:10px;">
      <el-table :data="stockMovments" border stripe style="width:100%;" class="fillcontain">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="day" label="发生时间" width="120"></el-table-column>
        <el-table-column prop="variantName" label="商品" width="120"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="120"></el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
        <el-table-column prop="createdByName" label="创建人员"  width="120"></el-table-column>
      </el-table>
    </div>

  </div>
</template>


<script>
import moment from "moment"
import {
  findStockMovements, addStockMovement, findStockItems //
} from "@/api/getData"
import {
  DialogMixin
} from '@/components/mixin/DialogMixin'


export default {
  mixins: [DialogMixin],

  data() {
    return {
      defaultStockMovement: {
        day:  moment().format('YYYY-MM-DD')
      },
      stockMovments: [],    //按关键字搜索到订单列表
      stockItems:[],
      newStockMovement: {},
      rules: {
        memo: [
            { required: false, message: '请输入备注', trigger: 'blur' },
            { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
          ],
        stock_item_id: [
            { required: true, message: '请选择商品类型', trigger: 'change' }
          ],
        quantity: [
            { required: true, message: '请输入金额', trigger: 'change' }
          ],
        day: [
            {  required: true, message: '请选择商品发生日期', trigger: 'change' }
          ],
      }
    }
  },
  created: function(){
    this.newStockMovement = this.defaultStockMovement
    this.initData()
  },
  computed:{

    //物品数量
    totalCount: function(){
      return this.stockMovments.length
    },
    //物品价格
    totalMoney: function(){
      let t = this.stockMovments.reduce((total, item)=>{
        return total += item.quantity
      }, 0)
      return Number(t).toFixed(2)
    }

  },
  methods:{
    buildPrams(){
      return {
        day_eq: moment().format('YYYY-MM-DD')
      }
    },
    async initData(){
      console.log( 'stock_location_id: ', this.storeInfo)
      let queryParams = {
        stock_location_id: this.storeInfo.stockLocationId,
        q: { variant_track_inventory_eq: 1  }
      }
      let result = await findStockItems( queryParams )
      this.stockItems = this.buildStockItems( result )
      let params = this.buildPrams()
      //params.stock_item_id_in = this.stockItems.map((item)=>{ return item.id })
      result = await findStockMovements( { stock_location_id: this.storeInfo.stockLocationId, q: params} )
      this.count = result.total_count
      this.stockMovments = this.buildStockMovements(result)
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
console.log( "valid= ", valid, "formName", formName)
        if (valid) {
          let attrs = Object.assign( { "created_by_id": this.userInfo.id }, this.newStockMovement)

          addStockMovement({ stock_location_id: this.storeInfo.stockLocationId, stock_movement: attrs }).then((result)=>{
            if( result.id ){
              this.initData()
              this.$message({
                message: '商品支出添加成功！',
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

    handleDeleteStockMovement( row ){
      console.log( 'handleDeleteStockMovement', row)


    },
  }
}
</script>

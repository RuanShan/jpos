<style lang="scss">
.card-form {

}
</style>
<template>
  <!-- 会员基本信息 START-->
  <div class="card-form" v-if="customerData">
    <el-dialog  title="提示"  :visible="computedVisible"  :show-close="false" width="600px"  @open="handleOpen">
      <div slot="title" class="title-wrap">
        <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
        <div>会员卡信息</div>
      </div>

      <el-form :model="cardFormData" :rules="rules" ref="cardForm" status-icon label-width="100px" class="new-member-form">
            <el-form-item label="会员卡号" prop="code"  required>
              <el-input v-model="cardFormData.code" ></el-input>
            </el-form-item>
            <el-form-item label="会员卡类型" prop="variantId"  required>
              <el-select v-model="cardFormData.variantId" placeholder="请选择会员卡类型" >
                <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到期时间">
              <el-form-item prop="expireAt">
                <el-date-picker type="date" placeholder="选择日期" v-model="cardFormData.expireAt" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;" :pickerOptions="pickerOptions"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="会员密码" prop="paymentPassword">
              <el-input v-model="cardFormData.paymentPassword"></el-input>
            </el-form-item>
            <el-form-item label="付款方式" prop="paymentMethodId" required>
              <el-select v-model="cardFormData.paymentMethodId" placeholder="请选择支付方式" >
                <el-option v-for="item in activePaymentMethods" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="充值金额"  required>
              <el-input v-model="cardFormData.paymentAmount"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="address">
              <el-input v-model="cardFormData.cardMemo"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="fillIn()" type="danger">测试填入</el-button>
      </div>
    </el-dialog >
  </div>
  <!-- 会员基本信息 END-->
</template>

<script>
import moment from 'moment'
import {
  DialogMixin
} from "@/components/mixin/DialogMixin"
import {
  apiResultMixin
} from '@/components/apiResultMixin'
import { checkout } from "@/api/getData";

export default {
  props: ["customerData", "dialogVisible"],
  mixins: [DialogMixin, apiResultMixin],
  data() {
    return {
      paymentMethodList: [      ],
      cardTypeList: [],
      cardFormData: {
        code: "",
        paymentAmount: null,
        expireAt: "",
        paymentMethodId: null,
        variantId: null,
        memo: ""
      },
      rules: {

      },
      pickerOptions: {
         shortcuts: [{
           text: '一年',
           onClick(picker) {
             picker.$emit('pick', moment().add(1, 'years').toDate());
           }
         }, {
           text: '不限',
           onClick(picker) {
             picker.$emit('pick', null);
           }
         }]
       },
    }
  },
  computed: {
    activePaymentMethods: function(){
      return this.paymentMethodList.filter((pm)=>{
        return pm.posable
      })
    }
  },
  methods:{
    async handleOpen(){
      console.log( "CardForm..handleOpen")
      this.paymentMethodList = await this.getPaymentMethods()

      if( this.activePaymentMethods.length > 0){
        this.cardFormData.paymentMethodId = this.activePaymentMethods[0].id
      }
      this.cardTypeList = await this.getCardTypes()

      if( this.cardTypeList.length > 0){
        this.cardFormData.variantId = this.cardTypeList[0].id
      }

    },
    handleClose(){
      this.resetForm()
      this.handleCloseDialog()
    },
    submitForm() {
      this.$refs['cardForm'].validate((valid) => {
        if (valid) {
          let orderParams = {
            user_id: this.customerData.id,
            order_type: 'card',
            line_items: [
              { variant_id: this.cardFormData.variantId, price: this.cardFormData.paymentAmount, quantity: 1, card_code: this.cardFormData.code  }
            ],
            payments: [{
                payment_method_id:  this.cardFormData.paymentMethodId,
                amount: this.cardFormData.paymentAmount
              }]
          }
          checkout( {order: orderParams} ).then((result)=>{
            if( result.id ){
              let order = this.buildOrder( result )
              this.$emit( 'card-created-event', order.customer )
              this.$message( {
                message: '恭喜你，会员卡创建成功',
                type: 'success'
              });
              this.handleClose()
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['cardForm'].resetFields();
    },
    fillIn() {
      this.cardFormData.code = ((Math.random() + 1)*1000).toFixed()
      this.cardFormData.paymentAmount = 250
      this.cardFormData.paymentPassword = "123456"
    }
  }
}
</script>

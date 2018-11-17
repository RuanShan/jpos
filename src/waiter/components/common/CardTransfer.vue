<style lang="scss">
.card-transfer {
  .el-table {
    margin-bottom: 20px;
    th{
        width: 8em;
        text-align: right;
        padding: 12px 6px;
    }
    td{
        padding: 12px 6px;
        text-align: center;
        word-break: keep-all;
        white-space: nowrap;
    }
  }
}
</style>
<template>
  <!-- 会员基本信息 START-->
  <div class="card-transfer" v-if="customerData">
    <el-dialog  :visible="computedVisible"  :show-close="false" class="cel-dialog"  @open="handleOpen">
      <div slot="title" class="title-wrap">
        <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
        <div>会员卡转卡</div>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
        <table>
          <tr> <th>旧会员卡号 </th> <td>{{cardData.code}} </td> <th>开卡门店 </th><td>{{cardData.storeName}} </td>
          </tr>
          <tr>
            <th>会员卡类型</th><td> {{cardData.displayStyle}}</td> <th>会员卡级别</th><td>{{cardData.name}} </td>
          </tr>
          <tr>
            <th>开卡日期</th><td>{{cardData.displayCreatedAt}} </td> <th>到期日期</th><td> {{cardData.displayExpireAt}}</td>
          </tr>
        </table>
      </div>

      <el-form :model="cardFormData" :rules="rules" ref="cardForm" status-icon label-width="100px" class="new-member-form">

            <el-form-item label="新会员卡号" prop="code"  required>
              <el-input v-model="cardFormData.code" ></el-input>
            </el-form-item>
            <el-form-item  >
              <div class="right">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
              </div>
            </el-form-item>
      </el-form>
    </el-dialog >
  </div>
  <!-- 会员基本信息 END-->
</template>

<script>
import moment from 'moment'
import {
  DialogMixin
} from "@/components/mixin/DialogMixin"

import { replaceCard } from "@/api/getData";

export default {
  props: ["customerData","cardData", "dialogVisible"],
  mixins: [DialogMixin],
  data() {
    return {
      paymentMethodList: [      ],
      cardTypeList: [],
      cardFormData: {
        code: "",
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

    },
    handleClose(){
      this.resetForm()
      this.handleCloseDialog()
    },
    submitForm() {
      this.$refs['cardForm'].validate((valid) => {
        if (valid) {
          let params = {
            target_code: this.cardFormData.code
          }
          replaceCard( this.cardData.id, params ).then((result)=>{

            if( result.cards ){
              // 返回2个card, 第1个是旧卡信息，第2个是新卡信息
              let cards = result.cards.map((model)=>{
                return this.buildCard( model )
              })

              console.log( " replaceCard =", cards )
              this.$emit('card-changed-event', card[0])
              this.$emit('card-changed-event', card[1])
              this.$message({
                message: '恭喜你，会员卡更新成功',
                type: 'success'
              })

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
     }
  }
}
</script>

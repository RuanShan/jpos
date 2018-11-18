<style lang="scss">
.card-form {
  .dialog-body-inner{ width: 90%; margin: auto;}

}

</style>
<template>
  <!-- 会员卡编辑 START-->
  <div class="card-form">
    <el-dialog class="cel-dialog"   :visible="computedVisible" :show-close="false"   @open="handleOpen" @close="handleCloseDialog">

      <div slot="title" class="dialog-title-wrap">
        <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog"></i> </div>
        <div> 会员卡信息 </div>
      </div>
      <div class="dialog-body-inner">
        <el-form :model="formData" ref="cardForm" status-icon label-width="100px" class="new-member-form">
          <el-form-item label="会员卡号" prop="code"  >
            <el-input v-model="formData.code" disabled ></el-input>
          </el-form-item>
          <el-form-item label="会员卡类型" prop="variantId"  >
            <el-input v-model="formData.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-radio-group v-model="formData.state">
              <el-radio label="enabled">可用</el-radio>
              <el-radio label="disabled">禁用</el-radio>
            </el-radio-group>

          </el-form-item>
          <el-form-item label="到期时间">
            <el-form-item prop="expireAt">
              <el-date-picker type="date" placeholder="选择日期" v-model="formData.expireAt" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="会员密码" prop="paymentPassword">
            <el-input v-model="formData.paymentPassword" placeholder="如果不想修改保持为空" >
              <el-button slot="append" icon="el-icon-mobile-phone">发送密码找回短信</el-button>
            </el-input>
          </el-form-item>

          <el-form-item label="备注" prop="address">
            <el-input type="textarea" v-model="formData.memo"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="right">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="handleClose">取 消</el-button>
            </div>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
  </div>
  <!-- 会员基本信息 END-->
</template>

<script>
import { DialogMixin } from "@/components/mixin/DialogMixin"
import { updateCard } from "@/api/getData";

export default {
  props: ['dialogVisible','customerData','cardData'],
  mixins: [DialogMixin],
  data() {
    return {
      paymentMethodList: [],
      cardTypeList: [],
      formData: {}
    }
  },
  computed: {
    activePaymentMethods: function () {
      return this.paymentMethodList.filter((pm) => {
        return pm.posable
      })
    }
  },
  methods: {
    handleOpen() {
      console.log("CardForm..handleOpen", this.cardData)
      this.formData = Object.assign({}, this.cardData, { payment_password: '' } )
    },
    handleClose() {
      this.resetForm()
      this.handleCloseDialog();
    },
    submitForm() {
      this.$refs['cardForm'].validate((valid) => {
        if (valid) {
          let params = {
            card: { state: this.formData.state,  memo: this.formData.memo, expire_at: this.formData.expireAt  }
          }
          //如果payment_password存在，则更新payment_password
          if( this.formData.payment_password.length>0){
            params.card.payment_password = this.formData.payment_password
          }
          updateCard( this.cardData.id, params ).then((result) => {
            if (result.id) {
              let card = this.buildCard(result)
              console.log( " updateCard =", card, "params=",params )
              this.$emit('card-changed-event', card)
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
    }

  }
}
</script>

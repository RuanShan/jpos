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
            <el-input type="password" v-model="formData.paymentPassword" placeholder="如果不想修改保持为空" >
              <el-button slot="append" icon="el-icon-mobile-phone"  @click="sendPassword">{{passwordSms.text}}</el-button>
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
import { sendPasswordSms, updateCard } from "@/api/getData";

export default {
  props: ['dialogVisible','customerData','cardData'],
  mixins: [DialogMixin],
  data() {
    return {
      paymentMethodList: [],
      cardTypeList: [],
      formData: {
        paymentPassword: null
      },
      passwordSms:{
        countdown: 60,
        text: '发送密码找回短信',
        disabled: false
      }

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
      this.formData = Object.assign({}, this.cardData, { paymentPassword: '' } )
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
          //如果paymentPassword存在，则更新paymentPassword
          if( this.formData.paymentPassword && this.formData.paymentPassword.length>0){
            params.card.payment_password = this.formData.paymentPassword
          }
          updateCard( this.cardData.id, params ).then((result) => {
            if (result.id) {
              let card = this.buildCard(result)
              console.log( " updateCard =", card, "params=",params)
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
    sendPassword(){
      console.log( "sendPassword clicked")
      // disable click first
      this.passwordSms.disabled = true

      sendPasswordSms(this.cardData.id).then((response) => {
        console.log('收到的response = ', response)
        if (response.ret) {
          let timer = setInterval(() => {
            this.passwordSms.disabled = true
            this.passwordSms.countdown--
            this.passwordSms.text = `${this.passwordSms.countdown}秒后可以重发`
            if (this.passwordSms.countdown == 0) {
              this.passwordSms.disabled = false // 免费获取验证码按钮打开
              this.passwordSms.text = '发送密码找回短信'
              this.passwordSms.countdown = 60
              clearInterval(timer)
            }
          }, 1000)
        }else{
          this.$message({
            message: '短信发送失败,请联系管理员处理!',
            type: 'erorr'
          })
        }
      })
    },
    resetForm() {
      this.$refs['cardForm'].resetFields();
    }

  }
}
</script>

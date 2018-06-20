<style lang="scss">
.card-form {
}
.card-edit-window {
  margin-top: -70px;
  .el-dialog__body {
    padding: 20px 20px 6px 20px;
    border-top: solid 1px #7c7f81;
    margin-top: 11px;
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: solid 1px #7c7f81;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
  .member-edit-form {
    padding: 10px 10px;
    padding-bottom: 0;
    .el-card__body {
      padding-bottom: 0;
    }
  }
}
</style>
<template>
  <!-- 会员卡编辑 START-->
  <div class="card-form">
    <el-dialog class="card-edit-window" title="提示" :visible="computedVisible" :show-close="true" width="600px" @open="handleOpen" @close="handleCloseDialog">
      <div slot="title" class="title-wrap">
        <!-- <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div> -->
        <div>会员卡信息</div>
      </div>

      <el-form :model="cardFormData" ref="cardForm" status-icon label-width="100px" class="new-member-form">
        <el-form-item label="会员卡号" prop="code" required>
          <el-input v-model="cardFormData.code"></el-input>
        </el-form-item>
        <el-form-item label="会员卡类型" prop="variantId" required>
          <el-select v-model="cardFormData.variantId" placeholder="请选择会员卡类型">
            <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-form-item prop="expireAt">
            <el-date-picker type="date" placeholder="选择日期" v-model="cardFormData.expireAt" format="yyyy 年 MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="会员密码" prop="paymentPassword">
          <el-input v-model="cardFormData.paymentPassword"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="address">
          <el-input type="textarea" v-model="cardFormData.cardMemo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- 会员基本信息 END-->
</template>

<script>
import { DialogMixin } from "@/components/mixin/DialogMixin"
import { apiResultMixin } from '@/components/apiResultMixin'
import { checkout } from "@/api/getData";

export default {
  props: ['dialogVisible','customerData'],
  mixins: [DialogMixin, apiResultMixin],
  data() {
    return {
      displayMemberCardEditOnOff: "",// 本窗口显示标志位,没有初始值
      paymentMethodList: [],
      cardTypeList: [],
      cardFormData: {
        code: "",
        paymentAmount: null,
        expireAt: "",
        paymentMethodId: null,
        variantId: null,
        memo: ""
      },
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
    async handleOpen() {
      this.displayMemberCardEditOnOff = true;
      console.log("CardForm..handleOpen")
      this.paymentMethodList = await this.getPaymentMethods()

      if (this.activePaymentMethods.length > 0) {
        this.cardFormData.paymentMethodId = this.activePaymentMethods[0].id
      }
      this.cardTypeList = await this.getCardTypes()

      if (this.cardTypeList.length > 0) {
        this.cardFormData.variantId = this.cardTypeList[0].id
      }
    },
    handleClose() {
      this.resetForm()
      this.handleCloseDialog();
      // this.closeTheWindows();
    },
    submitForm() {
      this.$refs['cardForm'].validate((valid) => {
        if (valid) {
          let orderParams = {
            user_id: this.customerData.id,
            line_items: [
              { variant_id: this.cardFormData.variantId, price: this.cardFormData.paymentAmount, quantity: 1 }
            ],
            payments: [{
              payment_method_id: this.cardFormData.paymentMethodId,
              amount: this.cardFormData.paymentAmount
            }]
          }
          checkout({ order: orderParams }).then((result) => {
            if (result.id) {
              let order = this.buildOrder(result)
              this.$emit('card-created-event', order.customer)
              this.$message({
                message: '恭喜你，会员卡创建成功',
                type: 'success'
              });
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
  
    //关闭窗口时事件处理函数-----
    closeTheWindows() {
      // console.log("为什么不关闭呢?");
      this.displayMemberCardEditOnOff = false;
      this.$emit("memberCardEditOnOff", false); //传给父组件自己被关闭的消息
    }
  }
}
</script>

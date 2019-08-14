<style lang="scss" >

  .card-recharge {
    .bg-purple {
      background: #d3dce6;
    }
    .bg-purple-light {
      background: #e5e9f2;
    }
  }

</style>

<template>

  <div class="">
    <el-dialog :visible.sync="computedVisible"
               center
               :close-on-click-modal="false"
               :append-to-body="true"
               :show-close="false"
               @open="openWindow"
               @close="handleCloseDialog"
               class="cel-dialog">
      <div slot="title" class="dialog-title-wrap">
        <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog"></i> </div>
        <div> 会员卡充值 </div>
      </div>
      <el-row class="card-recharge ">

        <el-col :span="22" :offset="1">
          <div>
            <fieldset style="margin-top:10px">
              <legend>会员信息</legend>
              <div class="el-table cel-table">
                <table class="currenttable">
                  <tr>
                    <th style="width: 20%;">会员卡号</th>
                    <td style="width: 30%">{{cardData.code}}</td>
                    <th style="width: 20%;">卡内余额</th>
                    <td style="width: 30%;color:#F56C6C;font-weight:bold;">{{cardData.amountRemaining}}</td>
                  </tr>
                  <tr>
                    <th>会员卡类型</th>
                    <td>{{cardData.displayStyle}}</td>
                    <th>会员卡级别</th>
                    <td>{{cardData.name}}</td>
                  </tr>
                  <tr>
                    <th>会员姓名</th>
                    <td>{{customerData.name}}</td>
                    <th>会员电话</th>
                    <td>{{customerData.mobile}}</td>
                  </tr>
                </table>
              </div>
            </fieldset>
            <!-- 付款方式     START -->
            <el-form :model="formData" :rules="rules" ref="formData" status-icon label-width="100px" style="margin-top:20px;">
              <el-form-item label="会员卡类型" prop="variantId" required>
                <el-select v-model="formData.variantId" placeholder="" @change="handleCardChanged">
                  <el-option v-for="item in cardTypeList" :key="item.masterId" :label="item.name" :value="item.masterId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款方式" prop="paymentMethodLabel">
                <el-radio-group v-model="formData.paymentMethodLabel" @change="changeRechargeWay">
                  <el-radio-button v-for="item in activePaymentMethods" :key="item.id" :label="item.name"> </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <!-- 付款方式     END -->
              <!-- 充值金额     START -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="充值金额" prop="amount">
                    <el-input v-model="formData.amount">
                      <template slot="append">元 </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="充值后余额" prop="amount">
                    <el-input v-model="computedNewAmount" :disabled="true">
                      <template slot="append">元 </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 充值金额     END -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="付款金额" prop="money">
                    <el-input v-model="formData.money">
                      <template slot="append">元 </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 备注     START -->
              <el-form-item label="备注" prop="inputMemo">
                <el-input v-model="formData.inputMemo" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>

              <!-- 备注     END -->
              <el-form-item label="">
                <div class="left">
                  <el-checkbox label="公众号消息推送" v-model="formData.enableMpMsg"></el-checkbox>
                </div>
                <div class="right">
                  <el-button type="primary" @click="handleCheckout">确定</el-button>
                  <el-button @click="handleCloseDialog">取消</el-button>
                </div>
              </el-form-item>

            </el-form>

          </div>
        </el-col>

      </el-row>

    </el-dialog>
  </div>

</template>


<script>

  import { checkout } from '@/api/getData'
  import { DialogMixin } from '@/components/mixin/DialogMixin'

  export default {
    props: ['dialogVisible', 'cardData', 'customerData'],
    mixins: [DialogMixin],
    data() {
      return {
        paymentMethodList: [],
        cardTypeList: [],
        formData: {
          variantId: null,
          paymentMethodLabel: null, //支付方式
          paymentMethodId: null, //支付方式单选按钮默认选择,会根据用户选择动态变化
          amount: null, //输入充值金额
          money: null, //付款金额
          inputMemo: '', //备注输入框
          enableMpMsg: true //
        },
        rules: {},
        checkedPrint: true //是否打印标志位
      }
    },
    computed: {
      computedNewAmount: function() {
        if (this.formData.amount) {
          return parseInt(this.cardData.amountRemaining) + parseInt(this.formData.amount)
        } else {
          return null
        }
      },
      activePaymentMethods: function() {
        return this.paymentMethodList.filter(pm => {
          return pm.posable
        })
      }
    },

    methods: {
      //打开窗口时事件处理函数-----
      async openWindow() {
        this.formData.variantId = this.cardData.variantId
        this.getPaymentMethods().then(() => {
          this.paymentMethodList = this.paymentMethods
          if (this.activePaymentMethods.length > 0) {
            this.formData.paymentMethodId = this.activePaymentMethods[0].id
            this.formData.paymentMethodLabel = this.activePaymentMethods[0].name
            console.log('this.formData.paymentMethodId=', this.formData.paymentMethodId)
          }
        })
        this.cardTypeList = await this.getCardTypes()
      },
      //改变打印选择状态时触发函数-----
      changePrint() {
        console.log(this.checkedPrint)
      },
      //改变支付方式触发函数-----
      changeRechargeWay(val) {
        this.activePaymentMethods.forEach(method => {
          if (method.name == val) {
            this.formData.paymentMethodId = method.id
          }
        })
        console.log(this.formData.paymentMethodId)
      },
      //改变选择的充值卡类型
      handleCardChanged(val){
        let card = this.cardTypeList.find((o)=>o.masterId == val)
        console.log( " handle card changed .", val, card )
        this.formData.amount = card.price
        this.formData.money = card.price
      },
      async handleCheckout() {
        const orderParams = {
          store_id: this.storeId,
          user_id: this.customerData.id,
          order_type: this.OrderTypeEnum.deposit,
          enable_mp_msg: this.formData.enableMpMsg,
          line_items: [
            {
              variant_id: this.formData.variantId,
              quantity: 1,
              card_id: this.cardData.id,
              card_amount: this.formData.amount,
              price: this.formData.money,
              cname: '会员卡充值'
            }
          ],
          payments_attributes: [
            {
              payment_method_id: this.formData.paymentMethodId,
              amount: this.formData.money
            }
          ]
        }
        let result = await checkout({ order: orderParams })
        console.log('memberchard recharge checkout result=', result)
        if (result.id) {
          let order = this.buildOrder(result)
          let card = order.customer.cards.find(item => {
            return item.id == this.cardData.id
          })
          this.$emit('deposit-order-created-event', card)
          this.handleCloseDialog()
          this.$message({
            type: 'success',
            message: '恭喜你，会员卡充值成功！'
          })
        }
      }
    }
  }

</script>

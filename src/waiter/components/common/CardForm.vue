<style lang="scss">

  .card-form {
  }

</style>
<template>

  <!-- 会员基本信息 START-->
  <div class="card-form" v-if="customerData">
    <el-dialog :visible="computedVisible" :show-close="false" class="cel-dialog" @open="handleOpen">
      <div slot="title" class="title-wrap">
        <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog()"></i> </div>
        <div>会员卡信息</div>
      </div>

      <el-form :model="cardFormData" :rules="rules" ref="cardForm" status-icon label-width="100px" class="new-member-form">
        <el-form-item label="会员卡号" prop="code" required>
          <el-input v-model="cardFormData.code"></el-input>
        </el-form-item>
        <el-form-item label="会员卡类型" prop="variantId" required>
          <el-select v-model="cardFormData.variantId" placeholder="请选择会员卡类型"  @change="handleCardChanged">
            <el-option v-for="item in cardTypeList" :key="item.masterId" :label="item.name" :value="item.masterId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-form-item prop="expireAt">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="cardFormData.expireAt"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            style="width: 100%;"
                            :pickerOptions="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="会员密码" prop="paymentPassword" required>
          <el-input type="password" v-model="cardFormData.paymentPassword"></el-input>
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMethodId" required>
          <el-select v-model="cardFormData.paymentMethodId" placeholder="请选择支付方式">
            <el-option v-for="item in activePaymentMethods" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值金额" required>
          <el-input v-model.number="cardFormData.amount"></el-input>
        </el-form-item>
        <el-form-item label="付款金额" required>
          <el-input v-model.number="cardFormData.money"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="address">
          <el-input v-model="cardFormData.cardMemo"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="right">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <!-- 会员基本信息 END-->

</template>

<script>

  import moment from 'moment'
  import { DialogMixin } from '@/components/mixin/DialogMixin'

  import { checkout } from '@/api/getData'

  export default {
    props: ['customerData', 'dialogVisible'],
    mixins: [DialogMixin],
    data() {
      return {
        paymentMethodList: [],
        cardTypeList: [],
        cardFormData: {
          code: '',
          amount: '',
          money: '',
          expireAt: null,
          paymentMethodId: null,
          variantId: null,
          memo: '',
          paymentPassword: ''
        },
        rules: {
          code: [
            {
              required: true,
              min: 4,
              max: 11,
              message: '卡号为长度在 4 到 11 个数字和字母',
              trigger: 'blur'
            }
            //{ validator: checkmemberNum, trigger: "blur" }
          ],
          paymentPassword: [
            { type: 'string', required: true, message: '请输入支付密码' },
            {
              min: 6,
              max: 12,
              message: '长度在 6 到 12 个字符',
              trigger: 'blur'
            }
          ],
          amount: [
            { type: 'number', required: true, message: '请输入充值金额', trigger: 'blur' },
            {
              min: 0,
              max: 1000000,
              message: '请输入有效充值金额',
              trigger: 'blur'
            }
          ],
          money: [
            { type: 'number', required: true, message: '请输入付款金额', trigger: 'blur' },
            {
              min: 0,
              max: 1000000,
              message: '请输入有效付款金额',
              trigger: 'blur'
            }
          ]
        },
        pickerOptions: {
          shortcuts: [
            {
              text: '一年',
              onClick(picker) {
                picker.$emit(
                  'pick',
                  moment()
                    .add(1, 'years')
                    .toDate()
                )
              }
            },
            {
              text: '不限',
              onClick(picker) {
                picker.$emit('pick', null)
              }
            }
          ]
        }
      }
    },
    computed: {
      activePaymentMethods: function() {
        return this.paymentMethodList.filter(pm => {
          return pm.posable
        })
      }
    },
    methods: {
      async handleOpen() {
        console.log('CardForm..handleOpen')
        this.paymentMethodList = await this.getPaymentMethods()

        if (this.activePaymentMethods.length > 0) {
          this.cardFormData.paymentMethodId = this.activePaymentMethods[0].id
        }
        this.cardTypeList = await this.getCardTypes()

        if (this.cardTypeList.length > 0) {
          this.cardFormData.variantId = this.cardTypeList[0].masterId
        }
      },
      handleClose() {
        this.resetForm()
        this.handleCloseDialog()
      },
      submitForm() {
        this.$refs['cardForm'].validate(valid => {
          if (valid) {
            let orderParams = {
              enable_mp_msg: true,
              store_id: this.storeId,
              user_id: this.customerData.id,
              order_type: 'card',
              line_items: [
                {
                  variant_id: this.cardFormData.variantId,
                  card_amount: this.cardFormData.amount,
                  price: this.cardFormData.money,
                  quantity: 1,
                  card_code: this.cardFormData.code
                }
              ],
              payments: [
                {
                  payment_method_id: this.cardFormData.paymentMethodId,
                  amount: this.cardFormData.money
                }
              ]
            }
            let cardParams = {
              code: this.cardFormData.code,
              payment_password: this.cardFormData.paymentPassword,
              expire_at: this.cardFormData.expireAt,
              memo: this.cardFormData.memo
            }
            checkout({ order: orderParams, card: cardParams }).then(result => {
              if (result.id) {
                let order = this.buildOrder(result)
                this.$emit('card-created-event', order.cardTransaction.card)
                this.$message({
                  message: '恭喜你，会员卡创建成功',
                  type: 'success'
                })
                this.handleClose()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm() {
        this.$refs['cardForm'].resetFields()
      },
      //改变选择的充值卡类型
      handleCardChanged(val){
        let card = this.cardTypeList.find((o)=>o.masterId == val)
        console.log( " handle card changed .", val, card )
        this.cardFormData.amount = card.price
        this.cardFormData.money = card.price
      },
      fillIn() {
        this.cardFormData.code = ((Math.random() + 1) * 1000).toFixed()
        this.cardFormData.amount = 250
        this.cardFormData.paymentPassword = '123456'
      }
    }
  }

</script>

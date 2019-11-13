<style lang="scss" >
.add-member-container {
  .box-card {
  }
  .new-member-form {
    margin: 20px 10px;
  }
  .actions {
    margin: 0 auto 20px ;
    text-align: center;
  }
}
</style>

<template>
  <div class="add-member-container cel-window">
    <!-- 会员添加窗口 -> START -->
    <el-dialog :visible="computedVisible" :close-on-press-escape="false" :show-close="false" :top="'0'" :modal="false" @open="handleOpenDialog">
      <div slot="title" class="title-wrap">
        <div class="left back">
          <i class="el-icon-back" @click="handleCloseDialog()"></i>
        </div>
        <div> 会员添加</div>
      </div>

      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-form :model="memberFormData" :rules="memberRules" ref="memberFormData" status-icon label-width="100px" class="new-member-form">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>客户基本信息</span>
                 <el-checkbox label="添加会员卡" name="cardFlag" v-model="cardFlag" style="float: right; " class="hide"></el-checkbox>
              </div>
              <el-form-item label="电话" prop="mobile" required>
                <el-input v-model="memberFormData.mobile"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="userName">
                <el-input v-model="memberFormData.userName"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-select v-model="memberFormData.gender" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in sex" :key="item.value" :value="item.value" :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日">
                <el-form-item prop="birth">
                  <el-date-picker type="date" placeholder="选择日期" v-model="memberFormData.birth" format="yyyy 年 MM 月 dd 日" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="memberFormData.address"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="address">
                <el-input type="textarea" v-model="memberFormData.memo" style="height: 102px;"></el-input>
              </el-form-item>
            </el-card>
          </el-form>

        </el-col>
        <el-col :span="10" v-show="cardFlag">
          <el-form :model="cardFormData" :rules="cardRules" ref="cardFormData" status-icon label-width="100px" class="new-member-form">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员卡信息</span>
              </div>
              <el-form-item label="会员卡号" prop="code" >
                <el-input v-model="cardFormData.code" :readonly="true"></el-input>
              </el-form-item>
              <el-form-item label="会员卡类型" prop="variantId" required>
                <el-select v-model="cardFormData.variantId" placeholder="">
                  <el-option v-for="item in cardTypeList" :key="item.masterId" :label="item.name" :value="item.masterId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="到期时间" prop="expireAt">
                  <el-date-picker type="date" placeholder="选择日期" v-model="cardFormData.expireAt"
                    format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;" :pickerOptions="pickerOptions"></el-date-picker>
              </el-form-item>

              <el-form-item label="付款方式" prop="paymentMethodId" required>
                <el-select v-model="cardFormData.paymentMethodId" placeholder="请选择支付方式">
                  <el-option v-for="item in activePaymentMethods" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值金额" prop="amount" required>
                <el-input v-model="cardFormData.amount"></el-input>
              </el-form-item>
              <el-form-item label="付款金额" prop="money" required>
                <el-input v-model="cardFormData.money"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="memo">
                <el-input v-model="cardFormData.memo"></el-input>
              </el-form-item>
            </el-card>
          </el-form>

        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <div class="actions">
            <el-button type="primary" @click="depositCardConfirm">立即充值</el-button>
            <el-button @click="closeDialog">关闭</el-button>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 会员添加窗口 -> END -->
  </div>
</template>


<script>
// ***接口***
// 入口:props: ["member"]
// 出口:this.$emit("AddMemberReturnData", this.returnData);
// **********
import moment from 'moment'

import { checkout, updateCustomer, customerMobileValidate } from "@/api/getData";

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'
import {
  CelUIMixin
} from '@/components/mixin/CelUIMixin';

export default {
  props: ["member", "card",  'dialogVisible'],
  mixins: [DialogMixin, CelUIMixin],
  data() {

    //验证规则---电话号码
    var validPhone = (rule, value, callback) => {
      let cid = this.member.id
      customerMobileValidate(value, cid).then(function (response) {
        if (response.ret) {
          callback();
        } else {
          callback(new Error("电话号码已经注册过。"))
        }
      }, function (error) {
        callback(new Error(error))
      });
    };

    return {
      paymentMethodList: [],
      cardTypeList: [],
      memberFormData: {
        userName: "",
        mobile: "",
        birth: "",
        address: "",
        gender: 'male',
        memo: ''
      },
      sex: [{
        value: 'male',
        label: '男',
      }, {
        value: 'female',
        label: '女',
      }],
      cardFormData: {
        code: "",
        amount: '',
        money: '',
        expireAt: "",
        paymentMethodId: null,
        paymentPassword: null,
        variantId: null,
        memo: ""
      },
      returnData: {}, //添加会员方法,异步,请求服务器,调用getData.js中createCustomer
      memberRules: {
        mobile: [
          { type: "string", required: true, message: "请输入正确的电话号码", pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, trigger: "blur" },
          { validator: validPhone, message: "电话号码已经注册过。", trigger: "blur" }
        ]
      },
      cardRules: {
        code: [
          {
            required: true,
            min: 4,
            max: 11,
            message: "卡号为长度在 4 到 11 个数字和字母",
            trigger: "blur"
          }
        ]
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
      cardFlag: true
    };
  },
  computed: {
    isAddingCard: function () {
      return this.cardFlag
    },
    activePaymentMethods: function () {
      return this.paymentMethodList.filter((pm) => {
        return pm.posable
      })
    }
  },
  methods: {
    async handleOpenDialog() {
      console.log("MemberCardAdd handleOpenDialog", this.member)
      this.paymentMethodList = await this.getPaymentMethods()

      if (this.activePaymentMethods.length > 0) {
        this.cardFormData.paymentMethodId = this.activePaymentMethods[0].id
      }
      // 按照类型排序，按照名称排序
      this.cardTypeList = await this.getCardTypes()

      if (this.cardTypeList.length > 0) {
        this.cardFormData.variantId = this.cardTypeList[0].masterId
      }

      //this.$nextTick(function () {
        this.$refs.memberFormData.resetFields();
        this.$refs.cardFormData.resetFields();
      //})
      this.memberFormData = Object.assign({}, this.member)
      this.cardFormData.code = this.card.code
      this.cardFormData.variantId = this.card.variantId

      console.log("MemberAdd handleOpenDialog end")
    },
    closeDialog(){
      this.resetForm('memberFormData')
      this.handleCloseDialog()
    },
    depositCardConfirm(){
      let msg = `确定给会员卡${this.cardFormData.code} 充值${this.cardFormData.amount}元吗？`
      if( this.member.storeId !=  this.storeId){

        msg = `会员来自店铺${this.member.storeName}，确定给会员卡${this.cardFormData.code} 充值${this.cardFormData.amount}元并转入当前店铺吗？`
      }
      this.actionConfirm(msg, this.addCustomer)
    },
    addCustomer() {
      // 如果用户是其它店铺的请店员确认

      let validations = [this.$refs["memberFormData"].validate()]
      //如果创建会员卡，需要验证会员卡的表单
      if (this.isAddingCard) {
        validations.push(this.$refs["cardFormData"].validate())
      }

      Promise.all(validations).then((val) => {
        let cid = this.member.id

        let params = this.buildCheckoutParams()
        console.log("customer params =", params)

        checkout( params ).then((result)=>{
          if( result.id ){
            this.$message( {
              message: '恭喜你，会员卡充值成功',
              type: 'success'
            });
            let cparams = this.buildCustomerParams()
            updateCustomer(cid, cparams).then((cresult) => {
              const customer = this.buildCustomer(cresult)
              // POS选择刚创建的客户
              this.$emit("customer-created-event", customer);
              this.$bus.$emit("customer-created-gevent", customer);
              this.handleCloseDialog()
            })
          }else {
            //判读返回的数据中是否有错误
            //如果返回数据中有错误
            this.$alert(this.returnData.error, "错误提示", {
              confirmButtonText: "确定"
            });
            return false;
          }
        })

      }).catch(error => {
        console.error( error )
        this.$alert("请仔细检测表格", "错误提示", {
          confirmButtonText: "确定"
        })
        return false
      })
    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //转换成SerVer需要的数据
    buildCustomerParams() {
      let user = {
        username: this.memberFormData.userName,
        mobile: this.memberFormData.mobile,
        address: this.memberFormData.address,
        birth: this.memberFormData.birth,
        gender: this.memberFormData.gender,
        store_id: this.storeId,
        memo: this.memberFormData.memo
      }


      return { user }
    },
    buildCheckoutParams(){
      let orderParams = {
        //enable_mp_msg: true,
        store_id: this.storeId,
        user_id: this.member.id,
        order_type: this.OrderTypeEnum.deposit,
        line_items: [
          {
            variant_id: this.cardFormData.variantId,
            card_id: this.card.id,
            card_amount: this.cardFormData.amount,
            price: this.cardFormData.money,
            quantity: 1,
            cname: '会员卡充值'
          }
        ],
        payments: [{
            payment_method_id:  this.cardFormData.paymentMethodId,
            amount: this.cardFormData.money
          }]
      }
      let cardParams = {
        code: this.cardFormData.code,
        expire_at: this.cardFormData.expireAt,
        memo: this.cardFormData.memo
      }

      return {order: orderParams, card: cardParams}


    }

  }
};
</script>

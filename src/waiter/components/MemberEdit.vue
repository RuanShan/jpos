<style lang="scss" >
.add-member-container {
  .box-card {
  }
  .new-member-form {
    margin: 24px 12px;
  }
  .actions {
    margin: 16px auto;
    text-align: center;
  }
}
.edit-window {
  margin-top: -70px;
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
  <div>
    <!-- 会员编辑窗口 -> START -->
    <el-dialog class="edit-window" title="会     员     编     辑" :visible="computedVisible" width="50%" center :close-on-click-modal="false" :append-to-body="true" @open="openWindow" @close="handleCloseDialog">
      <hr style="margin-top: -15px;">
      <el-row>
        <el-col :span="24">
          <el-form :model="memberFormData" :rules="rules" ref="memberFormData" status-icon label-width="100px" class="member-edit-form">

            <el-form-item label="电话" prop="mobile" required>
              <el-input v-model="memberFormData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="username">
              <el-input v-model="memberFormData.username"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="memberFormData.gender" placeholder="请选择" style="width:100%">
                <el-option v-for="item in sex" :key="item.value" :value="item.value"  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生日">
              <el-form-item prop="birth">
                <el-date-picker type="date" placeholder="选择日期" v-model="memberFormData.birth" format="MM 月 dd 日" value-format="MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="memberFormData.address"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="address">
              <el-input type="textarea" v-model="memberFormData.memo"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <hr style="margin-top: 4px;">

      <el-row type="flex" justify="center">
        <el-col :span="18">
          <div class="actions">
            <el-button type="primary" @click="updateCustomer">更新</el-button>
            <el-button @click="closeWindow">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>


<script>
import { updateCustomer, customerMobileValidate } from "@/api/getData";
import { DialogMixin } from '@/components/mixin/DialogMixin'

export default {
  props: ['dialogVisible','customerData'],
  mixins: [DialogMixin],
  data() {
    //验证卡号--1.不能空;2.必须是数字;3.四至十一个字符
    // var checkmemberNum = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("不能为空"));
    //   }
    //   if (!isvalidNumber(value)) {
    //     callback(new Error("请输入数字值"));
    //   } else {
    //     callback();
    //   }
    // };

    //验证规则---电话号码
    var validPhone = (rule, value, callback) => {

      customerMobileValidate(value).then(function (response) {
        if (response.result) {
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
      displayMemberEditOnOff:"", // 本窗口显示标志位,没有初始值
      memberFormData: {
        username: "",
        mobile: "",
        birth: "",
        address: "",
        gender: "男"
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
        paymentAmount: null,
        expireAt: "",
        paymentMethodId: null,
        variantId: null,
        memo: ""
      },
      returnData: {}, //添加会员方法,异步,请求服务器,调用getData.js中createCustomer
      rules: {
        code: [
          {
            required: true,
            min: 4,
            max: 11,
            message: "卡号为长度在 4 到 11 个数字和字母",
            trigger: "blur"
          },
          //{ validator: checkmemberNum, trigger: "blur" }
        ],

        mobile: [
          { type: "string", required: true, message: "请输入正确的电话号码", pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, trigger: "blur" },
          { validator: validPhone, message: "电话号码已经注册过。", trigger: "blur" }
        ],
        paymentPassword: [
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur"
          }
        ],
        paymentAmount: [
          { type: "integer", required: true, message: "请输入充值金额", trigger: "blur" },
          {
            min: 0,
            max: 1000000,
            message: "请输入有效充值金额",
            trigger: "blur"
          }
        ],
      }
    };
  },
  computed: {
    isAddingCard: function () {
      return false
    },
    activePaymentMethods: function () {
      return this.paymentMethodList.filter((pm) => {
        return pm.posable
      })
    }
  },
  methods: {
    async handleOpenDialog() {
      console.log("MemberAdd handleOpenDialog start")
      this.paymentMethodList = await this.getPaymentMethods()

      if (this.activePaymentMethods.length > 0) {
        this.cardFormData.paymentMethodId = this.activePaymentMethods[0].id
      }
      this.cardTypeList = await this.getCardTypes()

      if (this.cardTypeList.length > 0) {
        this.cardFormData.variantId = this.cardTypeList[0].id
      }

      this.$nextTick(function () {
        this.$refs.memberFormData.resetFields();
        this.$refs.cardFormData.resetFields();
      })
      console.log("MemberAdd handleOpenDialog end")
    },

    updateCustomer(formName) {
      let validations = [this.$refs["memberFormData"].validate()]
      //如果创建会员卡，需要验证会员卡的表单
      if (this.isAddingCard) {
        validations.push(this.$refs["cardFormData"].validate())
      }

      Promise.all(validations).then((val) => {
        let params = this.buildParams() //转换成SerVer需要的数据
        console.log("customer params =", params)
        updateCustomer(params).then((result) => {
          console.log(" created customer1 ", result)
          this.returnData = result
          //判断返回的数据,Id不为空且不等于undefined时,提交Id数据给父组件
          if (this.returnData.id) {
            const customer = this.buildCustomer(this.returnData)
            // POS选择刚创建的客户
            this.$emit("customer-updated-event", customer);
            this.handleCloseDialog();
          } else {
            //判读返回的数据中是否有错误
            //如果返回数据中有错误
            this.$alert(this.returnData.error, "错误提示", {
              confirmButtonText: "确定"
            });
            return false;
          }
        })
      }).catch(error => {
        this.$alert("请仔细检测表格", "错误提示", {
          confirmButtonText: "确定"
        })
        return false
      })
    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.handleCloseDialog();
    },
    //转换成SerVer需要的数据
    buildParams() {
      let user = {
        username: this.memberFormData.username,
        mobile: this.memberFormData.mobile,
        paymentPassword: this.memberFormData.paymentPassword,
        address: this.memberFormData.address,
        birth: this.memberFormData.birth,
        store_id: this.storeId

      }

      let order = null
      if (this.isAddingCard) {
        user.cards_attributes = [{ code: this.cardFormData.code, variant_id: this.cardFormData.variantId }]

        order = {
          payments: [
            { payment_method_id: this.cardFormData.paymentMethodId, amount: this.cardFormData.paymentAmount }
          ]
        }
      }
      return { user, order }
    },

    fillIn() {
      this.cardFormData.code = ((Math.random() + 1) * 1000).toFixed()
      this.cardFormData.paymentAmount = 250
      this.cardFormData.paymentPassword = "123456"
      this.memberFormData.mobile = "1300000" + this.cardFormData.code
      this.memberFormData.birth = new Date();
    },
    //打开窗口时事件处理函数-----
    openWindow() {
      this.displayMemberEditOnOff = true;
      // 传入的当前选择客户数据
      this.memberFormData = Object.assign({}, this.customerData )
      console.log( "openWindow--this.memberFormData=", this.memberFormData )
    },
    //关闭窗口时事件处理函数-----
    closeWindow() {
      this.resetForm('memberFormData')
      this.handleCloseDialog()
    }
  }
};
</script>

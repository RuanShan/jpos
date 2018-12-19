<style lang="scss">
.clockin_container {
  .greeting{
        line-height: 1.5em;
  }
    .form_contianer {
        max-width: 320px;
        margin: auto;
        padding: 25px;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;
        .submit_btn {
            width: 100%;
            font-size: 16px;
        }
        .hide-password {
            width: 0;
            height: 0;
            opacity: 0;
        }
    }
}
</style>

<template>
<el-dialog :visible="computedVisible" @opened="handleDialogOpen" append-to-body :show-close="false" class="cel-dialog">
  <div slot="title" class="title-wrap">
    <div class="right back"> <i class="el-icon-close" @click="handleCloseDialog"></i> </div>
    <div> 打卡</div>
  </div>

  <div class="dialog-content-wrap clockin_container">
    <section class="form_contianer">
      <p class="greeting"> {{greeting}}</p>
      <el-form :model="clockinForm" :rules="rules" ref="clockinForm">
        <input name="mockpassword1" type="password" class="hide-password">

        <el-form-item prop="username">
          <el-input ref="tabindex1" tabindex="1"  v-model="clockinForm.username" placeholder="用户名" autofocus @keyup.enter.native="handleKeyupEnter">
            <i class="fa fa-user" slot="suffix">  </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input ref="tabindex2" tabindex="2"  type="password" placeholder="密码" v-model="clockinForm.password" @keyup.enter.native="handleSubmitForm">
            <i class="fa fa-keyboard-o" slot="suffix">  </i></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitForm" class="submit_btn">打卡</el-button>
        </el-form-item>
        <input name="mockpassword2" type="password" class="hide-password">

      </el-form>
      <p class="tip"> </p>

    </section>

  </div>

</el-dialog>
</template>


<script>
import _ from "lodash"

import {
  addUserEntry
} from '@/api/getData'

import {
  DialogMixin
} from '@/components/mixin/DialogMixin'


export default {
  data() {
    return {
      greeting: '',
      clockinForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
    }
  },
  mixins: [DialogMixin],
  props: ['dialogVisible', 'clockState'],
  computed: {
    computedLineItems() {
      return _.flatten(this.lineItemGroups.map((group) => {
        return group.lineItems
      }))
    }
  },

  methods: {
    handleDialogOpen() {
      this.scanedNumbers = []
      this.lineItemGroups = []
      // Cannot read property 'resetFields' of undefined
      console.log(" this.$refs.clockinForm=", this.$refs.clockinForm)
      if( this.clockState == 'clockin'){
        this.greeting = "世界那么大，人生那么长，总会有那么一个人，让你想要温柔以待。早安！"
      }else{
        this.greeting = "每天都有一个时刻，让我们为之振奋不已，每天都有两个字，让我们如沐春风，心情格外大好，那就是'下班' ，下班快乐！"
      }
      this.$refs.clockinForm.resetFields()
      this.$refs.tabindex1.focus()
    },

    async handleSubmitForm() {
      let formName = 'clockinForm'
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = {
            user: {
              username: this.clockinForm.username,
              password: this.clockinForm.password
            },
            user_entry: {
              store_id: this.storeId
            }
          }

          const res = await addUserEntry(params)
          if (res.id) {
            this.$message({
              type: 'success',
              message: '打卡成功'
            })
            const userEntry = this.buildUserEntry(res)

            this.$emit('update:dialogVisible', false)
            this.$emit('user-entry-created', userEntry)

          } else {
            this.$message({
              type: 'error',
              message: "用户名和密码不匹配"
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的用户名密码',
            offset: 100
          })
          return false
        }
      })
    },

    handleKeyupEnter(event) {
      console.log("handleKeyupEnter->", event)
      const i = event.target.tabIndex
      const nextDOM = this.$refs['tabindex' + (i + 1)]
      nextDOM.focus()
    }

  }
}
</script>

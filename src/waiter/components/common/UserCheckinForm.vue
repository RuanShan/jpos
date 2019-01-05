<style lang="scss">
.clockin_container{

}
</style>
<template>
<div class="clockin_container fillcontain">
  <section class="form_contianer">
    <div class="manage_tip">
      <div class="logo-wrap">
        <img src="@assets/img/logo-w.png"/>
      </div>
    </div>
    <el-form :model="clockinForm" :rules="rules" ref="clockinForm">
      <el-form-item prop="username">
        <el-input ref="tabindex1" tabindex="1"  v-model="clockinForm.username" placeholder="用户名" autofocus @keyup.enter.native="handleKeyupEnter"> </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input ref="tabindex2" tabindex="2"  type="password" placeholder="密码" v-model="clockinForm.password" @keyup.enter.native="handleSubmitForm"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitForm" class="submit_btn">打卡</el-button>
      </el-form-item>
    </el-form>
    <p class="tip"> </p>

  </section>
</div>
</template>

<script>
import {
  addUserEntry
} from '@/api/getData'

export default {
  data() {
    return {
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
  mounted() {},
  methods: {

    async handleSubmitForm() {
      let formName = 'clockinForm'
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = {
            user: {
              username: this.clockinForm.username,
              password: this.clockinForm.password
            }
          }

          const res = await addUserEntry(params)
          if (res.id) {
            this.$message({
              type: 'success',
              message: '打卡成功'
            })
            this.$store.commit("saveUser", this.buildUser(res))
            this.$emit("user-entry-created")
          } else {
            this.$message({
              type: 'error',
              message: res.error
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
    initializeApp() {
      console.log("..initializeApp..")
      this.getStores()
    },
    handleKeyupEnter(event){
      console.log( "handleKeyupEnter->", event)
      const i = event.target.tabIndex
      const nextDOM = this.$refs['tabindex'+(i+1)]
      nextDOM.focus()
    }
  }

}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.clockin_container {
    background-color: #324057;
}

.form_contianer {
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .submit_btn {
        width: 100%;
        font-size: 16px;
    }
}
.tip {
    font-size: 12px;
    color: red;
}

</style>

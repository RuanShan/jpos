<template>
<div class="clockin_container fillcontain">
  <section class="form_contianer">

    <el-form :model="clockinForm" :rules="rules" ref="clockinForm">
      <el-form-item prop="username">
        <el-input v-model="clockinForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="clockinForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('clockinForm')" class="submit_btn">打卡</el-button>
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

    async submitForm(formName) {
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

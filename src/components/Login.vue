<template>
  <div class="login">
    <el-form :model="ruleForm" :rules="rules" label-width="100px" status-icon ref="form">
    <img src="@/assets/timg.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    // 登录之前需要进行整个表单验证
    login() {
      this.$refs.form.validate((vali, obj) => {
        if (!vali) { return false }
        axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.ruleForm
        }).then(res => {
          console.log(res.data)
          if (res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success',
              duration: 1000
            })
            localStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: 'error',
              duration: 1000
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
.el-form {
  width: 400px;
  background-color: #fff;
  margin: 200px auto;
  padding: 70px 50px 20px 20px;
  border-radius: 20px;
    position: relative;
  img{
    width: 120px;
    height: 120px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top:-70px;
    border-radius: 50%;
    border: 5px solid #fff;
  }
  .el-button:nth-child(2){
    margin-left: 100px;
  }
}
}
</style>

<template>
  <div class="login-container">
    <div class="formBox">
      <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" label-position="left">
        <!-- logo -->
        <img src="@/assets/images/logo.png" alt="" class="logo">
        <el-form-item prop="loginName">
          <span>
            <svg-icon icon-class="shouji" />
          </span>
          <el-input v-model="loginForm.loginName" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password">
          <span>
            <svg-icon icon-class="RectangleCopy" />
          </span>
          <el-input ref="pwd" v-model="loginForm.password" :type="pwd" placeholder="请输入密码" />
          <span>
            <svg-icon :icon-class="pwd === 'password' ? 'eye' : 'eye-open'" @click="changePwdType" />
          </span>
        </el-form-item>
        <el-form-item prop="code">
          <el-row type="flex">
            <el-col :span="2">
              <span>
                <svg-icon icon-class="dunpaibaoxianrenzheng_o" />
              </span>
            </el-col>
            <el-col :span="15">
              <el-input v-model="loginForm.code" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="7">
              <img :src="src" alt="" @click="changeSrc">
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-button :loading="loading" type="primary" class="btn" @click="login">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getcode } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      getcode,
      loginForm: {
        loginName: 'admin',
        password: 'admin',
        code: '',
        clientToken: ''
      },
      rules: {
        loginName: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }, {
          max: 16, min: 5, trigger: 'blur', message: '密码必须在5-16位'
        }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      pwd: 'password',
      loading: false,
      src: ''

    }
  },
  mounted() {
    this.changeSrc()
  },
  methods: {
    changePwdType() {
      this.pwd === 'password' ? this.pwd = '' : this.pwd = 'password'
      this.$nextTick(() => { this.$refs.pwd.focus() })
    },
    async login() {
      try {
        // 第一步验证通过 发起请求
        await this.$refs.loginForm.validate()
        this.loading = true
        // 发起请求
        await this.$store.dispatch('user/getToken', this.loginForm)
        // 请求成功
        this.$router.push('/')
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
    },
    // 更新验证码
    changeSrc() {
      const num = Math.random() * 100
      this.src = this.getcode(num)
      console.log(this.src)
      this.loginForm.clientToken = num
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:grey;
$cursor: grey;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    width: 100%;
    height: 52px;
    margin-bottom: 24px;
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    span{
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    font-size: 16px;
    }
  }
  .el-row{
    line-height: 0;
  }
  .el-col-2{
    line-height: 40px;
  }
}
.code{
  img{
    width:100%;
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background: url(~@/assets/images/bgc.png) no-repeat 0 0;
  background-size: cover;
  .formBox{
   position: absolute;
    width: 518px;
    height: 388px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 76px 35px 0;
    border-radius: 10px;
    background-color: #fff;
  }
.btn{
  width: 100%;
    height: 52px;
    background: linear-gradient(262deg,#2e50e1,#6878f0);
    opacity: .91;
    border-radius: 8px;
    color: #fff;
    text-shadow: 0 7px 22px #cfcfcf;
}
.logo{
     position: fixed;
    width: 96px;
    height: 96px;
    top: -46px;
    left: 50%;
    margin-left: -48px;
    z-index: 999;
}
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

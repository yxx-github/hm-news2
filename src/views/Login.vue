<template>
  <div>
    <!-- 头部 -->
    <hm-header>登录</hm-header>

    <!-- logo -->
    <hm-logo></hm-logo>

    <!-- 输入框 -->
    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      clearable
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />

    <!-- 按钮 -->
    <hm-button @click.native="startLogin">登录</hm-button>

    <!-- 如果没有登录 -->
    <div class="link">
      如果没有账号，请点击
      <router-link to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      usernameErrMsg: '', // 用户名错误提示信息
      passwordErrMsg: '' // 密码错误提示信息
    }
  },
  created() {
    // console.log(this.$route)
    // 解构
    const { username, password } = this.$route.params
    if (username && password) {
      this.username = username
      this.password = password
    }
  },
  methods: {
    // 校验用户名
    checkUsername() {
      const reg = /^1\d{4,10}$/
      if (reg.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式错误'
      }
    },
    // 校验密码
    checkPassword() {
      const reg = /^\d{3,12}$/
      if (reg.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式错误'
      }
    },
    // 清除用户名
    clearUsername() {
      this.usernameErrMsg = ''
    },
    // 清除密码
    clearPassword() {
      this.passwordErrMsg = ''
    },
    // 登录之前的再次校验
    async startLogin() {
      // 有值 + 格式正确
      if (
        this.username !== '' &&
        this.password !== '' &&
        this.usernameErrMsg === '' &&
        this.passwordErrMsg === ''
      ) {
        let res = await this.$axios.post('http://localhost:3000/login', {
          username: this.username,
          password: this.password
        })
        console.log(res.data)
        // 解构
        const { statusCode, message, data } = res.data
        if (statusCode === 200) {
          // 1.保存token + 用户id
          localStorage.setItem('token', data.token)
          localStorage.setItem('user_id', data.user.id)

          // 2.提示
          this.$toast.success(message)

          // 3. 跳转
          this.$router.push('/user')
        } else {
          this.$toast.fail(message)
        }
      } else {
        this.$toast.fail('校验失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.link {
  text-align: right;
  padding-right: 20px;
  font-size: 14px;
}
</style>

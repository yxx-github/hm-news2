<template>
  <div>
    <!-- 头部 -->
    <hm-header>编辑资料</hm-header>

    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt>
      <van-uploader class="uploader" :after-read="afterRead"/>
    </div>

    <!-- 列表 -->
    <van-cell-group>
      <van-cell @click="showNickname" title="昵称" is-link :value="info.nickname"/>
      <van-cell title="密码" is-link value="******"/>
      <van-cell @click="showGender" title="性别" is-link :value="info.gender === 1? '男' : '女'"/>
    </van-cell-group>

    <!-- 修改昵称的弹框 -->
    <van-dialog @confirm="confirmNickname" v-model="isShowNickname" title="修改昵称" show-cancel-button>
      <van-field v-model="nickname" placeholder="请输入新的昵称"/>
    </van-dialog>

    <!-- 修改性别的弹框 -->
    <van-dialog @confirm="confirmGender" v-model="isShowGender" title="修改性别" show-cancel-button>
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1"/>
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {}, //用户信息
      isShowNickname: false, // 是否显示修改昵称的弹框
      nickname: '', // 最新修改的昵称
      isShowGender: false, // 是否显示修改性别的弹框
      gender: 0
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 获取用户信息
    async getInfo() {
      let token = localStorage.getItem('token')
      let user_id = localStorage.getItem('user_id')

      let res = await this.$axios.get(`/user/${user_id}`)
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        this.info = data
      } else {
        this.$toast.fail(message)
      }
    },
    // 显示修改昵称
    showNickname() {
      // 显示弹框
      this.isShowNickname = true
      // 给nickname赋值
      this.nickname = this.info.nickname
    },
    // 点击弹框内的确定按钮（修改昵称）
    confirmNickname() {
      // 发送请求前的判断
      if (this.nickname === this.info.nickname) {
        this.$toast('新旧昵称不能一样')
        return
      }
      // 封装后
      this.ml_editUser({
        nickname: this.nickname
      })
    },
    // 显示修改性别
    showGender() {
      // 显示弹框
      this.isShowGender = true
      // 给gender赋值
      this.gender = this.info.gender
    },
    // 点击弹框内的确定按钮（修改性别）
    confirmGender() {
      // 发送请求前的判断
      if (this.gender === this.info.gender) {
        this.$toast('新旧性别不能一样')
        return
      }
      // 封装后
      this.ml_editUser({
        gender: this.gender
      })
    },
    // 封装修改用户信息的函数
    async ml_editUser(data1) {
      let user_id = localStorage.getItem('user_id')

      let res = await this.$axios.post(`/user_update/${user_id}`, data1)
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        // 提示语
        this.$toast.success(message)
        // 获取最新的数据
        this.getInfo()
      } else {
        this.$toast.fail(message)
      }
    },
    async afterRead(data1) {
      let formdata = new FormData()
      formdata.append('file', data1.file)

      // 上传
      let res = await this.$axios.post('/upload', formdata)
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.ml_editUser({
          head_img: data.url
        })
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  text-align: center;

  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin: 20px 0;
  }
  .uploader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
}
</style>

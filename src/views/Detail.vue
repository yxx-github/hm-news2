<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div @click="unfollow" v-if="detail.has_follow" class="follow">已关注</div>
        <div @click="follow" v-else class="follow">关注</div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="container">
      <div class="title line2">是啥和废话话费巨大的和地方艰苦地方很多覅合法化会复活复活</div>
      <div class="name">
        <span>新华网</span>
        <span>2020-10-10</span>
      </div>
      <!-- 1.文本内容 (图片 + 文字) -->
      <div v-if="detail.type === 1" v-html="detail.content" class="content"></div>
      <!-- 2. 视频 -->
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div @click="like" class="like" :class="{ active: detail.has_like }">
          <i class="iconfont icondianzan"></i>
          <i>{{detail.like_length}}</i>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="comments">
      <hm-comment v-for="comment in commentsList" :key="comment.id" :comment="comment"></hm-comment>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <div class="input" v-if="!isShow">
        <div class="left">
          <input ref="input" @focus="handleFocus" type="text" placeholder="写跟帖">
        </div>
        <div class="center">
          <van-icon name="chat-o" badge="9"/>
        </div>
        <div class="right">
          <van-icon name="star-o"/>
        </div>
      </div>
      <div class="textarea" v-else>
        <div class="left">
          <textarea ref="textarea" @blur="handleBlur" placeholder="请输入内容"></textarea>
        </div>
        <div class="right">
          <div class="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {}, // 详情页信息
      commentsList: [], //评论信息
      isShow: false // 控制 textarea 是否显示
    }
  },
  created() {
    console.log('详情页', this.$route.params.id)
    this.getDetail()
    this.getComments()
  },
  // mounted() {
  //   console.log(this.$refs)
  // },
  methods: {
    // 获取详情页信息
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        console.log('详情页信息', res.data.data)
        this.detail = res.data.data
      }
    },
    // 取消关注
    async unfollow() {
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`)
      if (res.data.statusCode === 200) {
        // 提示信息
        this.$toast.success(res.data.message)
        // 重新请求
        this.getDetail()
      }
    },
    // 关注
    async follow() {
      // 判断有没有登录
      let token = localStorage.getItem('token')
      if (!token) {
        // 提示
        this.$toast('请先登录！')
        // 跳转
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
      }
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`)
      if (res.data.statusCode === 200) {
        // 提示信息
        this.$toast.success(res.data.message)
        // 重新请求
        this.getDetail()
      }
    },
    // 点赞
    async like() {
      let token = localStorage.getItem('token')
      if (!token) {
        this.$toast('请去登录！')
        this.router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        return
      }
      let res = await this.$axios.get(`/post_like/${this.detail.id}`)
      // console.log(res.data)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 重新请求数据（刷新数据）
        this.getDetail()
      }
    },
    // 获取评论列表
    async getComments() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        this.commentsList = res.data.data
        console.log('评论列表', res.data.data)
      }
    },
    // 聚焦
    handleFocus() {
      this.isShow = true
    },
    // 失焦
    handleBlur() {
      this.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    i {
      font-size: 50px;
      padding-left: 10px;
    }
  }
  .right {
    width: 80px;
    .follow {
      width: 54px;
      height: 20px;
      border: 1px solid #666;
      text-align: center;
      line-height: 22px;
      border-radius: 10px;
    }
  }
}
.container {
  padding: 10px;
  .title {
    font-size: 18px;
    font-weight: 700;
    margin: 10px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 15px;
    }
  }
  .content {
    margin-top: 10px;
  }
}
/deep/ img {
  width: 100%;
}
video {
  width: 100%;
  margin-top: 10px;
}
// 点赞
.bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  .like {
    border: 1px solid #666;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    i {
      margin: 0 5px;
      color: #666;
    }
  }
  .like.active {
    border: 1px solid #f00;
    i {
      color: red;
    }
  }
}
// 评论
.comments {
  border-top: 2px solid #ccc;
  padding-bottom: 40px;
}
// 底部
.footer {
  background-color: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  .input {
    display: flex;
    height: 40px;
    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        width: 80%;
        height: 30px;
        border: none;
        background-color: #ddd;
        border-radius: 15px;
        text-indent: 1em;
      }
    }
    .center,
    .right {
      width: 60px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .textarea {
    height: 70px;
    display: flex;

    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        background-color: #ddd;
        border-radius: 8px;
        resize: none;
        padding-top: 5px;
        text-indent: 1em;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .send {
        width: 40px;
        height: 30px;
        border-radius: 5px;
        background-color: #f00;
        color: #fff;
        text-align: center;
        line-height: 30px;
      }
    }
  }
}
</style>

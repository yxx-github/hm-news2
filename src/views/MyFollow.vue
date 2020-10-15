<template>
  <div>
    <!-- 头部 -->
    <hm-header>我的关注</hm-header>

    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt>
        </div>
        <div class="center">
          <div class="nickname">{{ item.nickname }}</div>
          <div class="date">{{item.create_date | date}}</div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getFollowList()
  },
  methods: {
    // 获取我的关注信息
    async getFollowList() {
      let res = await this.$axios.get('/user_follows')
      if (res.data.statusCode === 200) {
        this.list = res.data.data
      } else {
        this.$toast.fail(res.data.message)
      }
    },
    // 取消关注
    async unfollow(id) {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要取消关注该用户吗？'
        })

        let res = await this.$axios.get(`/user_unfollow/${id}`)
        if (res.data.statusCode === 200) {
          // 弹框
          this.$toast.success(res.data.message)
          // 获取最新的列表
          this.getFollowList()
        } else {
          this.$toast.fail(res.data.message)
        }
      } catch (error) {
        console.log('取消')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  .item {
    // height: 90px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    .left {
      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      padding-left: 20px;
      height: 50px;
      line-height: 25px;
      .nickname {
        font-size: 14px;
      }
      .date {
        color: #999;
      }
    }
    .right {
      background-color: #ddd;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
    }
  }
}
</style>

<template>
  <div>
    <!-- 头部 -->
    <hm-header>我的跟帖</hm-header>

    <!-- 列表 -->
    <van-list
      v-model="loading"
      @load="onLoad"
      :finished="finished"
      finished-text="没有更多数据了"
      :immediate-check="false"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="date">{{item.create_date | date}}</div>
        <div class="parent" v-if="item.parent">
          <div class="parent-nickname">回复: {{item.parent.nickname}}</div>
          <div class="parent-content">{{item.parent.content}}</div>
        </div>
        <div class="content">{{item.content}}</div>
        <div class="post">
          <div class="title line1">{{item.post.title}}</div>
          <i class="iconfont iconjiantou1"></i>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 5,
      loading: false, // 本次加载完成，可以进行下一次加载
      finished: false // 是否全部加载完成
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res.data)
      if (res.data.statusCode === 200) {
        // es5
        // this.list = this.list.concat(res.data.data)
        // es6
        this.list = [...this.list, ...res.data.data]
        this.loading = false
        if (res.data.data.length < this.pageSize) {
          this.finished = true //全部加载完成
        }
      } else {
        this.$toast.fail(res.data.message)
      }
    },
    // 触底触发
    onLoad() {
      //  console.log('触底 加载更多数据') // 准备下一次加载
      // 在这里，调用 onload 的时候，默认把 loading : true this.loading = true
      this.pageIndex++
      this.getCommentList()
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .date {
    color: #999;
  }
  .parent {
    background-color: #ddd;
    padding: 10px;
    color: #999;
    &-nickname {
      height: 20px;
      line-height: 20px;
    }
    &-content {
      font-size: 14px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
  .post {
    display: flex;
    color: #999;
    .title {
      flex: 1;
    }
    .iconfont {
      width: 20px;
      text-align: center;
    }
  }
}
</style>

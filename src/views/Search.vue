<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <input
          @input="search_recommend"
          v-model="keyword"
          @keyup.enter="search"
          type="text"
          placeholder="请输入搜索的内容"
        >
        <i class="iconfont iconsearch"></i>
      </div>
      <div @click="search" class="right">搜索</div>
    </div>
    <!-- 搜索推荐 -->
    <div class="search_recommend" v-if="recommendList.length > 0">
      <div
        @click="clickHistoryTag(item.title)"
        v-for="item in recommendList"
        :key="item.id"
      >{{ item.title }}</div>
    </div>
    <!-- 回车搜索文章列表 -->
    <div class="content" v-else-if="postList.length > 0">
      <hm-post
        @click.native="$router.push(`/detail/${post.id}`)"
        v-for="post in postList"
        :key="post.id"
        :post="post"
      ></hm-post>
    </div>
    <!-- 历史 -->
    <div class="history" v-else>
      <!-- 历史记录 -->
      <div class="title">历史记录</div>
      <div class="list">
        <div @click="clickHistoryTag(h)" class="item" v-for="h in historyList" :key="h">{{ h }}</div>
      </div>
      <!-- 热门搜索 -->
      <div class="title">热门搜索</div>
      <div class="list">
        <div @click="clickHistoryTag(hot)" class="item" v-for="hot in hotList" :key="hot">{{ hot }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      keyword: '', //搜索的内容
      postList: [], // 搜索文章列表
      historyList: [], // 历史记录
      hotList: ['1', '情火', '关晓彤'], //热门搜索
      recommendList: [] //搜索推荐列表
    }
  },
  created() {
    // 进行防抖处理
    this.search_recommend = _.debounce(this.search_recommend, 500)

    // 一进入到页面从本地缓存中取
    let historyList = JSON.parse(localStorage.getItem('history_list'))
    if (historyList) {
      this.historyList = historyList
    }
  },
  watch: {
    keyword(newVal) {
      if (!newVal) {
        // 输入框内容为 空的时候
        //  把 搜索列表清空, 推荐搜索列表清空
        this.postList = []
        this.recommendList = []
      }
    }
  },
  methods: {
    async search() {
      this.recommendList = []
      // 排空 如果搜索的内容为空 就没有必要进行下面的请求了
      if (this.keyword.trim() === '') return

      // 把输入的搜索内容添加到历史记录里面
      this.historyList.unshift(this.keyword)

      // 去重
      this.historyList = [...new Set(this.historyList)]
      // 存到本地
      localStorage.setItem('history_list', JSON.stringify(this.historyList))

      // 发送请求
      let res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword
        }
      })
      if (res.data.statusCode === 200) {
        this.postList = res.data.data
      }
    },
    // 点击历史记录
    clickHistoryTag(h) {
      // 1. 把点击的历史记录赋值给搜索内容 keyword
      this.keyword = h
      // 2.搜索
      this.search()
    },
    // 搜索推荐
    async search_recommend() {
      // 排空
      if (this.keyword.trim() === '') return

      let res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword
        }
      })
      if (res.data.statusCode === 200) {
        this.recommendList = res.data.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 头部
.header {
  height: 40px;
  border-bottom: 1px solid #ccc;
  background-color: #ddd;
  display: flex;

  .left,
  .right {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    justify-content: flex-start;
  }
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input {
      width: 90%;
      height: 30px;
      line-height: 30px;
      border: none;
      border: 1px solid #ccc;
      border-radius: 15px;
      text-indent: 2em;
    }
    i {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      color: #999;
    }
  }
}

// 历史
.history {
  padding: 20px;
  .title {
    font-size: 18px;
    font-weight: 800;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      background-color: #ddd;
      padding: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}

.search_recommend {
  padding: 10px;
  div {
    border-bottom: 1px solid #ccc;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
}
</style>

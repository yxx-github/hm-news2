<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center" @click="$router.push('/search')">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right" @click="$router.push('/user')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>

    <!-- 小三角 -->
    <van-sticky z-index="999">
      <div class="container" @click="$router.push('/tabsedit')">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </van-sticky>
    <!-- tab标签 导航 -->
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <!-- 分页 -->
          <van-list
            :immediate-check="false"
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            finished-text="没有更多了"
          >
            <!-- 列表 -->
            <hm-post
              @click.native="$router.push(`/detail/${post.id}`)"
              v-for="(post, index) in postList"
              :key="index"
              :post="post"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 0, // tab栏当前激活的索引值
      tabList: [], // tab栏列表数据
      postList: [], // post 文章列表
      pageIndex: 1, //当前页码
      pageSize: 5, //每页的页数
      loading: false, //是否在上一次的加载状态中
      finished: false, //是否全部加载完成
      isRefreshing: false //是否在上一次的下拉刷新中
    }
  },
  watch: {
    active(newActive) {
      // 只要 active 发生改变了 就说明切换 tab了

      // 1.处理之前的数据
      this.postList = []
      this.pageIndex = 1

      // 处理加载
      this.finished = false
      this.loading = true

      // 监听新的索引 => 对应新的栏目id => 发送新的请求，获取对应的文章列表
      this.getPostList(this.tabList[newActive].id)
    }
  },
  created() {
    this.getTabsList()
  },
  activated() {
    // 被 keep-alive 缓存的组件 激活时调用 , ( 切换显示 )
    console.log('activated')
    // 从本地取
    let activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    if (activeTabs) {
      this.tabList = activeTabs
      this.active = 0 // 让索引值回到初始状态
      this.getPostList(this.tabList[this.active].id)
      return
    }
  },
  // deactivated() {
  //   //  被 keep-alive 缓存的组件 停用时调用 , ( 切换隐藏 )
  //   console.log('deactivated')
  // },
  methods: {
    // 获取tab栏目列表
    async getTabsList() {
      // 先从本地取
      let activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
      if (activeTabs) {
        this.tabList = activeTabs
        this.getPostList(this.tabList[this.active].id)
        return // 从本地取到后不需要再发送请求获取
      }

      let res = await this.$axios.get('/category')
      if (res.data.statusCode === 200) {
        this.tabList = res.data.data
      }
      // console.log('栏目列表', res.data.data)
      // 请求获取文章列表
      this.getPostList(this.tabList[this.active].id)
    },
    // 获取文章列表
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      if (res.data.statusCode === 200) {
        this.postList = [...this.postList, ...res.data.data]
        // 获取完成后 将 loading 改成 false
        this.loading = false
        // 全部加载完成，将 finished 改成 true
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
        //  真正加载完毕, 把 isRefreshing =  false
        this.isRefreshing = false
      }
      // console.log('文章列表', this.postList)
    },
    // 触底
    onLoad() {
      this.pageIndex++
      this.getPostList(this.tabList[this.active].id)
      // console.log('触底')
    },
    // 下拉刷新
    onRefresh() {
      // console.log('下拉')
      // 1.处理之前的数据
      this.postList = []
      this.pageIndex = 1

      // 处理文字
      this.finished = false
      this.loading = true // 防止自动触发一次底部  上一页触底了, 进入到下一页会自动触发

      // 2.重新请求数据
      this.getPostList(this.tabList[this.active].id)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__nav {
  position: relative;
  background-color: #ddd;
  // 给右边的小三角留空白
  margin-right: 40px;
}

// 小三角
.container {
  position: absolute;
  right: 0;
  z-index: 999;
  width: 40.5px;
  height: 44px;
  background-color: #ddd;
  text-align: center;
  line-height: 44px;
}
.header {
  height: 40px;
  background-color: #f00;
  display: flex;
  align-items: center;
  text-align: center;
  color: #fff;
  .left,
  .right {
    width: 60px;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }
  .iconsearch {
    margin-right: 5px;
  }
  .center {
    flex: 1;
    background: rgba(255, 255, 255, 0.5);
    height: 30px;
    border-radius: 15px;
    line-height: 30px;
  }
}
</style>

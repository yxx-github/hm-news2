<template>
  <div>
    <!-- 头部 -->
    <hm-header>栏目管理</hm-header>
    <div class="container">
      <!-- 点击删除 -->
      <div class="title">点击删除一个频道</div>
      <div class="list">
        <div class="item" v-for="tab in activeTabs" :key="tab.id">
          <div @click="delTab(tab.id)">{{ tab.name }}</div>
        </div>
      </div>
      <!-- 点击添加 -->
      <div class="title">点击添加一个频道</div>
      <div class="list">
        <div class="item" v-for="tab in deactiveTabs" :key="tab.id">
          <div @click="addTab(tab.id)">{{ tab.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabs: [], // 上面的数组
      deactiveTabs: [] // 下面的数组
    }
  },
  created() {
    this.getActiveTabsList()
  },
  watch: {
    activeTabs(newValue) {
      // 保存到本地
      localStorage.setItem('activeTabs', JSON.stringify(newValue))
      localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
    }
  },
  methods: {
    // 获取栏目列表
    async getActiveTabsList() {
      // 先尝试从本地获取
      let activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
      let deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
      if (activeTabs && deactiveTabs) {
        this.activeTabs = activeTabs
        this.deactiveTabs = deactiveTabs
        return
      }
      // 发送请求
      let res = await this.$axios.get('/category')
      if (res.data.statusCode === 200) {
        this.activeTabs = res.data.data
      }
    },
    // 删除
    delTab(id) {
      // 1.根据id找到对应的栏目
      // 2. 先添加到下面的数组
      // 3. 再从上面删除
      let tab = this.activeTabs.find(v => v.id === id)
      this.deactiveTabs.push(tab)
      this.activeTabs = this.activeTabs.filter(v => v.id !== id)
    },
    // 添加
    addTab(id) {
      // 1. 根据id找到对应的栏目
      // 2. 添加到上面的数组
      // 3. 再从下面删除
      let tab = this.deactiveTabs.find(v => v.id === id)
      this.activeTabs.push(tab)
      this.deactiveTabs = this.deactiveTabs.filter(v => v.id !== id)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
  .title {
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    font-weight: 700;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 20%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      div {
        width: 80%;
        height: 80%;
        background-color: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>

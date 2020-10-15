<template>
  <div class="hm-header">
    <div class="m">
      <div class="left" @click="$router.back()">
        <i v-if="$route.path !== '/login'" class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <slot></slot>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.hm-header {
  height: 40px;
  .m {
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 40px;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ccc;

    display: flex;
    text-align: center;
    align-items: center;

    .left,
    .right {
      width: 30px;
    }

    .center {
      flex: 1;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>

<template>
  <div class="hm-button">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.hm-button {
  height: 50px;
  margin: 20px;
  background-color: #cc4400;
  border-radius: 25px;

  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #fff;
}
</style>

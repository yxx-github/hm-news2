<template>
  <div>
    <!-- 视频 -->
    <div class="video-post" v-if="post.type === 2">
      <div class="title line2">{{post.title}}</div>
      <div class="img">
        <img :src="fixedUrl(post.cover[0].url)" alt>
        <div class="play">
          <i class="iconfont iconshipin"></i>
        </div>
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comments ? post.comments.length : post.comment_length}} 跟帖</span>
      </div>
    </div>
    <!-- 一张图片 -->
    <div class="single-img-post" v-else-if="post.cover.length < 3">
      <div class="left">
        <div class="title line2">{{post.title}}</div>
        <div class="bottom">
          <span>{{post.user.nickname}}</span>
          <span>{{post.comments ? post.comments.length : post.comment_length}} 跟帖</span>
        </div>
      </div>
      <div class="right">
        <img :src="fixedUrl(post.cover[0].url)" alt>
      </div>
    </div>
    <!-- 三张图片 -->
    <div class="multi-img-post" v-else>
      <div class="title line1">{{post.title}}</div>
      <div class="imgs">
        <img :src="fixedUrl(post.cover[0].url)" alt>
        <img :src="fixedUrl(post.cover[1].url)" alt>
        <img :src="fixedUrl(post.cover[2].url)" alt>
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comments ? post.comments.length : post.comment_length}} 跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['post'],
  methods: {
    fixedUrl(url) {
      if (url.startsWith('http')) {
        return url
      } else {
        return this.$axios.defaults.baseURL + url
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 14px;
  line-height: 20px;
}
.bottom {
  span {
    color: #999;
    margin-right: 5px;
  }
}
// 一张图片
.single-img-post {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  .left {
    flex: 1;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right {
    img {
      width: 110px;
      height: 75px;
      object-fit: cover;
    }
  }
}
// 三张图片
.multi-img-post {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .imgs {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    img {
      width: 110px;
      height: 75px;
      object-fit: cover;
    }
  }
}
// 视频
.video-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .img {
    position: relative;
    img {
      width: 340px;
      height: 170px;
      object-fit: cover;
      padding: 10px 0;
    }
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      width: 50px;
      height: 50px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;

      line-height: 50px;
      text-align: center;

      .iconshipin {
        font-size: 30px;
        color: #fff;
      }
    }
  }
}
</style>

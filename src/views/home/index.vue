<template>
  <div class="home-container">
    <!-- 导航栏   导航栏固定定位
  频道列表固定定位 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button to="/search" class="search-btn" icon="search" type="info" size="small" round slot="title">搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!--  频道列表 -->
    <van-tabs class="channel-tabs" animated swipeable v-model="active">
      <van-tab :key="channel.id" v-for="channel in channels" :title="channel.name">
        <!--  文章列表 把频道 -->
        <article-list :channel="channel"></article-list>
        <!--  文章泪飙 -->
      </van-tab>
      <div slot="nav-right" class="placeHolder"></div>
      <div slot="nav-right" @click="showEditChannel" class="hamburger-btn">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!--  home 弹出层 -->
    <van-popup closeable close-icon-position="top-left" position="bottom" :style="{ height: '100%' }" v-model="isChannelEditShow">
      <!--  父子组件传值 youknow  属性绑定 -->
      <channel-edit @update-active="channelChange" :active="active" :mychannels="channels"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArticleList from './components/articlelist'
import ChannelEdit from './components/channeledit'
import { getUserChannels } from '@/api/user'
import { getItem } from '@/utils/storage'
export default {
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadChannels()
  },
  mounted() {},
  watch: {},
  methods: {
    channelChange(index, falg = true) {
      // console.log(index)
      this.active = index
      this.isChannelEditShow = falg
    },
    showEditChannel() {
      this.isChannelEditShow = true
    },
    async loadChannels() {
      try {
        if (this.user) {
          const { data } = await getUserChannels()
          console.log(data)
          this.channels = data.data.channels
        } else {
          const localChannels = getItem('LOCAL_CHANNELS')
          if (localChannels) {
            this.channels = localChannels
          } else {
            // 如果本地存储也没有那么 请求默认的数据泪飙
            const { data } = await getUserChannels()
            console.log(data)
            this.channels = data.data.channels
          }
        }
      } catch (error) {
        console.log(error)
        this.$toast('获取频道列表失败')
      }
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  }
}
</script>

/* 希望scoped样式中的一个选择器作用的更深 影响子组件 /deep/ */
<style scoped lang="less">
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    // .van-tabs_content {
    //   // 百分比单位相对于 父元素
    //   min-height: 79vh;
    // }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      color: #777;
      .van-tab__text {
        font-size: 30px;
      }
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeHolder {
      flex-shrink: 0 !important;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>

<template>
  <!--  把 文章列表放在组件中 这样获取到的每个数据列表都是互相独立的组件 不会干扰, 也会直接刷新出来 不会重新加载
  success-duration 成功的持续时间-->
  <div class="article-list">
    <van-pull-refresh success-duration="1500" :success-text="refreshSuccessText" v-model="ifreFreshLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
        <article-item :article="article" :key="index" v-for="(article, index) in list"></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一次数据的时间戳
      error: false, // 控制列表失败的提示状态
      ifreFreshLoading: false, // 刷新的状态
      refreshSuccessText: ''
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    async onRefresh() {
      // 当下拉刷新的时候会触发looad 请求获取数据  这个数据追加到列表的顶部
      try {
        // if (Math.random() > 0.3) {
        //   JSON.parse('loi')
        // }
        // 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新每次请求最新时间戳
          with_top: 1 // 是否包含置顶文章
        })
        const { results } = data.data
        this.list.unshift(...results)
        this.refreshSuccessText = `刷新成功, 共获取了${results.length}条数据`
        // 关闭下来刷新的loading状态
        this.ifreFreshLoading = false
      } catch (error) {
        // console.log(error)
        this.ifreFreshLoading = false
        this.refreshSuccessText = '刷新失败, 请重试'
      }
    },
    async onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // tiemstamp 请求数据的页码 请求第一页数据 当前最新事件戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回来
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶文章
        })
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          // 更新下一次请求时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了 将finshed 设置为true 不在load加载更多
          this.finished = true
        }
      } catch (error) {
        console.log(error)
        this.$toast('请求失败')
        // 展示错误状态
        this.error = true
        // 请求失败了 loading 也需要关闭
        this.loading = false
      }
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>

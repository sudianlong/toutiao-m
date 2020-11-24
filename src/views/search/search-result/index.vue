<template>
  <div class="search-result">
    <!--  list组件的错误处理 -->
    <van-list :error.sync="error" error-text="加载失败, 请点击重试" v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadSearchResult">
      <van-cell v-for="(item, index) in resultList" :key="index" :title="item.title"> </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  // 组件名称
  name: 'SearchResults',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    // 将搜索建议 传入子组件
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      resultList: [],
      loading: false,
      finished: false,
      page: 1, // 页码请求 完 更新完这个数据 让他加
      perPage: 15,
      error: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.loadSearchResult()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadSearchResult() {
      try {
        const { data } = await getSearchResult({
          page: this.page, // 页码
          q: this.searchText, // 查询关键词
          per_page: this.perPage
        })
        if (Math.random() < 0.3) {
          throw new Error('godluck')
        }
        // console.log(data)
        const { results } = data.data
        this.resultList.push(...results)
        // 加载状态结束
        this.loading = false
        // 判断 请求的results 是否还有数据 如果有 则更新获取下一个数据的页码
        if (results.length) {
          this.page++
        } else {
          // 如果没有, 将加载状态finished 设置为结束
          this.finished = true
        }
      } catch (error) {
        // this.$toast('数据加载失败, 请稍后重试')
        // 展示加载失败 的提示状态
        this.error = true
        // 加载失败了 loading也要关闭
        this.loading = false
        // console.log(error)
      }
    }
    //     onLoad() {
    //       // 异步更新数据
    //        当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true
    //        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //        非加载中，loading为false，此时会根据列表滚动位置判断是否触发load事件（列表内容不足一屏幕时，会直接触发）
    //  加载中，loading为true，表示正在发送异步请求，此时不会触发load事件
    //  加载完成，finished为true，此时不会触发load事件
    //  在每次请求完毕后，需要手动将loading设置为false，表示加载结束
    //       setTimeout(() => {
    //         for (let i = 0; i < 10; i++) {
    //           this.list.push(this.list.length + 1)
    //         }

    //         // 加载状态结束
    //         this.loading = false

    //         // 数据全部加载完成
    //         if (this.list.length >= 40) {
    //           this.finished = true
    //         }
    //       }, 1000)
    //     }
  }
}
</script>

<style scoped lang="less"></style>

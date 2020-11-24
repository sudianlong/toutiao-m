<template>
  <div class="search-container">
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form class="search-form " action="/">
      <van-search @focus="idResultShow = false" v-model="searchText" background="#3296fa" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" />
    </form>

    <!-- 搜索结果 -->
    <search-result :search-text="searchText" v-if="idResultShow"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议  把searchText数据传值到 子组件中 在联想搜索框 中的值如果选中了 在子组件侦听变化 发起请求 响应结果-->
    <search-suggestion @search="onSearch" :search-text="searchText" v-else-if="searchText"></search-suggestion>
    <!--/联想建议 -->
    <!-- 搜索历史纪录 -->
    <search-history @search="onSearch" @clear-history="removeAllHistory" :search-history="searchHistories" v-else></search-history>
    <!-- /搜索历史纪录 -->
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/storage'
import SearchHistory from './search-history'
import SearchSuggestion from './search-suggestion'
import SearchResult from './search-result'
export default {
  // 组件名称
  name: 'SearchIndex',
  // 局部注册的组件
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      searchText: '',
      idResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史默认记录  最新的排在最前面. 不能有历史记录
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    // 论这里用和不用watch的区别?
    // searchHistories(value) {
    //   setItem('TOUTIAO_SEARCH_HISTORIES', value)
    // }
  },
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    removeAllHistory() {
      this.searchHistories = []
    },
    onSearch(val) {
      // 手机端点search 和 键盘回车 触发这个函数 把val传入函数
      // 让 输入框中的内容变为 联想搜索词
      this.searchText = val
      this.idResultShow = true
      // 判断搜索历史记录的数组中是否有这个val值 如果不等于-1 则证明 需要删除在数组中存在的一项 因为存入的都是最新的
      const i = this.searchHistories.indexOf(val)
      if (i !== -1) {
        this.searchHistories.splice(i, 1)
      }
      // 存储 搜索历史记录
      this.searchHistories.unshift(val)
      setItem('TOUTIAO_SEARCH_HISTORIES', this.searchHistories)
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  /deep/ .search-form {
    // background: rgb(50, 150, 250);
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 2;
    right: 0;
    // width: 100%;
  }
}
</style>

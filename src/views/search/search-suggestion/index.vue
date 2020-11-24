<template>
  <div class="search-suggestion">
    <!--  点击cell单元格 通过子父组件传值 发送事件到 父组件 -->
    <van-cell @click="$emit('search', item)" v-for="(item, index) in suggestions" :key="index" icon="search">
      <div slot="title" v-html="hightlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载 : 只会使用到的成员加载好 结果中
import { debounce } from 'lodash'
export default {
  // 组件名称
  name: 'SearchSuggestion',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  // 组件状态值
  data() {
    return {
      suggestions: []
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchText: {
      // 当searchText 发生改变的时候 就会调用handler函数 handler函数是固定的
      // handler(val) {
      //   this.loadSuggestions(val)
      // },
      handler: debounce(function(val) {
        this.loadSuggestions(val)
        console.log(val)
      }, 300),
      // 该回调将会在侦听开始之后立即被调用
      immediate: true
    }
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
    async loadSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
        console.log(data.data.options)
      } catch (error) {
        console.log(error)
      }
    },
    hightlight(text) {
      // 处理text 文字的高亮显示的函数 需要用到 正则 gi
      // 这里不可以写text 改变的不是一个值 而是根据this.text 改变整个 item
      const hightlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 // 中间的内容 都会当作匹配字符来使用 而不是数据变量 如果 需要根据数据变量动态的创建正则表达式
      // 则手动 new RegExp 正则表达式的构造函数
      // 参数1 匹配模式字符串 会根据这个字符串创建正则对象
      // 参数 2 匹配模式 写道字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: red;
  }
}
</style>

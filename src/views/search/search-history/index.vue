<template>
  <div class="search-history">
    <van-cell title="搜索历史" value="内容">
      <!--  默认插槽的位置走到右边  删除和完成图标和 删除图标一样都是iddeleted-->
      <div v-if="isDelteShow">
        <span @click="$emit('clear-history')">全部删除</span>&nbsp;&nbsp;
        <span @click="isDelteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDelteShow = true"></van-icon>
    </van-cell>
    <van-cell @click="onHistoryItemClick(historyItem, index)" :title="historyItem" :key="index" v-for="(historyItem, index) in searchHistory">
      <van-icon name="close" v-show="isDelteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SearchHistory',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    // 父子组件传值  属性绑定的方式 父组件上 :prop='kry' 子组件上 prop上接收
    searchHistory: {
      /* prop 数据 受父组件数据影响的
       如果是普通数据 (数字, 布尔值 , 字符串) 绝对不能修改
      即便修改了也不会传导给父组件
      如果 是引用类型数据 (数组 , 对象) 可以修改 ,如[].push
      不能重新赋值 xx=[] */
      type: Array,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      isDelteShow: false
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
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    onHistoryItemClick(item, i) {
      if (this.isDelteShow) {
        // 如果是 删除图标显示 代表着 现在是删除状态
        this.searchHistory.splice(i, 1)
      } else {
        // 点击搜索历史项直接搜索历史项
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>

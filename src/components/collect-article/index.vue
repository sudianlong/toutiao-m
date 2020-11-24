<template>
  <van-icon @click="onCollect" :loading="collectLoading" :class="{ collected: value }" :name="value ? 'star' : 'star-o'" color="#777" />
</template>

<script>
import { addCollect, deleteCollcet } from '@/api/article'
export default {
  // 组件名称
  name: 'CollectArticle',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Boolean,
      required: true
    },
    artId: {
      // 需是文章id
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      collectLoading: false
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
    async onCollect() {
      this.collectLoading = true
      try {
        if (this.value) {
          // 如果value 为true 则是取消收藏状态
          await deleteCollcet(this.artId)
        } else {
          //  反之亦然
          await addCollect(this.artId)
        }
        this.$emit('input', !this.value)
        //  自定义事件修改数据并不是立即的 需要取反提示
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast('操作失败, 请稍后重试')
      }

      this.collectLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  color: #e26b09 !important;
}
</style>

<template>
  <van-icon @click="onLiked" :loading="loading" :class="{ liked: value === 1 }" :name="value === 1 ? 'good-job' : 'good-job-o'" color="#777" />
</template>
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  // 组件名称
  name: 'LikeArticle',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      // 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 判断value 是否等于 1 即可
      type: Number,
      return: true
    },
    artId: {
      type: [Number, String, Object],
      return: true
    }
  },
  // 组件状态值
  data() {
    return {
      loading: false
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
    async onLiked() {
      // 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 判断value 是否等于 1 即可
      this.loading = true // 转圈圈的提示显示
      let status = -1
      try {
        if (this.value === 1) {
          // 此时点击 则是取消点赞
          await deleteLike(this.artId)
        } else {
          // 反之亦然 则是点赞
          await addLike(this.artId)
          status = 1
        }
        // 将数据发送给 父组件
        this.$emit('input', status)
        //  此时status 是一个单独的变量 较容易判断
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败, 请稍后重试')
      }
      this.loading = false // 关闭转圈圈的提示
    }
  }
}
</script>

<style scoped lang="less">
.liked {
  color: #e5645f !important;
}
</style>

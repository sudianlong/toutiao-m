<template>
  <van-button :loading="loading" @click="onFollow" v-if="isFollowed" class="follow-btn" round size="small">已关注</van-button>
  <van-button @click="onFollow" v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus">关注</van-button>
</template>

<script>
import { addFollower, deleteFollower } from '@/api/user'
export default {
  // 组件名称 需要什么参数 状态 api
  name: 'FollowUser',
  // 局部注册的组件
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是input
  },
  // 组件参数 接收来自父组件的数据
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
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
    async onFollow() {
      // 在发起请求的时候把 loading 变为 loding 变为true 此时不允许再触发点击事件 请求结束 后变为false
      this.loading = true
      try {
        if (this.isFollowed) {
          // 如果是true 代表着已经是 关注执行操作 是取消关注
          await deleteFollower(this.userId)
        } else {
          // y要关注的逻辑
          await addFollower(this.userId)
        }
        // is_followed 是一个状态
        // this.isFollowed = !this.isFollowed
        // this.$emit('input', !this.isFollowed)
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (error) {
        let msg = '操作失败, 请稍后重试'
        if (error.response && error.response.status === 400) {
          msg = '用户不能关注自己'
        }
        this.$toast(msg)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>

<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar left-text="取消" @click-left="$emit('close')" @click-right="onUpdateName" right-text="完成" title="设置个人昵称"> </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field v-model.trim="localName" rows="3" autosize type="textarea" maxlength="7" placeholder="请输入昵称" show-word-limit />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdateName',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      //  v-model 待会就要传值 也要修改值
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      localName: this.value
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
    async onUpdateName() {
      if (!this.localName.length) {
        return this.$toast('昵称不能为空')
      }
      try {
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续时间 默认2s
        })
        await updateUserProfile({
          name: this.localName
        })
        // 更新父组件的 传过来的值
        this.$emit('input', this.localName)
        // 关闭弹框
        this.$emit('close')
        // 提示成功信息
        this.$toast.success('保存成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败, 请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 15px;
}
</style>

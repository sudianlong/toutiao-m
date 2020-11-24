<template>
  <div class="update-birthday">
    <van-datetime-picker @confirm="onConfirm" @cancel="$emit('close')" v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  // 组件名称
  name: 'UpdateBirthdy',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      minDate: new Date(1970, 0, 1), // 最小日期
      maxDate: new Date(),
      currentDate: new Date(this.value) // 双向数据绑定 设置日期选择器的默认值 同步日期选择器的日期
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
    async onConfirm() {
      try {
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续时间 默认2s
        })
        const formatDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        // dayjs(this.currentDate).format(formatDate)
        await updateUserProfile({
          birthday: formatDate
        })
        // 更新父组件的 传过来的值
        this.$emit('input', formatDate)
        // 关闭弹框
        this.$emit('close')
        // 提示成功信息
        this.$toast.success('保存成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败, 请稍后重试')
      }
    },
    onSexChange(picker, value, index) {
      // piker 是piker选择器  value 是选中的值 index 是索引
      this.currentDate = index
    }
  }
}
</script>

<style scoped lang="less"></style>

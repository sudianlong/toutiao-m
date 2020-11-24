<template>
  <div class="update-photo">
    <img ref="img" :src="img" class="img" alt="" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  // 组件名称
  name: 'UpdatePhoto',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    img: {
      type: [String, Object]
    }
  },
  // 组件状态值
  data() {
    return {
      cropper: null
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
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动 查看模式 只能在图片中移动
      dragMode: 'move', // 画布和图片都可以移动 拖动模式
      aspectRatio: 1, // 裁剪区默认正方形 比例
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
      // movable true 默认为true
    })
    // console.log(cropper)
  },
  // 组件方法
  methods: {
    // multipart/form-data 如果接口要求content-type 是 multipart/form-data
    // 则必须传递 Formdata对象
    // 如果接口要求content-type 是application/json 则传递普通JavaScript对象
    onConfirm() {
      // 此方法需要后端支持 获取裁切参数
      // console.log(this.cropper.getData())
      //  纯客户端使用getCroppedCanvas().toBlob 获取裁切对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const formData = new FormData()
        formData.append('photo', blob)
        // updateUserPhoto({
        //   photo: blob
        // })
        const { data } = await updateUserPhoto(formData)
        console.log(data)
        this.$emit('close')
        this.$emit('update-photo', data.data.photo)
        this.$toast('更新成功')
      } catch (error) {
        this.$toast.fail('操作失败, 请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  max-width: 100%;
  display: block;
}
</style>

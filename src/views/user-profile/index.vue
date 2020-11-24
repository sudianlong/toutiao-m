<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" @click-left="$router.back()" left-arrow title="个人信息"> </van-nav-bar>
    <!-- /导航栏 -->

    <!--  个人信息 -->
    <van-cell value="图片" title="头像" @click="$refs.file.click()" is-link>
      <van-image fit="cover" class="avatar" round :src="user.photo" />
      <input type="file" hidden ref="file" @change="onFileChange" />
    </van-cell>
    <van-cell @click="isUpdateNameShow = true" :value="user.name" title="昵称" is-link></van-cell>
    <van-cell @click="isUpdateGenderShow = true" :value="user.gender !== 1 ? '男' : '女'" title="性别" is-link></van-cell>
    <van-cell @click="isUpdateBirthdyShow = true" :value="user.birthday" title="生日" is-link></van-cell>
    <!--  ?个人信息 -->

    <!--  修改昵称的弹出成 -->
    <van-popup v-if="isUpdateNameShow" v-model="isUpdateNameShow" position="bottom" style="height: 100%;">
      <!--  使用v-if 大法 跟随pop组件显示与隐藏将组件销毁和刷新 -->
      <update-name v-model="user.name" @close="isUpdateNameShow = false"></update-name>
    </van-popup>
    <!-- ? 弹出成 -->

    <!--  修改性别的弹出层-->
    <van-popup v-if="isUpdateGenderShow" v-model="isUpdateGenderShow" position="bottom" style="height: 30%;">
      <!--  使用v-if 大法 跟随pop组件显示与隐藏将组件销毁和刷新 -->
      <update-gender @close="isUpdateGenderShow = false" @on-cancel="isUpdateGenderShow = false" v-model="user.gender"></update-gender>
    </van-popup>
    <!-- / 修改性别的弹出层 -->
    <!--  修改生日的弹出层-->
    <van-popup v-if="isUpdateBirthdyShow" v-model="isUpdateBirthdyShow" position="bottom" style="height: 30%;">
      <!--  使用v-if 大法 跟随pop组件显示与隐藏将组件销毁和刷新 -->
      <update-birthday @close="isUpdateBirthdyShow = false" @on-cancel="isUpdateBirthdyShow = false" v-model="user.birthday"> </update-birthday>
    </van-popup>
    <!-- / 修改生日的弹出层 -->

    <!-- 编辑头像 -->
    <!-- 编辑头像弹层 -->
    <van-popup v-model="isUpdatePhotoShow" style="height: 100%" position="bottom">
      <update-photo @update-photo="user.photo = $event" @close="isUpdatePhotoShow = false" :img="img"></update-photo>
    </van-popup>
    <!-- 编辑头像弹层 -->
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  // 组件名称
  name: 'UserFile',
  // 局部注册的组件
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdyShow: false,
      isUpdatePhotoShow: false,
      img: null
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
    this.getUserInfo()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async getUserInfo() {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (error) {
        console.log(error)
        this.$toast.fail('获取用户资料失败! ')
      }
    },
    onFileChange() {
      // 获取文件对象 当选择同一个文件 name 不会触发change事件
      // 弹层不出现那
      // 每次使用完毕清空 value
      const file = this.$refs.file.files[0]
      // 获取blob数据 基于文章对象 获取blob数据
      this.img = window.URL.createObjectURL(file)
      // console.log(imgUrl)
      this.isUpdatePhotoShow = true
      console.log(this.$refs.file.value)
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .van-popup {
    background-color: #f5f7f9;
  }
  .avatar {
    width: 70px;
    height: 70px;
    border: 1px solid #f5f7f9;
  }
}
</style>

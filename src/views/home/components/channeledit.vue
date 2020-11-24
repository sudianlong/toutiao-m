<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">
        我的频道
      </div>
      <van-button @click="isEdit = !isEdit" class="edit-btn" plain type="danger" round size="mini">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item @click="onMyChannelClick(channel, index)" v-for="(channel, index) in mychannels" :key="channel.id">
        <van-icon slot="icon" name="clear" v-show="isEdit && channel.id !== 0"></van-icon>
        <!--   -->
        <span class="text" :class="{ active: index === active }" slot="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>

    <!--  频道推荐 -->
    <van-cell>
      <div slot="title" class="title-text">
        频道推荐
      </div>
      <van-button class="edit-btn" plain type="danger" round size="mini">编辑</van-button>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item @click="onAddChannel(channel)" :key="channel.id" v-for="channel in recommendChannels" icon="plus" :text="channel.name" />
    </van-grid>
    <!--  /频道推荐 -->
  </div>
</template>

<script>
import { setItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    mychannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      allChannels: [],
      isEdit: false,
      fixedChannel: 0,
      nodelChannel: [0]
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      // 数组的find方法 遍历数组 把符合条件的第一个元素返回
      return this.allChannels.filter(channel => {
        return !this.mychannels.find(item => {
          return item.id === channel.id
        })
      })
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  async created() {
    try {
      const { data: res } = await getAllChannels()
      // console.log(res.data.channels)
      this.allChannels = res.data.channels
      console.log(res.data.channels)
    } catch (error) {
      this.$toast('获取失败')
    }
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},

  // 组件方法
  methods: {
    onMyChannelClick(channel, index) {
      //  如果是固定的频道则是不删除
      if (this.nodelChannel.includes(channel.id)) {
        return
      }
      if (this.isEdit) {
        // 编辑状态, 执行删除频道
        // 判断如果 删除的id 比现在所处的active 小 那么active应该减一  删除元素active不会i变
        // 让面板的状态默认等于true
        // 在编辑的时候 传入值 true
        // 在删除的时候 传入fasel
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.mychannels.splice(index, 1)
        // 封装函数
        this.delChannel(channel)
      } else {
        // 切换频道 子父组件传值
        console.log(index)
        this.$emit('update-active', index, false)
      }
    },
    async delChannel(channel) {
      try {
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          // 重新读取代码 存储下数组
          setItem('LOCAL_CHANNELS', this.mychannels)
        }
      } catch (error) {
        this.$toast(error)
      }
    },
    async onAddChannel(channel) {
      console.log(channel)
      this.mychannels.push(channel)
      // 数据的持久化

      // 如果用户存在 则是线上的 需要请求发送到服务器
      try {
        if (this.user) {
          await addUserChannel({
            id: channel.id,
            seq: this.mychannels.length
          })
        } else {
          setItem('LOCAL_CHANNELS', this.mychannels)
        }
      } catch (error) {
        console.log(error)
        this.$toast('获取失败, 请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 90px;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .van-grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #eee;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .my-grid {
    .van-grid-item__icon-wrapper {
      position: unset;
      .van-icon-clear {
        position: absolute;
        right: -8px;
        top: -8px;
        font-size: 30px;
        color: #aaa;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      white-space: nowrap;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
</style>

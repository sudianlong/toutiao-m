<template>
  <!--  是否在初始化时立即执行滚动位置检查 不让list在初始值的时候加载一次 否则会加载两次-->
  <van-list :error="error" error-text="加载失败,请点击重试" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <comment-item :immediate-check="false" @replay-click="$emit('replay-click', $event)" :comment="item" v-for="(item, index) in list" :key="index" />
  </van-list>
</template>

<script>
// import JSONBig from 'json-bigint'
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  // 组件名称
  name: 'CommentList',
  // 局部注册的组件
  components: {
    CommentItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      // 品论类型 a-对文章article的 评论, c 对评论的回复
      type: String,
      validator(value) {
        //  自定义prop 验证 数据
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    },
    list: {
      type: Array,
      default: () => []
      // default: function() {
      //   return []
      // }  数组 对象只能是 function return 方式
    }
  },
  // 组件状态值
  data() {
    return {
      // list: [], 把这个list 数据定义到父组件中 父组件操作list
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10, // 获取的评论数据个数, 不传表示采用后端发送评论个数
      error: false
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
    this.onLoad()
    this.loading = true
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async onLoad() {
      const source = this.source.toString()
      // try {
      //   JSONBig.parse(source).toString()
      //   //   source = source.replace(/\//g, '')
      //   //   source = source.replace(/"/g, '')
      // } catch (error) {
      //   console.log(error)
      // }
      // console.log(source)
      // 异步更新数据
      // 1 请求获取数据 2 将数据添加到列表中 => 3 将loading设置为false => 4判断是否还有数据
      // 有就更新下一页的数据  无 就将finshed设置结束
      try {
        const { data } = await getComments({
          type: this.type, // 品论类型 a-对文章article的 评论, c 对评论的回复
          source: source, // 源id , 文章id或者是品论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit
        })
        // console.log(data)
        this.$emit('load-success', data.data)
        const { results } = data.data
        console.log(results)

        this.list.push(...results)
        //  加载状态转圈圈 设置为false
        this.loading = false

        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (error) {
        console.log(error)
        // 在catch错误里面讲 error 设置为ture  同时阿静 将 loading 设置为false  不转圈圈
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>

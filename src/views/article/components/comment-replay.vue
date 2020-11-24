<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon @click="$emit('close-replay')" slot="left" name="cross"></van-icon>
    </van-nav-bar>
    <div class="srcoll-wrap">
      <!--  当前评论项 -->
      <comment-item :comment="comment"></comment-item>
      <!--  ?当前评论项 -->
      <!--  评论的回复列表 -->
      <van-cell title="全部回复"></van-cell>
      <comment-list type="c" :source="comment.com_id"></comment-list>
      <!--  ?评论的回复列表 -->
    </div>
    <div class="post-wrap">
      <van-button @click="isPostShow = true" class="write-btn" size="small" round>开启喷子模式</van-button>
    </div>
    <!--  发布评论 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" width="30%" position="bottom">
      <comment-post :list="commentList" :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
    <!-- ? 发布评论 -->
  </div>
</template>

<script>
// http://localhost:8080/#/article/139089
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  // 组件名称
  name: 'CommentReplay',
  // 局部注册的组件
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  // 组件参数 接收来自父组件的数据
  props: {
    //  hard
    comment: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      isPostShow: false,
      commentList: []
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
    onPostSuccess(data) {
      // 更新回复的数量关闭坦诚 将最新回复的内容展示到内容的顶部
      this.comment.reply_count++
      // 更新回复的数量
      this.isPostShow = false
      // 关闭弹层
      // data'是字组件传过来的数据
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.srcoll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.write-btn {
  background-color: #ffa;
  width: 60%;
}
.post-wrap {
  position: fixed;
  height: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>

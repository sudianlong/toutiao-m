<template>
  <div class="comment-post">
    <!--  v-model.trim 支持修饰符 -->
    <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="优质评论将会被优先展示" show-word-limit />
    <van-button :disabled="!message.length" :loading="postLoading" @click="postComment" type="primary" size="small" class="post-btn">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    /* target是评论的目标（文章/评论）
    对文章的评论 称为 评论
    对评论的评论 称为 回复 */
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      message: '',
      postLoading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async postComment() {
      // 发表评论
      // 展示toast 效果
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续时间, 默认2000 0表示持续展示不关闭
      })
      try {
        this.postLoading = true
        const { data } = await addComment({
          target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleId ? this.articleId.toString() : null // 非必须 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        console.log(data)
        this.$emit('post-success', data.data)
        this.message = ''
        this.$toast.success('发布成功')
        //  关闭弹层 展示评论的内容  这是父组件的内容
      } catch (error) {
        console.log(error)
        this.$toast.fail('评论失败, 请稍后重试')
      }

      this.postLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    background: #fff;
    &::before {
      display: none;
    }
  }
}
</style>

<template>
  <van-cell class="comment-item">
    <van-image slot="icon" class="avatar" round fit="cover" :src="comment.aut_photo" />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button :loading="commentLoading" @click="onCommentLike" :class="{ liked: comment.is_liking }" class="like-btn" :icon="comment.is_liking ? 'good-job' : 'good-job-o'">
        {{ comment.like_count || '赞' }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime }}</span>
        <!--  把replay 传两层到达父组件中 youknow $event 是为事件对象  拿到该评论的数据-->
        <van-button @click="$emit('replay-click', comment)" class="reply-btn" round>回复 {{ comment.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      commentLoading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCommentLike() {
      try {
        this.commentLoading = true
        // 判断是否为 点赞状态 如果为真则是 取消点赞
        if (this.comment.is_liking) {
          // 取消点赞
          await deleteCommentLike(this.comment.com_id)
          this.comment.like_count--
        } else {
          // 点赞
          await addCommentLike(this.comment.com_id)
          this.comment.like_count++
        }
        this.comment.is_liking = !this.comment.is_liking
        this.$toast(!this.comment.is_liking ? '取消点赞' : '点赞成功')
      } catch (error) {
        // console.log(error)
        this.$toast.fail('操作失败')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
  .van-icon-good-job,
  &.liked {
    color: #e5645f;
  }
}
</style>

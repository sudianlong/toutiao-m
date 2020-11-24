<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条">
      <van-icon @click="$router.back()" slot="left" name="cross" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- 是否关注了该用户 模板中的 $event 则是时间参数
           当我们 传递给子组件的数据 要使用还要修改 传递props  修改自定义事件
           简写方式 在组件上使用 v-model 向组件传一个value 键的prop 自动检测input 事件
              @updata-is_followed="article.is_followed = $event"
           :user-id="article.aut_id" :is-followed="article.is_followed"
           value='article.is_followed
           如果 有多个数据 实现类似于v-model的效果 一个组件上只能是=使用一次v-model-->
          <follow-user v-model="article.is_followed" :user-id="article.aut_id"></follow-user>
          <!-- <van-button :loading="followLoding" @click="onFollow" v-if="article.is_followed" class="follow-btn" round size="small">已关注</van-button>
          <van-button @click="onFollow" v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容  文章都在这个里面 article-content 在这寻找domj节点-->
        <div ref="article-content" class="article-content markdown-body" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 底部区域 -->
        <comment-list :list="commentList" @replay-click="onReplayClick" @load-success="totalCommentCount = $event.total_count" :source="article.art_id"></comment-list>
        <div class="article-bottom">
          <van-button @click="onPostShow = true" class="comment-btn" type="default" round size="small">写评论</van-button>
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <!--  收藏功能  如果任然是 子组件要改 要传-->
          <!-- <van-icon color="#777" name="star-o" /> -->
          <collect-article :art-id="article.art_id" v-model="article.is_collected" class="btn-item"></collect-article>
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <like-article :art-id="article.art_id" class="btn-item" v-model="article.attitude"></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!--  评论的弹出层 -->
        <van-popup closeable position="bottom" v-model="onPostShow">
          <!--  评论组件 -->
          <comment-post @post-success="onPostSuccess" :target="article.art_id"></comment-post>
        </van-popup>
        <!--  /评论的弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <!--  弹出层是烂渲染的 只有在第一次 展示的时候才会渲染里面的内容 之后再关闭和显示
    都是在切换内容的显示和隐藏 -->
    <van-popup position="bottom" style="height: 100%;" v-model="isReplyShow">
      <!--  v-if条件渲染 只有true的时候 渲染元素节点 fasle 不渲染 把他给销毁了他就会重新渲染 对 李老师强 太厉害了-->
      <comment-replay v-if="isReplyShow" @close-replay="isReplyShow = false" :comment="currentComment"></comment-replay>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'

// ImagePreview 是一个函数，调用函数后会直接在页面中展示图片预览界面。 单独加载preiew 组件
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'

import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReplay from './components/comment-replay'

// 指定初始位置
// ImagePreview 支持传入配置对象，并通过 startPosition 选项指定图片的初始位置（索引值）。

// ImagePreview({
//   images: ['https://img.yzcdn.cn/vant/apple-1.jpg', 'https://img.yzcdn.cn/vant/apple-2.jpg'],
//   startPosition: 1, // 起始位置 数组的下标
//   onClose() {
//     // 当关闭的时候 调用这个函数
//   }
// })
export default {
  // 组件名称
  name: 'ArticleIndex',
  // 局部注册的组件
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReplay
  },
  //  provide 给所有的后代组件 提供数据
  // provide 选项允许我们指定我们想要提供给后代组件的数据/方法
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  // 组件参数 接收来自父组件的数据
  props: {
    // 通过prop解耦
    articleId: {
      // 将路由中的动态参数映射到 当前组件的Prop属性中
      // 从列表项点击过来的是 数字 但是通过url地址 过来的是字符串
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      followLoding: false, // m默认是 false状态不 loading
      totalCommentCount: 0,
      onPostShow: false, // 评论的弹出层
      commentList: [],
      isReplyShow: false, // 回复评论
      currentComment: {} // 当前点击回复的平路梦想
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
    this.loadArticle()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    onReplayClick(comment) {
      console.log(comment)
      this.currentComment = comment
      // 显示弹出层
      this.isReplyShow = true
    },
    onPostSuccess(data) {
      // 从评论组件中发送的事件 把data中的数据 插入到评论最新
      this.commentList.unshift(data.new_obj)
      //  关闭弹出层
      this.onPostShow = false
    },
    // async onFollow() {
    //   // 在发起请求的时候把 loading 变为 loding 变为true 此时不允许再触发点击事件 请求结束 后变为false
    //   this.followLoding = true
    //   try {
    //     if (this.article.is_followed) {
    //       // 如果是true 代表着已经是 关注执行操作 是取消关注
    //       await deleteFollower(this.article.aut_id)
    //     } else {
    //       // y要关注的逻辑
    //       await addFollower(this.article.aut_id)
    //     }
    //     // is_followed 是一个状态
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (error) {
    //     let msg = '操作失败, 请稍后重试'
    //     if (error.response && error.response.status === 400) {
    //       msg = '用户不能关注自己'
    //     }
    //     this.$toast(msg)
    //   }
    //   this.followLoding = false
    // },
    async loadArticle() {
      try {
        // 如果 是从重新获取过来的 则让loading 显示loading
        this.loading = true
        //  调用api 发起请求 获取数据
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.3) {
        //   JSON.parse('wperiweporu')
        // }
        //  miao 妙 啊
        console.log(data)
        // 成功获取数据 让loading状态消失 但是失败情况也要关掉loading
        this.article = data.data
        console.log(this.article)
        // 初始化图 点击预览 加了条件判断比较不好处理
        // 文章内容部分都在article-content 中都渲染到了那里 vue 数据驱动视图这件事不是立即的
        // this.$nextTick(() => {
        //   // 箭头函数无参数可以写()或者_
        //   console.log(this.$refs['article-content'])
        // })
        // await this.$nextTick()
        // console.log(this.$refs['article-content'])
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
      } catch (error) {
        console.log(error)
        // 判断响应码是否为 404 如果为404 则是不存在资源 提示相应的显示界面
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
      }
      this.loading = false
    },
    previewImage() {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      console.log(imgs)
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images, // 预览的图片数组
            startPosition: index // 起始位置 数组的下标
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/ .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>

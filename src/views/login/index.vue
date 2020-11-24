<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon @click="$router.back()" slot="left" name="cross" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field type="number" maxlength="11" v-model="user.mobile" :rules="userRules.mobileRule" name="mobile" placeholder="请输入手机号">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field type="number" maxlength="6" v-model="user.code" :rules="userRules.codeRule" name="code" placeholder="请输入验证码">
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time 倒计时时间 -->
          <van-count-down @finish="countdownVisable = false" v-if="countdownVisable" :time="1000 * 10" format="ss s" />
          <van-button v-else @click="onSendsms" native-type="button" class="send-sms-btn" round size="small" type="default">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button native-type="submit" class="login-btn" block type="info">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '18888888888', // 手机号
        code: '246810' // 验证码
      },
      countdownVisable: false,
      //  表单验证 当表单提交的时候 会触发表单的验证如果通过 触发submit事件
      // / 如果验证失败 不会触发submit事件 配置rules y验证规则 忧伤往下
      userRules: {
        mobileRule: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确'
          }
        ],
        codeRule: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSendsms() {
      console.log('onSendsms')
      //  验证手机号还用async await
      try {
        // try 要执行的语句
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败' + err)
      }
      // 验证通过时 让倒计时显示
      // 3 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
        this.countdownVisable = true
      } catch (error) {
        console.log('发送失败' + error)
        this.countdownVisable = false
        if (error.response.status === 429) {
          this.$toast('发送太频繁了, 请稍后再试')
        } else {
          this.$toast('发送失败, 请稍后重试')
        }
      }
    },
    async onSubmit() {
      // 1. 获取表单数据
      // TODO: 2. 表单验证
      this.$toast.loading({
        message: '登录中',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间 默认是2秒
        //  一个新的提示toast会把之前的toast会关闭掉
      })
      // 3. 提交表单请求登录 登录成功后 把返回过来的数据 token 和 refeshtoken 都存到vuex中
      try {
        const { data: res } = await login(this.user)
        console.log(res)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
        //  登录 成功 跳转到原来页面 不严谨? 功能优化的时候
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登录失败，请稍后重试', err)
          this.$toast.fail('登录失败，请稍后重试')
        }
      }

      // 4. 根据请求响应结果处理后续操作
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>

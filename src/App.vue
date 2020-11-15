<template>
  <div id="app">
    <!--  路由的出口 -->
    <router-view />
    <h1>
      河马头条
    </h1>
    <div>
      <span class="icon-dice"></span>
      <van-button type="primary">主要按钮</van-button>
      <van-button type="info">信息按钮</van-button>
      <van-button type="default">默认按钮</van-button>
      <van-button type="warning">警告按钮</van-button>
      <van-button type="danger">危险按钮</van-button>
    </div>
  </div>
</template>
<script>
export default {
  //  建议给每个组件 起个名字
  name: 'App'
}
</script>
<style lang="less"></style>

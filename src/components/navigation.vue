<template>
  <a-menu v-model:selectedKeys="current"
          mode="horizontal"
          :style="{lineHeight: '63px'}">
    <a-menu-item key="/">
      <router-link to="/">
        LOGO图
      </router-link>
    </a-menu-item>
    <a-menu-item key="public">
      <router-link to="/public"><BarcodeOutlined />公开课程</router-link>
    </a-menu-item>
    <a-menu-item key="help">
      <router-link to="/help"><QuestionOutlined />帮助</router-link>
    </a-menu-item>
    <a-menu-item :disabled="true">
      <a-input-search
          v-model:value="value"
          placeholder="程序设计方法学"
          enter-button
          @search="onSearch"
          :style="{ marginTop: '15px', width: '300px' }"
          />
    </a-menu-item>
    <!--如果已经登录，显示头像-->
    <a-sub-menu v-if="isLogin" :style="{float: 'right'}">
      <template v-slot:title>
        <a-badge :count="1"><a-avatar></a-avatar></a-badge>
      </template>
      <a-menu-item-group title="个人信息">
        <a-menu-item key="user">
          <router-link to="/user">个人主页</router-link>
        </a-menu-item>
        <a-menu-item key="user/courses">
          <router-link to="/user/courses">我的课程</router-link>
        </a-menu-item>
      </a-menu-item-group>
      <a-menu-item-group title="其他操作">
        <a-menu-item @click="">
          退出登录
        </a-menu-item>
      </a-menu-item-group>
    </a-sub-menu>
    <!--如果没有登录，显示登录-->
    <a-menu-item v-else :style="{float: 'right'}" key="login">
      <router-link to="/login">登录/注册</router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
import { BarcodeOutlined, QuestionOutlined  } from '@ant-design/icons-vue'

export default {
  name: 'topNavigation',
  components: {
    BarcodeOutlined,
    QuestionOutlined
  },
  data() {
    return {
      current: ['/'],
      value: ''
    }
  },
  methods: {
    onSearch() {

    }
  },
  watch: {
    '$route.path'(newVal) {
      if(newVal.search(/user\/courses/) !== -1)
        this.current = ['user/courses']
      else
        this.current = [newVal.split('/')[1] || '/']
    }
  }
}
</script>
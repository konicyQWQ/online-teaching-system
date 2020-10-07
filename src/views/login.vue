<template>
  <a-row class="background">
    <a-col :span="10">
      <a-card :style="{ background: 'rgba(0, 0, 0, .4)', padding: '36px 72px', height: '400px' }"
              :bordered="false">
        <h1 class="intro-title">在线教育</h1>
        <p class="intro-content">在线教育即e-Learning，或称远程教育、在线学习，现行概念中一般指的是一种基于网络的学习行为，与网络培训概念相似。</p>
      </a-card>
    </a-col>
    <a-col :span="14">
      <a-card :tab-list="tabList"
              :active-tab-key="tabKey"
              @tabChange="key => tabKey = key"
              :style="{ height: '400px' }">
        <component :is="component[tabKey]"></component>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import loginForm from '../components/loginform.vue'
import registerForm from "../components/registerForm.vue";

export default {
  name: 'login',
  data() {
    return {
      tabList: [ {key: 'login', tab: '登录'},
                 {key: 'register', tab: '注册'} ],
      tabKey: 'login',
      component: {
        login: 'loginForm',
        register: 'registerForm'
      }
    }
  },
  components: {
    loginForm,
    registerForm
  }
}
</script>

<style scoped>

.background {
  padding: 100px 244px;
  min-height: 600px;
}

.intro-title {
  color: white;
  font-size: 1.6em;
}

.intro-content {
  color: white;
  font-size: 1.3em;
  font-weight: 300;
}

@media screen and (max-width: 1200px) {
  .background {
    padding: 100px 0;
  }
}

</style>
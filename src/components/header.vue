<template>
  <header>
    <nav :class="['nav', {'nav-active': scrollTop > 0}]">
      <a class="logo"><img src="/logo.png"></a>
      <router-link to="/">学在浙大</router-link>
      <router-link to="/public">公开课程</router-link>
      <router-link to="/help">帮助</router-link>
      <span :style="{ flex: 1 }"></span>
      <a @click="clickLogin" v-if="!token">登录</a>
      <router-link to="/register" v-if="!token">注册</router-link>
      <router-link to="/user" v-if="token">
        <a-avatar :src="StaticPreviewUrl(avatarId, 'user')"/>
      </router-link>
      <router-link v-if="role === Role.administrator" to="/administrator">管理员配置页</router-link>
      <!-- <router-link v-if="role === Role.teacher" @click="router.push(`/teacher/${3180103766}`)">教师主页</router-link> -->
      <router-link v-if="role === Role.teacher" :to="`/teacher/${id}`">教师主页</router-link>
      <a v-if="token" @click="logout">
        <PoweroffOutlined/>
        退出登录</a>
    </nav>
  </header>

  <login v-model:visible="visible"/>
</template>

<script lang="ts">
import {ref, onMounted, toRefs} from 'vue'
import {useStore} from 'vuex'
import login from './login.vue'
import {useRouter} from 'vue-router'
import {PoweroffOutlined} from '@ant-design/icons-vue'
import {message} from 'ant-design-vue'
import {Role} from "../type/user";
import {StaticPreviewUrl} from "../type/file";

export default {
  components: {login, PoweroffOutlined},
  setup() {
    // 滚动事件
    const scrollTop = ref(0)
    onMounted(() => {
      window.addEventListener('scroll', () => {
        scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      })
    })
    // 用户信息
    const store = useStore()
    const router = useRouter()
    const {token, avatarId, role, id} = toRefs(store.state)
    // 登录框处理
    const visible = ref(false)
    const clickLogin = () => visible.value = true
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功!')
      router.push('/')
    }
    return {scrollTop, token, avatarId, visible, clickLogin, logout, StaticPreviewUrl, role, Role, id}
  }
}
</script>

<style scoped lang="scss">
header {
  height: 200px;
  background: url("/header.png") no-repeat top/cover;

  .nav {
    display: flex;
    align-items: center;
    padding: 0 10em;
    position: fixed;
    left: 0;
    right: 0;
    transition: all .3s ease;
    z-index: 10;

    @media screen and (max-width: 800px) {
      padding: 0;
    }

    a {
      line-height: 50px;
      padding: 0 1em;
      border: 3px solid transparent;
      color: white;
      transition: all .3s ease;

      &:hover {
        background: var(--hover-background);
        border-top-color: var(--hover-color);
      }

      &.router-link-active, &.router-link-exact-active {
        border-top-color: var(--choose-color);
      }

      &.logo {
        padding: 0;

        img {
          width: 0;
          height: 50px;
          opacity: 0;
          transition: all .3s ease;
        }
      }
    }

    &:hover, &.nav-active {
      background: #fff;
      box-shadow: var(--shadow);

      a {
        color: #333;
      }
    }

    &.nav-active {
      a.logo {
        padding: 0 1em;

        img {
          width: 50px;
          opacity: 1;
        }
      }
    }
  }
}
</style>
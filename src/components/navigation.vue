<template>
  <nav :class="['nav', {'nav-active': scrollTop > 0}]">
    <a class="logo"><img src="/logo.png"></a>
    <router-link to="/">学在浙大</router-link>
    <router-link to="/public">公开课程</router-link>
    <router-link to="/help">帮助</router-link>
    <span :style="{ flex: 1 }"></span>
    <a @click="handleClickLogin" v-if="token === ''">登录</a>
    <router-link to="/register" v-if="token === ''">注册</router-link>
    <router-link to="/user">
      <a-avatar style="color: #f56a00; background:#f52443"
                class="nav-group"
                :src="avatarID"
                :alt="name"
                v-if="token">
      </a-avatar>
    </router-link>
  </nav>

  <!--登录部分-->
  <login :visible="loginVisible" @close="()=>{ this.loginVisible = false }"/>
</template>

<script>
import { ref, onMounted } from 'vue'
import modal from "./base/modal.vue";
import login from "./login.vue"
import { mapState } from 'vuex'

export default {
  components: {
    modal,
    login
  },
  computed: mapState({
      token: 'token',
      avatarID: (state) => state.user.avatarID,
      name: (state) => state.user.name
  }),
  setup() {
    const scrollTop = ref(0)
    onMounted(() => {
      window.addEventListener('scroll', () => {
        scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      })
    })
    // 登录部分
    const loginVisible = ref(false)
    const handleClickLogin = () => { loginVisible.value = true }
    return { scrollTop, handleClickLogin, loginVisible }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
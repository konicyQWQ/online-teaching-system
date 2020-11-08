<template>
  <Header />
  <main>
    <fade>
      <router-view v-if="isRouterAlive"/>
    </fade>
  </main>
  <Footer />
</template>

<script>
import Header from "./components/header.vue";
import fade from "./components/base/fade.vue"
import Footer from "./components/footer.vue";
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import { provide, ref } from 'vue'

export default {
  components: { Header, fade, Footer },
  setup(props, context) {
    // 网页初始化时，检查token信息
    const store = useStore()
    store.commit('init')
    store.dispatch('loginByToken', { remember: true })
        .then(() => {
          message.success('登录成功')
        })
        .catch((e) => {
          if(e)
            message.error(e)
        })
    // 控制刷新用的
    const isRouterAlive = ref(true)
    const reload = () => {
      isRouterAlive.value = false
      context.$nextTick(() => {
        isRouterAlive.value = true
      })
    }
    provide('reload', reload)
    return { isRouterAlive }
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 2em 0;
  min-height: 600px;
  background: #F6F6F6;
}
</style>

<template>
  <a-config-provider :locale="locale">
    <Header />
    <main>
      <fade>
        <router-view>
      </fade>
    </main>
    <m-footer />
  </a-config-provider>
</template>

<script lang="ts">
import Header from "./components/header.vue";
import fade from "./components/base/fade.vue"
import mFooter from "./components/footer.vue";
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default {
  components: { Header, fade, mFooter },
  setup() {
    // 网页初始化时，检查token信息
    const store = useStore()
    store.commit('init')
    store.dispatch('loginByToken', { remember: true })
        .then(() => {
          message.success('登录成功')
        })
        .catch((e) => {
          if(e)
            message.error(e.toString())
        })
    return {
      locale: zhCN
    }
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

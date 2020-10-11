<template>
  <two-col fixed>
    <template #left>
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </template>
    <template #right>
      <nav-card :tab-list="tabList">
        <template v-slot:title>
          <div style="text-align: center">
            <a-avatar :src="user.avatarID" :size="64" />
            <h3 style="margin-top: .4em">
              {{user.name}}
            </h3>
          </div>
        </template>
      </nav-card>
    </template>
  </two-col>
</template>

<script>
import twoCol from '../components/base/two-col.vue'
import navCard from '../components/base/nav-card.vue'
import { readonly } from 'vue'
import { useStore } from 'vuex'

export default {
  components: { 'two-col': twoCol, 'nav-card': navCard },
  setup() {
    const tabList = readonly([
      {key: 'index', name:'首页'},
      {key: 'courses', name: '我的课程'},
      {key: 'setting', name: '个人信息'}
    ])
    const store = useStore()
    const user = store.state.user
    return { tabList, user }
  }
}
</script>

<style scoped>

</style>
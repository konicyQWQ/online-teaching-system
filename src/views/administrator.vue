<template>
  <twoCol>
    <template #left>
      <fade>
        <router-view></router-view>
      </fade>
    </template>
    <template #right>
      <navCard :tab-list="tabList"/>
    </template>
  </twoCol>
</template>

<script>
import { readonly } from 'vue'
import twoCol from '../components/base/two-col.vue'
import navCard from '../components/base/nav-card.vue'
import fade from "../components/base/fade.vue";

export default {
  components: { twoCol, navCard, fade },
  setup() {
    const tabList = readonly([
      {key: 'courses', name: '课程管理'},
      {key: 'users', name: '用户管理'},
      {key: 'other', name: '系统公告'},
      {key: 'home', name: '主页展示'}
    ])

    return { tabList }
  }
}
</script>
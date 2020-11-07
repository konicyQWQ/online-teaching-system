<template>
  <twoCol fixed>
    <template #left>
      <fade>
        <router-view></router-view>
      </fade>
    </template>
    <template #right>
      <navCard :tab-list="tabList">
        <template #title>

        </template>
        <template #title></template>
      </navCard>
    </template>
  </twoCol>
</template>

<script>
import twoCol from '../components/base/two-col.vue'
import navCard from '../components/base/nav-card.vue'
import { readonly } from 'vue'
import fade from "../components/base/fade.vue";

export default {
  components: { twoCol, navCard, fade },
  setup() {
    const tabList = readonly([
      {key: 'index', name:'首页'},
    ])
    return { tabList }
  }
}
</script>
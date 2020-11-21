<template>
  <twoCol fixed>
    <template #left>
      <fade>
        <router-view></router-view>
      </fade>
    </template>
    <template #right>
      <!-- 控制tablist
      <navCard v-if="role === 3" :tab-list="tabList1">
      </navCard>
      <navCard v-else :tab-list="tabList2">
      </navCard>
      -->
      <navCard :tab-list="tabList1">
      </navCard>
    </template>
  </twoCol>
</template>

<script>
import twoCol from '../components/base/two-col.vue'
import navCard from '../components/base/nav-card.vue'
import fade from "../components/base/fade.vue";
import { readonly, toRefs } from 'vue'
import { useStore } from 'vuex'
import { StaticPreviewUrl } from "../type/file";

export default {
  components: { twoCol, navCard, fade },
  setup() {
    const a = 1
    const tabList1 = readonly([
      {key: 'index', name:'首页'},
      {key: 'courses', name:'开设课程'},
      {key: 'comments', name:'学生评语'}
    ])
    const tabList2 = readonly([
      {key: 'index', name:'首页'},
      {key: 'comments', name:'学生评语'}
    ])
    const store = useStore()
    const { name, avatarId, role} = toRefs(store.state)

    //let id = this.$route.params.id
    //console.log(id)
    return {a,tabList1,tabList2, name, role,avatarId, StaticPreviewUrl}
  }
}
</script>
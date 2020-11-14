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
          <div style="text-align: center">
            <a-avatar :size="64" :src="StaticPreviewUrl(avatarId, 'user')"/>
            <h3 style="margin-top: 1em">{{ name }}</h3>
          </div>
        </template>
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
    const tabList = readonly([
      {key: 'index', name:'首页'},
      {key: 'information', name:'个人资料'},
      {key: 'myCourses', name: '我的课程'},
      {key: 'resetPassword', name: '修改密码'}
    ])
    const store = useStore()
    const { name, avatarId } = toRefs(store.state)
    return { tabList, name, avatarId, StaticPreviewUrl }
  }
}
</script>
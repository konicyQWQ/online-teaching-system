<template>
  <a-layout>
    <a-layout-header :style="{background: 'white', boxShadow: '0px 2px 10px 0 #ddd'}">
      <navigation />
    </a-layout-header>
    <a-layout-content :style="{minHeight: '600px'}">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>
      <m-footer />
    </a-layout-footer>
  </a-layout>
  <a-back-top :visibilityHeight="0"/>
</template>

<script>
import footer from './components/footer.vue'
import navigation from './components/navigation.vue'

export default {
  name: 'App',
  components: { 'm-footer': footer, navigation }
}
</script>

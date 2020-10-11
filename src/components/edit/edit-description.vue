<template>
  <nav-card :router="false" :tabList="tabList">
    <template v-slot:title>
      <h3>
        <EditTwoTone twoToneColor="#eb2f96"/>
        操作面板
      </h3>
    </template>
  </nav-card>
</template>

<script>
import navCard from '../base/nav-card.vue'
import {readonly} from 'vue'
import {EditTwoTone} from '@ant-design/icons-vue'

export default {
  name: 'edit-description',
  components: {
    'nav-card': navCard,
    EditTwoTone
  },
  setup() {
    const tabList = readonly([
      {
        name: '编辑课程信息',
        handleClick: () => {
        }
      }
    ])

    return {tabList}
  }
}
</script>

<style lang="scss" scoped>

</style>
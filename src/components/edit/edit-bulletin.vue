<template>
  <div>
    <nav-card :router="false" :tabList="tabList">
      <template #title>
        <h3>
          <EditTwoTone twoToneColor="#eb2f96"/>操作面板
        </h3>
      </template>
    </nav-card>
    <modal :visible="visible" @close="() => { this.visible = false }">
    </modal>
  </div>
</template>

<script>
import navCard from '../base/nav-card.vue'
import modal from '../base/modal.vue'
import {readonly, ref} from 'vue'
import {EditTwoTone} from '@ant-design/icons-vue'

export default {
  name: 'edit-bulletin',
  components: {
    'nav-card': navCard,
    EditTwoTone,
    modal
  },
  setup() {
    const visible = ref(false)
    const tabList = readonly([
      {
        name: '发布新的公告',
        handleClick: () => {
          visible.value = true
        }
      }
    ])

    return {tabList, visible}
  }
}
</script>

<style lang="scss" scoped>

</style>
<template>
  <div v-if="courseInfo.role in [Role.teacher, Role.administrator, Role.assistant]">
    <nav-card :tab-list="nav" :router="false">
      <template #title>
        <h3><edit-two-tone twotonecolor="#eb2f96"/> 课程操作</h3>
      </template>
    </nav-card>

    <editCourseModal v-model:visible="visible" :course="courseInfo.course"/>
  </div>
</template>

<script>
import editCourseModal from "./editCourseModal.vue";
import navCard from '../../base/nav-card.vue'
import { readonly, inject, ref } from 'vue'
import { EditTwoTone } from '@ant-design/icons-vue'
import { Role } from "../../../type";

export default {
  components: { navCard, editCourseModal, EditTwoTone },
  setup() {
    const courseInfo = inject('courseInfo')
    const visible = ref(false)
    const nav = readonly([
      {
        name: '编辑课程信息',
        handleClick: () => {
          visible.value = true
        }
      }
    ])

    return { nav, courseInfo, visible, Role }
  }
}
</script>

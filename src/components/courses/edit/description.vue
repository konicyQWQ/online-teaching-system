<template>
  <div v-if="notGuestAndStudent(courseInfo.role)">
    <nav-card :tab-list="nav" :router="false">
      <template #title>
        <h3><edit-two-tone twotonecolor="#eb2f96"/> 课程操作</h3>
      </template>
    </nav-card>

    <editCourseModal v-model:visible="visible"/>
  </div>
</template>

<script>
import editCourseModal from "./editCourseModal.vue";
import navCard from '../../base/nav-card.vue'
import { readonly, inject, ref } from 'vue'
import { EditTwoTone } from '@ant-design/icons-vue'
import {Role} from "../../../type/user";
import { notGuestAndStudent } from "../../../type/user";

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

    return { nav, courseInfo, visible, Role, notGuestAndStudent }
  }
}
</script>

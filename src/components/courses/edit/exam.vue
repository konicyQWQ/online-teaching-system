<template>
  <nav-card :tab-list="nav" :router="false" v-if="notGuestAndStudent(courseInfo.role)">
    <template #title>
      <h3><edit-two-tone twotonecolor="#eb2f96"/> 课程操作</h3>
    </template>
  </nav-card>
</template>

<script lang="ts">
import navCard from '../../base/nav-card.vue'
import {readonly, inject} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {notGuestAndStudent} from "../../../type/user";
import {EditTwoTone} from "@ant-design/icons-vue";
import {exportAllExam} from "../../../api/exam";

export default {
  components: {navCard, EditTwoTone},
  setup() {
    const router = useRouter()
    const route = useRoute()
    const courseInfo = inject('courseInfo')
    const nav = readonly([
      {
        name: '新建测试',
        handleClick: () => {
          router.push({ path: '/exam/edit', query: {mode: 'new', courseID: route.params.cid, examId: 0}})
        }
      },
      {
        name: '导出所有测试成绩',
        handleClick: () => {
          exportAllExam(route.params.cid)
        }
      }
    ])
    return {nav, courseInfo, notGuestAndStudent};
  }
}
</script>
<template>
  <a-card class="ant-card-shadow">
    <template #title><h3>所有作业</h3></template>
    <a-table :columns="columns" :data-source="homeworkState.data" :loading="homeworkState.loading" :row-key="record => record.hwId">

    </a-table>
  </a-card>
</template>

<script>
import { computed, inject } from 'vue'
import { Role } from "../../type";

export default {
  setup() {
    const courseInfo = inject('courseInfo');
    const homeworkState = inject('homeworkState')
    const fetchHomeworkData = inject('fetchHomeworkData')
    const columns = computed(() => {
      if(courseInfo.role === Role.student)
        return [
          {dataIndex: 'title', title: '作业名称'}
        ]
      else
        return [
          {dataIndex: 'title', title: '作业名称'}
        ]
    })


    return { columns, homeworkState }
  }
}
</script>
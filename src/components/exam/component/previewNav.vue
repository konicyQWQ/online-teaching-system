<template>
  <a-card class="ant-card-shadow" :loading="state.loading">
    <template #title>
      <h3>考试信息</h3>
    </template>
    <p>学号: {{state.userExam.userInfo.id}}</p>
    <p>姓名: {{state.userExam.userInfo.name}}</p>
    <p>得分: {{state.userExam.userExam.mark}}</p>
  </a-card>
</template>

<script lang="ts">
import {ExamState} from "../exam";
import {inject} from "vue";

export default {
  setup() {
    const state:ExamState = inject('state')

    return {state}
  }
}
</script>
<template>
  <two-col :fixed="true">
    <template #left>
      <a-card class="ant-card-shadow" :loading="state.loading">
        <my-header :header="state.header" :editable="mode==='new' || mode==='edit'"/>
        <question v-for="item in sortedQuestion" :questiondetail="item" :key="item.question ? item.question.questionId : item.questionId" :mode="mode"/>
      </a-card>
    </template>
    <template #right>
      <edit-nav v-if="mode==='new' || mode==='edit'"/>
      <exam-nav v-if="mode==='write'"/>
      <preview-nav v-if="mode==='preview' || mode==='score'"/>
    </template>
  </two-col>
</template>

<script lang="ts">
import twoCol from '../base/two-col.vue'
import {useRoute} from "vue-router";
import {useExam} from "./exam";
import header from "./component/header.vue";
import editNav from "./component/editNav.vue";
import {provide, computed} from 'vue'
import question from "./component/question.vue";
import examNav from "./component/examNav.vue";
import previewNav from "./component/previewNav.vue";

export default {
  components: {twoCol, myHeader: header, editNav, question, examNav, previewNav},
  setup() {
    const route = useRoute()
    const courseID = route.query.courseID
    const mode = route.query.mode
    const examId = route.query.examId
    const stuId = route.query.stuId
    const {state, addNewQuestion, fetchData, fetchStuData} = useExam(parseInt(examId), parseInt(courseID), parseInt(stuId))

    if(mode === 'edit' || mode === 'score') {
      fetchData()
    }
    if(mode === 'write' || mode === 'preview') {
      fetchStuData()
    }

    const sortedQuestion = computed(() => {
      return state.questions;
    })

    provide('addNewQuestion', addNewQuestion)
    provide('state', state)
    provide('fetchStuData', fetchStuData)
    provide('fetchData', fetchData)

    return {state, mode, sortedQuestion}
  }
}
</script>
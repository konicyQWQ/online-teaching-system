<template>
  <div>
    <a-card class="ant-card-shadow" :loading="state.loading">
      <template #title>
        <h3>{{ state.header.title }}</h3>
      </template>
      <a-descriptions bordered :column="4">
        <a-descriptions-item label="开始时间">
          {{ moment(state.header.startTime).format('YYYY年MM月DD日 HH:mm:ss') }}
        </a-descriptions-item>
        <a-descriptions-item label="持续时间">
          {{ state.header.duration }} 分钟
        </a-descriptions-item>
        <a-descriptions-item label="总分">
          {{ state.header.maxMark }}
        </a-descriptions-item>
        <a-descriptions-item label="占比">
          {{ state.header.percentage }} %
        </a-descriptions-item>
        <a-descriptions-item label="总人数">
          {{ state.statistics.totalCount }}
        </a-descriptions-item>
        <a-descriptions-item label="开始人数">
          {{ state.statistics.startCount }}
        </a-descriptions-item>
        <a-descriptions-item label="交卷人数">
          {{ state.statistics.finishedCount }}
        </a-descriptions-item>
      </a-descriptions>
      <a-table :columns="examColumns" :data-source="state.questions" style="margin-top: 1em">
        <template #types="{text}">
          <a-tag color="pink" v-if="text === QuestionType.True_False">判断题</a-tag>
          <a-tag color="orange" v-if="text === QuestionType.Fill_In_Blanks">填空题</a-tag>
          <a-tag color="green" v-if="text === QuestionType.Single_Choice">单选题</a-tag>
          <a-tag color="blue" v-if="text === QuestionType.Multi_Choice">多选题</a-tag>
          <a-tag color="purple" v-if="text === QuestionType.Sub_Question">主观题</a-tag>
        </template>
        <template #correct="{text}">
          {{text/state.statistics.finishedCount * 100}}%
        </template>
      </a-table>
    </a-card>
    <a-card class="ant-card-shadow" style="margin-top: 1em">
      <template #title>
        <h3>考试名单</h3>
      </template>
      <a-table :columns="columns" :data-source="state.userExams" :loading="state.loading">
        <template #action="{text, record}">
          <a @click="examScore(record)">批改</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import {useExam} from "../../exam/exam";
import {useRoute, useRouter} from 'vue-router'
import moment from 'moment'
import {readonly} from 'vue'
import {QuestionType} from "../../exam/exam";

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const examId = route.params.examId
    const courseID = route.params.cid

    const {state, fetchData} = useExam(parseInt(examId), parseInt(courseID))
    fetchData()


    const columns = readonly([
      {dataIndex: 'userInfo.id', title: '学号'},
      {dataIndex: 'userInfo.name', title: '姓名'},
      {dataIndex: 'userInfo.phone', title: '手机'},
      {dataIndex: 'userExam.mark', title: '分数'},
      {dataIndex: 'action', title: '操作', slots: {customRender: 'action'}},
    ])

    const examScore = (record) => {
      router.push({
        path: '/exam/edit',
        query: {
          mode: 'score',
          courseID: route.params.cid,
          examId: route.params.examId,
          stuId: record.userInfo.id
        }
      })
    }

    const examColumns = readonly([
      {dataIndex: 'question.questionId', title: '题目'},
      {dataIndex: 'question.type', title: '题目类型', slots: {customRender: 'types'}},
      {dataIndex: 'statistics.averageScore', title: '平均分'},
      {dataIndex: 'statistics.correctCount', title: '正确率', slots: {customRender: 'correct'}}
    ])

    return {state, moment, columns, examScore, examColumns, QuestionType}
  }
}
</script>
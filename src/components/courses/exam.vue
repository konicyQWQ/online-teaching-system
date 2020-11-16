<template>
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>所有考试</h3>
    </template>
    <a-table :loading="state.loading" :columns="columns" :data-source="state.data">
      <template #exam="{text, record}">
        <a @click="gotoExamPage(record)">{{ text }}</a>
      </template>
      <template #percentage="{text}">
        {{ text }} %
      </template>
      <template #time="{text}">
        {{ new Date(text).toLocaleString() }}
      </template>
      <template #duration="{text}">
        {{ text }} 分钟
      </template>
      <template #statistics="{text}">
        {{ text.totalCount }}/{{ text.startCount }}/{{ text.finishedCount }}
      </template>
      <template #status="{text, record}">
        <a-tag v-if="text === 0">未开始</a-tag>
        <a-tag v-else-if="text === 1" color="green">正在进行</a-tag>
        <a-tag v-else color="red">已结束</a-tag>
      </template>
      <template #action="{text, record}">
        <a @click="gotoExamPage(record)">{{record.exam.status===0 ? '编辑' : record.exam.status === 2 ? '批改' : '编辑'}}</a>
        <confirm-delete @confirm="confirmDelExam(record)"/>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import {inject, computed} from 'vue'
import {notGuestAndStudent} from "../../type/user";
import {AllExamState} from "../exam/exam";
import {useRoute, useRouter} from "vue-router";
import confirmDelete from "../base/confirmDelete.vue";
import {message} from "ant-design-vue";
import {delExam} from "../../api/exam";

export default {
  components: {confirmDelete},
  setup() {
    const courseInfo = inject('courseInfo')
    const state: AllExamState = inject('examState')
    const fetchData = inject('fetchExamData')
    fetchData()

    const router = useRouter()
    const route = useRoute()
    const columns = computed(() => {
      if (notGuestAndStudent(courseInfo.role)) {
        return [
          {dataIndex: 'exam.title', title: '测试名称', slots: {customRender: 'exam'}},
          {dataIndex: 'exam.maxMark', title: '总分'},
          {dataIndex: 'exam.percentage', title: '占比', slots: {customRender: 'percentage'}},
          {dataIndex: 'exam.startTime', title: '开始时间', slots: {customRender: 'time'}},
          {dataIndex: 'exam.duration', title: '考试时长', slots: {customRender: 'duration'}},
          {dataIndex: 'statistics', title: '总共/开始/提交人数', slots: {customRender: 'statistics'}},
          {dataIndex: 'exam.status', title: '状态', slots: {customRender: 'status'}},
          {dataIndex: 'action', title: '操作', slots: {customRender: 'action'}}
        ]
      } else {
        return [
          {dataIndex: 'exam.title', title: '测试名称', slots: {customRender: 'exam'}},
          {dataIndex: 'exam.maxMark', title: '总分'},
          {dataIndex: 'exam.percentage', title: '占比', slots: {customRender: 'percentage'}},
          {dataIndex: 'exam.startTime', title: '开始时间', slots: {customRender: 'time'}},
          {dataIndex: 'exam.duration', title: '考试时长', slots: {customRender: 'duration'}},
          {dataIndex: 'userExam.mark', title: '得分'},
          {dataIndex: 'exam.status', title: '状态', slots: {customRender: 'status'}},
        ]
      }
    })

    function modifyExam(record) {
      if (record.exam.status === 1 || record.exam.status === 2) {
        message.error('考试已经开始或结束，无法编辑!')
      } else {
        router.push({
          path: '/exam/edit',
          query: {
            mode: 'edit',
            courseID: route.params.cid,
            examId: record.exam.examId
          }
        })
      }
    }

    async function confirmDelExam(record) {
      try {
        await delExam(record.exam.examId)
        fetchData()
        message.success('删除成功')
      } catch (e) {
        message.error(e)
      }
    }

    function gotoExamPage(record) {
      if (notGuestAndStudent(courseInfo.role)) {
        if(record.exam.status !== 2) {
          modifyExam(record)
        } else if(record.exam.status === 2) {
          router.push(`exam/${record.exam.examId}`)
        }
      } else {
        if(record.exam.status === 1) {
          router.push({
            path: '/exam/edit',
            query: {
              mode: 'write',
              courseID: route.params.cid,
              examId: record.exam.examId
            }
          })
        } else if(record.exam.status === 2) {
          router.push({
            path: '/exam/edit',
            query: {
              mode: 'preview',
              courseID: route.params.cid,
              examId: record.exam.examId
            }
          })
        } else {
          message.error('测试还未开始!')
        }
      }
    }

    return {courseInfo, state, columns, confirmDelExam, modifyExam, gotoExamPage}
  }
}
</script>
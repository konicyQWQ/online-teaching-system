<template>
  <a-card class="ant-card-shadow">
    <template #title><h3>所有作业</h3></template>
    <a-table :columns="columns" :data-source="homeworkState.data" :loading="homeworkState.loading"
             :row-key="record => record.homework.hwId">
      <template #hwTitle="{ text, record }">
        <router-link :to="`homework/${record.homework.hwId}`">{{ text }}</router-link>
      </template>
      <template #time="{ text, record }">
        {{ moment(text).format('YYYY年MM月DD日 HH:mm:ss') }}
      </template>
      <template #myMark="{ text, record }">
        {{ text || '0' }}
      </template>
      <template #isSubmit="{ text, record }">
        <a-tag v-if="text === null">
          未提交
        </a-tag>
        <a-tag v-else color="#87d068">
          已提交
        </a-tag>
      </template>
      <template #statistics="{ text, record }">
        {{ record.statistics.totalCount }} / {{ record.statistics.submitCount }} /
        {{ record.statistics.totalCount - record.statistics.submitCount }}
      </template>
      <template #status="{ text, record }">
        <a-tag v-if="text===HomeworkStatus.pending">
          未开始
        </a-tag>
        <a-tag v-else-if="text===HomeworkStatus.finished" color="#f50">
          已结束
        </a-tag>
        <a-tag v-else color="#108ee9">
          进行中
        </a-tag>
      </template>
      <template #type="{text, record}">
        {{text === HomeworkType.individual ? '个人作业' : '小组作业'}}
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import {computed, inject} from 'vue'
import {Role} from "../../type/user";
import moment from 'moment'
import {useRoute} from 'vue-router'
import {HomeworkStatus, HomeworkType} from "../../type/homework";

export default {
  setup() {
    const courseInfo = inject('courseInfo');
    const homeworkState = inject('homeworkState')
    const fetchData = inject('fetchHomeworkData')

    fetchData();

    const route = useRoute()
    const columns = computed(() => {
      if (courseInfo.role === Role.student)
        return [
          {dataIndex: 'homework.title', title: '作业名称', slots: {customRender: 'hwTitle'}},
          {dataIndex: 'homework.endTime', title: '截止日期', slots: {customRender: 'time'}},
          {dataIndex: 'homework.totalMark', title: '总分'},
          {dataIndex: 'homework.type', title: '作业类型', slots: {customRender: 'type'}},
          {dataIndex: 'userHomework.mark', title: '我的得分', slots: {customRender: 'myMark'}},
          {dataIndex: 'userHomework', title: '是否提交', slots: {customRender: 'isSubmit'}},
          {dataIndex: 'homework.status', title: '状态', slots: {customRender: 'status'}}
        ]
      else
        return [
          {dataIndex: 'homework.title', title: '作业名称', slots: {customRender: 'hwTitle'}},
          {dataIndex: 'homework.endTime', title: '截止日期', slots: {customRender: 'time'}},
          {dataIndex: 'homework.totalMark', title: '总分'},
          {dataIndex: 'homework.type', title: '作业类型', slots: {customRender: 'type'}},
          {dataIndex: 'statistics', title: '总共/已交/未交', slots: {customRender: 'statistics'}},
          {dataIndex: 'statistics.scoredCount', title: '已批阅人数'},
          {dataIndex: 'homework.status', title: '状态', slots: {customRender: 'status'}}
        ]
    })

    return {columns, homeworkState, moment, route, HomeworkStatus, HomeworkType}
  }
}
</script>
<template>
  <div>
    <a-card class="ant-card-shadow">
      <template #title>
        <h3>学生提交作业列表</h3>
      </template>
      <a-table :columns="columns" :data-source="state.data.stuHomeworkList" :loading="state.loading">
        <template #mark="{ text, record }">
          {{ text ? text.mark || '未打分' : '未提交' }}
        </template>
        <template #action="{ text, record }">
          <div v-if="record.userHomework">
            <a @click="openModal(record)">打分</a>
          </div>
        </template>
      </a-table>
    </a-card>

    <modal v-model:visible="visible">
      <a-card style="width: 1000px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px', padding: '0' }">
        <a-row>
          <a-col :span="12">
            <a-card :title="`${nowStudentHomework.userInfo.name}提交的作业`" :bordered="false">
              <p>{{ nowStudentHomework.userHomework.description }}</p>
              <show-file :files="nowStudentHomework.files" :can-download="true" :download-file-fun="downloadUrl"/>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="批改" :bordered="false">
              <create-form :model="model" :fields="fields" :form="form">
                <template #score>
                  <a-input-number v-model:value="model.score" :min="0" :max="state.data.homework.homework.totalMark"/>
                  <a-divider type="vertical" />
                  <a-tag color="red" @click="() => model.score=0.6 * state.data.homework.homework.totalMark">及格</a-tag>
                  <a-tag color="orange" @click="() => model.score=0.7 * state.data.homework.homework.totalMark">中等</a-tag>
                  <a-tag color="blue" @click="() => model.score=0.8 * state.data.homework.homework.totalMark">良好</a-tag>
                  <a-tag color="purple" @click="() => model.score=0.9 * state.data.homework.homework.totalMark">优秀</a-tag>
                  <a-tag color="green" @click="() => model.score=1 * state.data.homework.homework.totalMark">满分</a-tag>
                </template>
              </create-form>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </modal>
  </div>
</template>

<script>
import { inject, reactive, readonly, ref } from 'vue'
import modal from "../../base/modal.vue";
import createForm from "../../base/createForm.vue";
import { StudentHomeworkDownloadUrl } from "../../../type/file";
import { useRoute } from 'vue-router'
import showFile from "../../base/showFile.vue";
import { message } from 'ant-design-vue'
import { setScoreHomework } from "../../../api/homework";
import {CommentField} from "../../../type/homework";

export default {
  name: "studentList",
  components: { modal, createForm, showFile },
  setup() {
    const state = inject('oneHomeworkState');
    const fetchData = inject('oneHomeworkFetchData')
    const route = useRoute()
    const columns = readonly([
      {dataIndex: 'userInfo.id', title: '学号'},
      {dataIndex: 'userInfo.name', title: '姓名'},
      {dataIndex: 'userHomework', title: '分数', slots: { customRender: 'mark' }},
      {dataIndex: 'action', title: '操作', slots: { customRender: 'action' }}
    ])

    const visible = ref(false)
    const openModal = (record) => {
      Object.assign(nowStudentHomework, record)
      model.score = record.userHomework.mark
      model.comment = record.userHomework.comment
      downloadUrl.value = StudentHomeworkDownloadUrl.bind(null, nowStudentHomework.userInfo.id, route.params.hwID)
      visible.value = true
    }

    const nowStudentHomework = reactive({ userInfo: {}, userHomework: {}, files: [] })
    const downloadUrl = ref(null)
    const model = reactive({
      score: 0,
      comment: ''
    })
    const form = reactive({
      submitHint: '批改',
      finish: async () => {
        try {
          await setScoreHomework({
            stuID: nowStudentHomework.userInfo.id,
            hwID: route.params.hwID,
            ...model
          })
          fetchData()
          message.success('批改成功')
          visible.value = false
        } catch (e) {
          message.error(e)
        }
      },
      cancel: () => {
        visible.value = false
      }
    })
    const fields = reactive({
      score: {
        label: '分数',
        customRender: { slot: 'score' }
      },
      comment: CommentField
    })

    return { state, columns, visible, openModal, model, form, fields, nowStudentHomework, downloadUrl }
  }
}
</script>
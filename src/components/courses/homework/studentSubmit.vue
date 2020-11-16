<template>
  <a-card class="ant-card-shadow" :loading="state.loading">
    <template #title><h3>提交作业</h3></template>
    <create-form :model="model" :form="form" :fields="fields"/>
  </a-card>
</template>

<script lang="ts">
import createForm from "../../base/createForm.vue";
import { reactive, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HomeworkUploadUrl, HomeworkUploadName, HomeworkUploadData } from "../../../type/file";
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { submitHomework } from "../../../api/homework";
import {HomeworkState_State} from "../../../hooks/homework";

export default {
  name: "studentSubmit",
  components: { createForm },
  setup() {
    const route = useRoute()
    const fetchData = inject('oneHomeworkFetchData')
    const state:HomeworkState_State = inject('oneHomeworkState')
    const store = useStore()
    watch(() => state.loading, (newVal) => {
      if(newVal === false) {
        if(state.data.userHomework.userHomework) {
          model.description = state.data.userHomework.userHomework.description
          model.files = state.data.userHomework.files.map(value => {
            return {
              uid: value.id,
              name: value.name,
              status: 'done',
              response: {
                fileList: [{id: value.id}]
              },
            }
          })
        }
      }
    })
    const model = reactive({
      hwId: route.params.hwID,
      description: '',
      files: []
    })
    const fields = reactive({
      description: {
        type: 'textarea',
        label: '内容'
      },
      files: {
        type: 'upload',
        label: '附件',
        file: {
          multiple: true,
          name: HomeworkUploadName,
          action: HomeworkUploadUrl,
          data: HomeworkUploadData(route.params.cid, store.state.token)
        }
      }
    })
    const form = reactive({
      canSubmit: new Date() < new Date(state.data.homework.homework.endTime) && new Date() > new Date(state.data.homework.homework.startTime),
      submitHint: new Date() < new Date(state.data.homework.homework.startTime) ? '作业未开始' : new Date() < new Date(state.data.homework.homework.endTime) ? '提交' : '作业已结束',
      finish: async () => {
        console.log(model)
        try {
          await submitHomework({
            userHomework: {
              ...model,
              files: ''
            },
            files: model.files.map(value => value.response.fileList[0].id)
          })
          fetchData()
          message.success('提交成功')
        } catch (e) {
          message.error(e.toString())
        }
      }
    })

    return { model, fields, form, state }
  }
}
</script>
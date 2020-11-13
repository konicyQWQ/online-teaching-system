<template>
  <div>
    <div v-if="[Role.teacher, Role.administrator, Role.assistant].indexOf(courseInfo.role) !== -1">
      <nav-card :tab-list="nav" :router="false">
        <template #title>
          <h3><edit-two-tone twotonecolor="#eb2f96"/> 课程作业</h3>
        </template>
      </nav-card>
    </div>

    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">发布作业</h3></template>
        <create-form :model="model" :form="form" :fields="fields">
          <template #time>
            <a-range-picker
                v-model:value="model.time"
                :disabled-date="disabledDate"
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }"
                format="YYYY-MM-DD HH:mm:ss"
            />
          </template>
        </create-form>
      </a-card>
    </modal>
  </div>
</template>

<script>
import navCard from '../../base/nav-card.vue'
import modal from "../../base/modal.vue";
import {EditTwoTone} from "@ant-design/icons-vue";
import {inject, readonly, ref, reactive} from "vue";
import {Role} from "../../../type";
import createForm from "../../base/createForm.vue";
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { message } from "ant-design-vue";
import { uploadCoursewareName, uploadCoursewareUrl } from "../../../api/courseware";
import moment from 'moment'
import { addNewHomework } from "../../../api/homework";

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export default {
  components: { navCard, modal, EditTwoTone, createForm },
  setup() {
    const courseInfo = inject('courseInfo')
    const fetchHomeworkData = inject('fetchHomeworkData')
    const route = useRoute()
    const store = useStore()
    const nav = readonly([
      {
        name: '发布作业',
        handleClick: () => {
          visible.value = true
        }
      }
    ])

    const visible = ref(false)
    const model = reactive({
      courseId: route.params.cid,
      title: '',
      startTime: null,
      endTime: null,
      time: [],
      content: '',
      totalMark: 100,
      percentage: 0,
      files: []
    })
    const fields = reactive({
      title: {
        type: 'input',
        label: '标题',
        rule: {
          required: true,
          message: '标题必须填写'
        }
      },
      content: {
        type: 'textarea',
        label: '描述'
      },
      time: {
        customRender: { slot: 'time' },
        label: '日期',
        rule: {
          required: true,
          message: '必须填写日期'
        }
      },
      totalMark: {
        type: 'number',
        label: '总分',
        min: 0,
        max: 999
      },
      percentage: {
        type: 'number',
        label: '占比',
        min: 0,
        max: 100
      },
      files: {
        type: 'upload',
        label: '附件',
        file: {
          multiple: true,
          name: uploadCoursewareName,
          action: uploadCoursewareUrl,
          data: {
            courseId: route.params.cid,
            token: store.state.token
          }
        }
      }
    })
    const form = reactive({
      submitHint: '发布',
      finish: async () => {
        try {
          model.startTime = model.time[0].toJSON()
          model.endTime = model.time[1].toJSON()
          await addNewHomework({
            homework: {
              ...model,
              time: '',
              files: ''
            },
            files: model.files.map(value => value.response.fileList[0].id)
          })
          message.success('创建成功')
          visible.value = false
          fetchHomeworkData()
        } catch (e) {
          message.error(e)
        }
      },
      cancel: () => {
        visible.value = false
      }
    })

    const disabledDate = (current) => {
      return current && current <= moment().subtract(1, "days");
    }

    return { nav, Role, courseInfo, visible, model, fields, form, moment, disabledDate }
  }
}
</script>
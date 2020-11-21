<template>
  <div>
    <div v-if="[Role.teacher, Role.administrator, Role.assistant].indexOf(courseInfo.role) !== -1">
      <nav-card :tab-list="nav" :router="false">
        <template #title>
          <h3>
            <edit-two-tone twotonecolor="#eb2f96"/>
            课程作业
          </h3>
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
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
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
import {Role} from "../../../type/user";
import createForm from "../../base/createForm.vue";
import {useRoute} from 'vue-router'
import {useStore} from 'vuex'
import {message} from "ant-design-vue";
import moment from 'moment'
import {addNewHomework, exportAllHomework} from "../../../api/homework";
import {HomeworkFileField, HWContentField, HWTitleField, PercentageField, TotalMarkField} from "../../../type/homework";
import {HomeworkUploadData} from "../../../type/file";

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export default {
  components: {navCard, modal, EditTwoTone, createForm},
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
      },
      {
        name: '导出所有作业成绩',
        handleClick: () => {
          exportAllHomework({courseID: route.params.cid})
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
      title: HWTitleField,
      content: HWContentField,
      time: {
        customRender: {slot: 'time'},
        label: '日期'
      },
      totalMark: TotalMarkField,
      percentage: PercentageField,
      files: {
        ...HomeworkFileField,
        file: {
          ...HomeworkFileField.file,
          data: HomeworkUploadData(parseInt(route.params.cid), store.state.token)
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
      return current && current <= moment().subtract(1, 'day');
    }

    return {nav, Role, courseInfo, visible, model, fields, form, moment, disabledDate}
  }
}
</script>
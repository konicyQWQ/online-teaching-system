<template>
  <div v-if="notGuestAndStudent(courseInfo.role)">
    <nav-card :tab-list="navTab" :router="false">
      <template #title>
        <h3><edit-two-tone twotonecolor="#eb2f96"/> 作业操作</h3>
      </template>
    </nav-card>
    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">编辑作业信息</h3></template>
        <create-form :model="model" :fields="fields" :form="form">
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
import { readonly, ref, reactive, inject } from 'vue'
import {EditTwoTone} from '@ant-design/icons-vue'
import { useHomework, useAllHomework } from "../../../hooks/homework";
import { useRoute, useRouter } from 'vue-router'
import modal from "../../base/modal.vue";
import createForm from "../../base/createForm.vue";
import {
  FileMode,
  HomeworkUploadData, HomeworkDownloadUrl
} from "../../../type/file";
import { useStore } from 'vuex'
import moment from "moment";
import { message } from 'ant-design-vue'
import { modifyHomework, deleteHomework } from "../../../api/homework";
import { notGuestAndStudent } from "../../../type/user";
import {HomeworkFileField, HWContentField, HWTitleField, PercentageField, TotalMarkField} from "../../../type/homework";

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export default {
  name: "content",
  components: { navCard, EditTwoTone, modal, createForm },
  setup() {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const { state, fetchData } = useHomework(route.params.hwID)
    const allHomework = useAllHomework(route.params.cid)
    const courseInfo = inject('courseInfo')

    const navTab = readonly([
      {
        name: '编辑作业信息',
        handleClick: () => {
          Object.assign(model, state.data.homework.homework)
          model.time = [model.startTime , model.endTime]
          model.files = state.data.homework.files.map((value) => {
            return {
              uid: value.id,
              name: value.name,
              status: 'done',
              response: {
                fileList: [{ id: value.id }]
              },
              url: HomeworkDownloadUrl(route.params.hwID, value.id, FileMode.preview)
            }
          })
          visible.value = true
        }
      },
      {
        name: '删除作业',
        handleClick: async () => {
          try {
            await deleteHomework({ hwID: route.params.hwID })
            message.success('删除成功')
            allHomework.fetchData();
            router.back()
          } catch (e) {
            message.error(e);
          }
        },
        confirm: true,
        hint: '删除作业',
        button: 'a'
      }
    ])

    const visible = ref(false)
    const model = reactive({
      hwId: route.params.hwID,
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
        label: '日期',
        rule: {
          required: true,
          message: '必须填写日期'
        }
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
      submitHint: '修改',
      finish: async () => {
        try {
          model.startTime = model.time[0];
          model.endTime = model.time[1];
          await modifyHomework({
            homework: {
              ...model,
              time: '',
              files: ''
            },
            files: model.files.map(value => value.response.fileList[0].id)
          })
          message.success('修改成功')
          fetchData()
          visible.value = false
        } catch (e) {
          message.error(e.toString())
        }
      },
      cancel: () => visible.value = false
    })

    const disabledDate = (current) => {
      return current && current <= moment().subtract(1, "days");
    }

    return { navTab, visible, model, fields, form, disabledDate, moment, courseInfo, notGuestAndStudent }
  }
}
</script>
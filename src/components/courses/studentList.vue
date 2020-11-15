<template>
  <a-card class="ant-card-shadow">
    <template #title><h3>课程名单</h3></template>
    <create-form :model="model" :fields="fields" :form="form"/>
    <a-table :columns="columns" :data-source="state.data" :loadinig="state.loading" :row-key="record => record.id">
      <template #role="{ text }">
        <a-tag color="blue">
          {{
            text === Role.student ? '学生'
                : text === Role.assistant ? '助教'
                : text === Role.teacher ? '老师'
                : text === Role.administrator ? '管理员' : '空'
          }}
        </a-tag>
      </template>
      <template #action="{ text, record }">
        <confirm-delete @confirm="deleteUserFromCourse(record)">删除</confirm-delete>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import {getCourseUser} from "../../api/courses";
import {ref, inject, reactive, readonly} from 'vue'
import {useRoute} from "vue-router";
import {message} from "ant-design-vue";
import createForm from "../base/createForm.vue";
import {Role} from "../../type/user";
import {addToCourses, removeFromCourse} from "../../api/user";
import {useCourseUser} from "../../hooks/courseUser";
import confirmDelete from "../base/confirmDelete.vue";

export default {
  components: {createForm, confirmDelete},
  setup() {
    const userList = ref([])
    const route = useRoute()
    const courseID = route.params.cid
    const courseInfo = inject('courseInfo')
    const loading = ref(true)
    const {state, fetchData} = useCourseUser(courseID)

    getCourseUser({courseID})
        .then(res => {
          userList.value = res
          loading.value = false
        })
        .catch(e => {
          message.error(e)
        })

    // 添加新成员使用
    const model = reactive({
      userID: '',
      userRole: 0,
    })
    const fields = reactive({
      userID: {
        type: 'input',
        label: '学号'
      },
      userRole: {
        type: 'radio',
        label: '身份',
        radios: courseInfo.role === Role.administrator ? [
            {value: Role.student, hint: '学生'},
            {value: Role.assistant, hint: '助教'},
            {value: Role.teacher, hint: '老师'}
        ] : [
          {value: Role.student, hint: '学生'},
          {value: Role.assistant, hint: '助教'},
        ]
      }
    })
    const form = reactive({
      finish: async () => {
        try {
          await addToCourses({userID: model.userID, courseID, role: model.userRole})
          message.success('添加成功')
          fetchData()
        } catch (e) {
          message.error(e)
        }
      },
      layout: 'inline',
      submitHint: '新增'
    })

    // 显示所有成员
    const columns = readonly([
      {dataIndex: 'name', key: 'name', title: '姓名'},
      {dataIndex: 'role', key: 'role', title: '身份', slots: {customRender: 'role'}},
      {dataIndex: 'action', key: 'action', title: '操作', slots: {customRender: 'action'}}
    ])

    // 删除成员
    const deleteUserFromCourse = async (record) => {
      try {
        await removeFromCourse({userID: record.id, courseID})
        message.success('删除成功')
        fetchData()
      } catch (e) {
        message.error(e)
      }
    }

    return {userList, loading, model, fields, form, columns, state, Role, deleteUserFromCourse}
  }
}
</script>

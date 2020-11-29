<template>
  <div>
    <a-card class="ant-card-shadow">
      <template #title>
        <h3>管理所有课程</h3>
      </template>
      <a-button type="primary" @click="openAddModal">
        新建课程
      </a-button>
      <a-table :columns="columns"
               :data-source="state.data"
               :loading="state.loading"
               :pagination="pagination"
               :row-key="(record) => record.course.id"
               @change="handleTableChange">
        <template #teachers="{ text:teachers }">
          <a-tag v-for="teacher in teachers">
            {{ teacher.name }}
          </a-tag>
        </template>
        <template #status="{text}">
          <course-status :status="text"/>
        </template>
        <template #actions="{ text, record }">
          <a type="link" @click="openModifyModal(record)">修改</a>
        </template>
      </a-table>
    </a-card>
    <modal v-model:visible="addModalVisible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">新建课程</h3></template>
        <create-form :model="newCourseModel" :fields="fields" :form="newCourseForm"/>
      </a-card>
    </modal>
    <modal v-model:visible="modifyModalVisible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">修改课程</h3></template>
        <create-form :model="modifyCoursesModel" :fields="fields" :form="modifyForm"/>
      </a-card>
    </modal>
  </div>
</template>

<script lang="ts">
import {reactive, ref, readonly, watch} from 'vue';
import modal from '../base/modal.vue'
import {newCourses, modifyCourses} from "../../api/courses";
import {CourseStatus} from "../../type/course";
import {message} from 'ant-design-vue'
import {useAllCoursesState} from "../../hooks/allCourses";
import courseStatus from "../courses/base/courseStatus.vue";
import createForm from "../base/createForm.vue";
import {
  CourseDescriptionField,
  CourseNameField, IconIdField,
  InstituteField, ScoringMethodField,
  StartTimeField,
  StatusField, TeachersSearchField, TextBookField,
  YearField
} from "../../type/course";

export default {
  components: {modal, createForm, courseStatus},
  setup() {
    // 课程数据显示
    const columns = readonly([
      {dataIndex: 'course.id', title: '课程ID', key: 'id'},
      {dataIndex: 'course.name', title: '课程名字', key: 'name'},
      {dataIndex: 'course.institute', title: '开课学院', key: 'institute'},
      {dataIndex: 'teachers', title: '老师', slots: {customRender: 'teachers'}, key: 'teachers'},
      {dataIndex: 'course.status', title: '开课状态', key: 'status', slots: {customRender: 'status'}},
      {dataIndex: 'course.year', title: '开课学年', key: 'year'},
      {title: '操作', key: 'action', slots: {customRender: 'actions'}}
    ])
    const {state, fetchData} = useAllCoursesState()
    const pagination = reactive({
      pageSize: 10,
      current: 1,
      total: 0
    })
    watch(() => state.totalCount, () => {
      pagination.total = state.totalCount
    })
    const handleTableChange = async (p) => {
      pagination.current = p.current;
      await fetchData({})
    }

    // 修改课程
    const modifyModalVisible = ref(false)
    const modifyCoursesModel = reactive({
      name: '',
      institute: '',
      status: CourseStatus.pending,
      year: 2020,
      startTime: null,
      description: '',
      scoringMethod: '',
      iconId: undefined,
      textbook: '',
      teachers: []
    })
    const openModifyModal = (record) => {
      Object.assign(modifyCoursesModel, record.course)
      modifyCoursesModel.teachers = record.teachers.map((value) => {
        return {
          key: value.id,
          label: `${value.id}:${value.name}`,
          value: value.id
        }
      })
      console.log(modifyCoursesModel.teachers)
      modifyModalVisible.value = true
    }
    const modifyForm = reactive({
      submitHint: '修改',
      finish: async () => {
        try {
          await modifyCourses(modifyCoursesModel, modifyCoursesModel.teachers.map((value) => value.value));
          message.success('修改成功')
          modifyModalVisible.value = false
          await fetchData({})
        } catch (e) {
          message.error(e);
        }
      },
      cancel: () => modifyModalVisible.value = false
    })
    // 添加课程
    const addModalVisible = ref(false)
    const openAddModal = () => addModalVisible.value = true
    const newCourseModel = reactive({
      name: '',
      institute: '',
      status: CourseStatus.pending,
      year: 2020,
      startTime: null,
      description: '',
      scoringMethod: '',
      iconId: null,
      textbook: '',
      teachers: []
    })
    const fields = reactive({
      name: CourseNameField,
      institute: InstituteField,
      status: StatusField,
      teachers: TeachersSearchField,
      year: YearField,
      startTime: StartTimeField,
      description: CourseDescriptionField,
      scoringMethod: ScoringMethodField,
      textbook: TextBookField,
      iconId: IconIdField,
    })
    const newCourseForm = reactive({
      submitHint: '新建',
      finish: async () => {
        try {
          console.log(newCourseModel)
          await newCourses(newCourseModel, modifyCoursesModel.teachers.map((value) => value.value));
          message.success('新建成功')
          addModalVisible.value = false
          await fetchData({})
        } catch (e) {
          message.error(e.toString());
        }
      },
      cancel: () => addModalVisible.value = false
    })

    return {
      columns,
      state,
      pagination,
      handleTableChange,
      addModalVisible,
      newCourseModel,
      fields,
      newCourseForm,
      openAddModal,
      modifyModalVisible,
      openModifyModal,
      modifyForm,
      modifyCoursesModel,
    }
  }
}
</script>
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
               @change="handleTableChange">
        <template #teachers="{ text:teachers }">
          <a-tag v-for="teacher in teachers">
            {{ teacher.name }}
          </a-tag>
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
  components: {modal, createForm},
  setup() {
    // 课程数据显示
    const columns = readonly([
      {dataIndex: 'id', title: '课程ID', key: 'id'},
      {dataIndex: 'name', title: '课程名字', key: 'name'},
      {dataIndex: 'institute', title: '开课学院', key: 'institute'},
      {dataIndex: 'teachers', title: '老师', slots: {customRender: 'teachers'}, key: 'teachers'},
      {dataIndex: 'status', title: '开课状态', key: 'status'},
      {dataIndex: 'year', title: '开课学年', key: 'year'},
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
      await fetchData()
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
      iconId: null,
      textbook: '',
      teachers: ''
    })
    const openModifyModal = (record) => {
      Object.assign(modifyCoursesModel, record)
      modifyCoursesModel.teachers = record.teachers.map((value) => `@${value.name}, ${value.id}`).join(' ');
      modifyCoursesModel.iconId = [{
        response: {
          fileList: [{
            id: modifyCoursesModel.iconId
          }]
        }
      }]
      modifyModalVisible.value = true
    }
    const modifyForm = reactive({
      submitHint: '修改',
      finish: async () => {
        try {
          let teacherArray = modifyCoursesModel.teachers.split('@').map((value, index) => {
            if (!index) return undefined;
            return value.split(',')[1].trim()
          });
          await modifyCourses({
            ...modifyCoursesModel,
            iconId: typeof newCourseModel.iconId === 'object' && newCourseModel.iconId ? newCourseModel.iconId.response.fileList[0].id : null
          }, teacherArray.slice(1));
          message.success('修改成功')
          modifyModalVisible.value = false
          await fetchData()
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
      teachers: ''
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
          let teacherArray = newCourseModel.teachers.split('@').map((value, index) => {
            if (!index) return undefined;
            return value.split(',')[1].trim()
          });
          await newCourses({
            ...newCourseModel,
            iconId: typeof newCourseModel.iconId === 'object' && newCourseModel.iconId ? newCourseModel.iconId[0].response.fileList[0].id : 'null'
          }, teacherArray.slice(1));
          message.success('新建成功')
          addModalVisible.value = false
          await fetchData()
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
      modifyCoursesModel
    }
  }
}
</script>
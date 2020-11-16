<template>
  <div v-if="notGuestAndStudent(courseInfo.role)">
    <nav-card :tab-list="nav" :router="false">
      <template #title>
        <h3>
          <edit-two-tone twotonecolor="#eb2f96"/>
          课程操作
        </h3>
      </template>
    </nav-card>

    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">编辑课程</h3></template>
        <create-form :model="model" :fields="fields" :form="form"/>
      </a-card>
    </modal>
  </div>
</template>

<script>
import navCard from '../../base/nav-card.vue'
import {readonly, inject, ref, reactive} from 'vue'
import {EditTwoTone} from '@ant-design/icons-vue'
import {Role} from "../../../type/user";
import {notGuestAndStudent} from "../../../type/user";
import createForm from "../../base/createForm.vue";
import modal from "../../base/modal.vue";
import {
  CourseDescriptionField,
  CourseNameField,
  CourseStatus, IconIdField,
  InstituteField, ScoringMethodField, StartTimeField,
  StatusField,
  TeachersSearchField, TextBookField,
  YearField
} from "../../../type/course";
import {modifyCourses} from "../../../api/courses";
import {message} from "ant-design-vue";
import {exportBoth} from "../../../api/exam";
import {useRoute} from 'vue-router'

export default {
  components: {navCard, EditTwoTone, createForm, modal},
  setup() {
    const courseInfo = inject('courseInfo')
    const updateCourse = inject('updateCourse');
    const route = useRoute()
    const visible = ref(false)
    const nav = readonly([
      {
        name: '编辑课程信息',
        handleClick: () => {
          Object.assign(model, courseInfo.course)
          model.teachers = courseInfo.teachers.map((value) => `@${value.name}, ${value.id}`).join(' ');
          visible.value = true
        }
      },
      {
        name: '导出成绩',
        handleClick() {
          exportBoth(route.params.cid);
        }
      }
    ])
    const model = reactive({
      name: '',
      institute: '',
      status: CourseStatus.pending,
      year: 2020,
      startTime: null,
      description: '',
      scoringMethod: '',
      iconId: undefined,
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
    const form = reactive({
      submitHint: '修改',
      finish: async () => {
        try {
          let teacherArray = model.teachers.split('@').map((value, index) => {
            if (!index) return undefined;
            return value.split(',')[1].trim()
          });
          await modifyCourses(model, teacherArray.slice(1));
          message.success('修改成功')
          visible.value = false
          await updateCourse()
        } catch (e) {
          message.error(e);
        }
      },
      cancel: () => visible.value = false
    })

    return {nav, courseInfo, visible, Role, notGuestAndStudent, model, form, fields}
  }
}
</script>

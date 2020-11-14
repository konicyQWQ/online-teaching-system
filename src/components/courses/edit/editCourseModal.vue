<template>
  <modal v-model:visible="visible">
    <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
      <template #title><h3 style="text-align: center">修改课程</h3></template>
      <a-form :model="modifyCoursesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
              @finish="clickModifyCourses">
        <a-form-item label="课程名称" name="name">
          <a-input placeholder="课程名称" v-model:value="modifyCoursesForm.name"/>
        </a-form-item>
        <a-form-item label="开课学院" name="institute">
          <a-input placeholder="开课学院" v-model:value="modifyCoursesForm.institute"/>
        </a-form-item>
        <a-form-item label="课程教师" name="teachers" v-if="teachers">
          <a-mentions v-model:value="modifyTeachers"
                      :loading="loading"
                      @search="onSearch"
                      placeholder="输入 @名字 来搜索教师">
            <a-mentions-option v-for="{ id, name, avatarId } in users" :key="id" :value="`${name},${id}`">
              <a-avatar :src="StaticPreviewUrl(avatarId)" :size="20" style="margin-right: 8px"/>
              <span>{{ id }} : {{ name }}</span>
            </a-mentions-option>
          </a-mentions>
        </a-form-item>
        <a-form-item label="开课状态" name="status">
          <a-radio-group v-model:value="modifyCoursesForm.status">
            <a-radio :value="0">未开课</a-radio>
            <a-radio :value="1">开课</a-radio>
            <a-radio :value="2">课程结束</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="开课学年" name="year">
          <a-input-number v-model:value="modifyCoursesForm.year" :min="2020" :max="2030"/>
        </a-form-item>
        <a-form-item label="开课时间" name="startTime">
          <a-date-picker placeholder="开课时间" v-model:value="modifyCoursesForm.startTime" format="YYYY-MM-DD"/>
        </a-form-item>

        <a-form-item label="课程图片">
          <a-upload v-model:fileList="fileList"
                    :name="StaticUploadName"
                    accept=".jpg,.png,.jpeg"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :action="StaticUploadUrl"
                    @change="fileUploadChange"
                    :before-upload="checkImg">
            <img alt="上传图片" :src="StaticPreviewUrl(modifyCoursesForm.iconId)" style="cursor: pointer; width: 300px;"/>
          </a-upload>
        </a-form-item>

        <a-form-item label="课程简介" name="description">
          <a-textarea v-model:value="modifyCoursesForm.description"/>
        </a-form-item>
        <a-form-item label="评分方法" name="scoringMethod">
          <a-textarea v-model:value="modifyCoursesForm.scoringMethod"/>
        </a-form-item>
        <a-form-item label="参考书" name="textbook">
          <a-textarea v-model:value="modifyCoursesForm.textbook"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button type="primary" :loading="modifySending" html-type="submit">修改</a-button>
          <a-divider type="vertical"/>
          <a-button type="default" @click="closeModifyCoursesModal">关闭</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </modal>
</template>

<script lang="ts">
import {reactive, ref, watch, inject} from "vue";
import {Courses, modifyCourses} from "../../../api/courses";
import {message} from "ant-design-vue";
import modal from '../../base/modal.vue'
import {StaticUploadUrl, StaticUploadName, StaticPreviewUrl} from "../../../type/file";
import {checkImg} from "../../../type/file";

export default {
  name: "editCourseModal",
  components: {modal},
  props: {
    visible: Boolean,
    course: Object,
    teachers: Array
  },
  setup(props, context) {
    const modifyTeachers = ref('')
    const modifySending = ref(false)
    const modifyCoursesForm: Courses = reactive({})
    const courseInfo = inject('courseInfo')
    const updateCourse = inject('updateCourse');

    watch(() => props.course, () => {
      Object.assign(modifyCoursesForm, props.course)
    })

    watch(() => courseInfo, () => {
      Object.assign(modifyCoursesForm, courseInfo.course)
      modifyTeachers.value = courseInfo.teachers && courseInfo.teachers.map((value) => `@${value.name}, ${value.id}`).join(' ');
    }, {deep: true})

    watch(() => props.teacher, () => {
      modifyTeachers.value = props.teachers && props.teachers.map((value) => `@${value.name}, ${value.id}`).join(' ');
    })

    const clickModifyCourses = async () => {
      try {
        modifySending.value = true
        let teacherArray = modifyTeachers.value.split('@').map((value, index) => {
          if (!index) return undefined;
          return value.split(',')[1].trim()
        });
        await modifyCourses(modifyCoursesForm, teacherArray.slice(1));
        message.success('修改成功');
        updateCourse();
        modifySending.value = false
        closeModifyCoursesModal();
      } catch (e) {
        message.error(e.toString());
      } finally {
        modifySending.value = false
      }
    }
    const closeModifyCoursesModal = () => {
      context.emit('update:visible', false)
    }
    watch(() => props.visible, (val) => {
      context.emit('update:visible', val)
    })

    // 上传头像
    const fileList = ref([])
    const fileUploadChange = (info) => {
      if (info.file.status === 'done') {
        message.success('上传成功')
        console.log(info)
        modifyCoursesForm.iconId = info.file.response.fileList[0].id
      }
      if (info.file.status === 'error') {
        message.error(info.file.response.error)
      }
    }
    return {
      StaticUploadUrl,
      closeModifyCoursesModal,
      clickModifyCourses,
      modifyCoursesForm,
      modifyTeachers,
      modifySending,
      StaticUploadName,
      checkImg,
      StaticPreviewUrl,
      fileList,
      fileUploadChange
    }
  }
}
</script>
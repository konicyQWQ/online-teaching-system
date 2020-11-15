<template>
  <div v-if="notGuestAndStudent(courseInfo.role)">
    <nav-card :router="false" :tab-list="tabList">
      <template #title>
        <h3>
          <edit-two-tone twotonecolor="#eb2f96"/>
          课程操作
        </h3>
      </template>
    </nav-card>
    <keep-alive>
      <modal v-model:visible="modalVisible">
        <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
          <template #title><h3 style="text-align: center">上传课件</h3></template>
          <create-form :model="model" :fields="fields" :form="form"/>
        </a-card>
      </modal>
    </keep-alive>
  </div>
</template>

<script>
import navCard from '../../base/nav-card.vue'
import modal from "../../base/modal.vue";
import {readonly, ref, reactive, inject} from 'vue'
import {useRoute} from 'vue-router'
import {addCourseware} from "../../../api/courseware";
import {UploadOutlined, EditTwoTone} from '@ant-design/icons-vue'
import {useStore} from 'vuex'
import {message} from 'ant-design-vue'
import {Role, notGuestAndStudent} from "../../../type/user";
import createForm from "../../base/createForm.vue";
import {
  CoursewareDescriptionField,
  CoursewareModel,
  CoursewareTitleField,
  FileListField,
  PrivilegeField
} from "../../../type/courseware";
import {CourseDescriptionField} from "../../../type/course";
import {CoursewareUploadData} from "../../../type/file";

export default {
  components: {navCard, modal, UploadOutlined, EditTwoTone, createForm},
  setup() {
    const tabList = readonly([
      {
        name: '上传课件', handleClick: () => {
          modalVisible.value = true
        }
      }
    ])
    const route = useRoute()
    const store = useStore()
    const modalVisible = ref(false)
    const courseInfo = inject('courseInfo')
    const fetchCourseware = inject('fetchCourseware')

    const model = reactive(new CoursewareModel({courseId: parseInt(route.params.cid)}))
    const fields = reactive({
      title: CoursewareTitleField,
      description: CoursewareDescriptionField,
      privilege: PrivilegeField,
      fileList: {
        ...FileListField,
        file: {
          ...FileListField.file,
          data: CoursewareUploadData(parseInt(route.params.cid), store.state.token)
        }
      }
    })
    const form = reactive({
      submitHint: '修改',
      cancel: () => modalVisible.value = false,
      finish: async () => {
        model.fileList = model.fileList.map((value) => {
          return value.response.fileList[0].id;
        })
        try {
          await addCourseware({courseware: model})
          message.success('上传成功')
          fetchCourseware();
          modalVisible.value = false
        } catch (e) {
          message.error(e)
        }
      }
    })

    return {
      tabList, modalVisible, form, courseInfo, Role, route, store, fields, model, notGuestAndStudent
    }
  }
}
</script>
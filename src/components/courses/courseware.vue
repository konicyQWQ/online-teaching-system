<template>
  <a-card class="ant-card-shadow" :loading="coursewareState.loading">
    <template #title>
      <h3>
        <FileTwoTone twoToneColor="#eb2f96"/>
        课件
      </h3>
    </template>
    <collapse>
      <collapse-panel v-for="courseware in coursewareState.coursewares">
        <template #header>
          <span>{{ courseware.title }}</span>
          <span style="float: right">{{ new Date(courseware.time).toLocaleDateString() }}</span>
        </template>
        <p>{{ courseware.description }}</p>
        <div v-if="notGuestAndStudent(courseInfo.role)">
          <a-button type="link" @click="openModifyModal(courseware)">编辑</a-button>
          <a-divider type="vertical"/>
          <confirm-delete @confirm="clickDelete(courseware)"/>
        </div>
        <show-file :files="courseware.fileList"
                   :download-file-fun="CoursewareDownloadUrl.bind(null, courseware.id)"
                   :can-download="courseware.privilege === 0 ? notGuestAndStudent(courseInfo.role) : true"/>
      </collapse-panel>
    </collapse>

    <modal v-model:visible="modalVisible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">修改课件</h3></template>
        <create-form :model="model" :fields="fields" :form="form"/>
      </a-card>
    </modal>
  </a-card>
</template>

<script lang="ts">
import {FileTwoTone, FilePdfTwoTone, DownloadOutlined, EyeOutlined, UploadOutlined} from '@ant-design/icons-vue'
import {inject, reactive, ref} from 'vue'
import {modifyCourseware, deleteCourseware} from "../../api/courseware";
import collapse from "../base/collapse.vue";
import collapsePanel from "../base/collapsePanel.vue";
import {message} from "ant-design-vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import modal from "../base/modal.vue";
import {Role, notGuestAndStudent} from "../../type/user";
import confirmDelete from "../base/confirmDelete.vue";
import createForm from "../base/createForm.vue";
import showFile from "../base/showFile.vue";
import {CoursewareDownloadUrl, CoursewareUploadData} from "../../type/file";
import {
  CoursewareDescriptionField,
  CoursewareModel,
  CoursewareTitleField,
  FileListField,
  PrivilegeField
} from "../../type/courseware";

export default {
  components: {
    FileTwoTone,
    FilePdfTwoTone,
    DownloadOutlined,
    EyeOutlined,
    collapse,
    collapsePanel,
    modal,
    UploadOutlined,
    confirmDelete,
    createForm,
    showFile
  },
  setup() {
    const coursewareState = inject('coursewareState')
    const fetchCourseware = inject('fetchCourseware')
    const courseInfo = inject('courseInfo')
    const route = useRoute()
    const store = useStore()

    fetchCourseware()

    // 删除
    async function clickDelete(courseware) {
      try {
        await deleteCourseware({courseId: parseInt(route.params.cid), coursewareId: courseware.id})
        message.success('删除成功')
        fetchCourseware()
      } catch (e) {
        message.error(e);
      }
    }

    // 修改
    const modalVisible = ref(false)

    function openModifyModal(courseware) {
      modalVisible.value = true
      Object.assign(model, courseware)
      model.fileList = courseware.fileList.map(value => {
        return {
          uid: value.id,
          name: value.name,
          status: 'done',
          response: {
            fileList: [{id: value.id}]
          },
          url: CoursewareDownloadUrl(courseware.id, value.id)
        }
      })
    }

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
          await modifyCourseware({courseware: model})
          message.success('修改成功')
          modalVisible.value = false
          await fetchCourseware();
        } catch (e) {
          message.error(e)
        }
      }
    })

    return {
      coursewareState,
      clickDelete,
      openModifyModal,
      route,
      store,
      courseInfo,
      Role,
      form,
      model,
      fields,
      modalVisible,
      CoursewareDownloadUrl,
      notGuestAndStudent
    }
  }
}
</script>
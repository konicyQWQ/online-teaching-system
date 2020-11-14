<template>
  <a-card class="ant-card-shadow" :loading="coursewareState.loading">
    <template #title>
      <h3><FileTwoTone twoToneColor="#eb2f96"/> 课件</h3>
    </template>
    <collapse>
      <collapse-panel v-for="courseware in coursewareState.coursewares">
        <template #header>
          <span>{{ courseware.courseware.title }}</span>
          <span style="float: right">{{ new Date(courseware.courseware.time).toLocaleDateString() }}</span>
        </template>
        <p>{{courseware.courseware.description}}</p>
        <div v-if="courseInfo.role in [Role.teacher, Role.assistant, Role.administrator]">
          <a-button type="link" @click="openModifyModal(courseware)">编辑</a-button>
          <a-divider type="vertical"/>
          <confirm-delete @confirm="clickDelete(courseware)" />
        </div>
        <a-table :columns="columns" :data-source="courseware.files" :pagination="false">
          <template #name="{ text, record }">
            <FilePdfTwoTone twoToneColor="#eb2f96"/> <a :href="downloadCoursewareUrl(courseware.courseware.id, record.id)" target="_blank">{{text}}</a>
          </template>
          <template #size="{ text }">
            {{ parseInt(text) < 1024 ? `${parseInt(text)}B`
              : parseInt(text) < 1024 * 1024 ? `${parseInt(parseInt(text)/1024)}KB`
                  : `${parseInt(parseInt(text)/1024/1024)}MB` }}
          </template>
          <template #action="{ record }" v-if="courseware.courseware.privilege === 1 || !(courseInfo.role in [Role.guest])">
            <a :href="downloadCoursewareUrl(courseware.courseware.id, record.id, true)" target="_blank" :download="record.name"><DownloadOutlined /></a>
            <a-divider type="vertical"/>
            <a :href="downloadCoursewareUrl(courseware.courseware.id, record.id)" target="_blank"><EyeOutlined /></a>
          </template>
        </a-table>
      </collapse-panel>
    </collapse>

    <modal v-model:visible="modalVisible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">修改课件</h3></template>
        <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="submit">
          <a-form-item label="标题" name="title">
            <a-input v-model:value="form.title"/>
          </a-form-item>
          <a-form-item label="描述" name="description">
            <a-textarea v-model:value="form.description"/>
          </a-form-item>
          <a-form-item label="权限设置" name="privilege">
            <a-radio-group v-model:value="form.privilege">
              <a-radio :value="0">本课程人员可下载</a-radio>
              <a-radio :value="1">游客可下载</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="文件" name="fileList">
            <a-upload v-model:fileList="fileList"
                      :name="uploadCoursewareName"
                      :action="uploadCoursewareUrl"
                      :multiple="true"
                      :beforeUpload="beforeUpload"
                      @change="handleChange"
                      :data="{ token: store.state.token, courseId: route.params.cid }">
              <a-button><UploadOutlined/>点击上传</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" :loading="submitLoading" html-type="submit" :disabled="nowFileUploadingCnt !== 0">修改</a-button>
            <a-divider type="vertical"/>
            <a-button type="default" @click="closeModal">关闭</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </modal>

  </a-card>
</template>

<script lang="ts">
import { FileTwoTone, FilePdfTwoTone, DownloadOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons-vue'
import {inject, reactive, readonly, ref} from 'vue'
import {uploadCoursewareUrl, uploadCoursewareName , modifyCourseware, downloadCoursewareUrl} from "../../api/courseware";
import collapse from "../base/collapse.vue";
import collapsePanel from "../base/collapsePanel.vue";
import { message } from "ant-design-vue";
import { deleteCourseware } from "../../api/courseware";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import modal from "../base/modal.vue";
import { Role } from "../../type/user";
import confirmDelete from "../base/confirmDelete.vue";

export default {
  components: {FileTwoTone, FilePdfTwoTone, DownloadOutlined, EyeOutlined, collapse, collapsePanel, modal, UploadOutlined, confirmDelete},
  setup() {
    const coursewareState = inject('coursewareState')
    const fetchCourseware = inject('fetchCourseware')
    const courseInfo = inject('courseInfo')
    const route = useRoute()
    const store = useStore()

    const columns = readonly([
      {dataIndex: 'name', key: 'name', title: '文件名', slots: {customRender: 'name'}},
      {dataIndex: 'size', key: 'size', title: '文件大小', slots: {customRender: 'size'}},
      {dataIndex: 'action', key: 'action', slots: {customRender: 'action'}, title: '操作'}
    ])

    // 删除
    async function clickDelete(courseware) {
      try {
        await deleteCourseware({ courseId: parseInt(route.params.cid) , coursewareId: courseware.courseware.id })
        message.success('删除成功')
        fetchCourseware()
      } catch (e) {
        message.error(e);
      }
    }

    // 修改
    function openModifyModal(courseware) {
      modalVisible.value = true
      Object.assign(form, courseware.courseware)
      form.fileList = courseware.files.map((value) => {
        return value.id;
      })
      fileList.value = courseware.files.map(value => {
        return {
          uid: value.id,
          name: value.name,
          status: 'done',
          response: {
            fileList: [{ id: value.id }]
          },
          url: downloadCoursewareUrl(courseware.courseware.id, value.id)
        }
      })
    }

    const modalVisible = ref(false)
    const submitLoading = ref(false)
    const closeModal = () => {
      modalVisible.value = false
      nowFileUploadingCnt.value = 0
    }
    const form = reactive({
      title: '',
      description: '',
      time: new Date(),
      privilege: 0,
      courseId: route.params.cid,
      fileList: []
    })
    async function submit() {
      form.fileList = fileList.value.map((value) => {
        return value.response.fileList[0].id;
      })
      submitLoading.value = true
      try {
        await modifyCourseware({ courseware: form })
        message.success('修改成功')
        fetchCourseware();
        closeModal();
      } catch (e) {
        message.error(e.toString())
      } finally {
        submitLoading.value = false
      }
    }

    // 上传文件
    const fileList = ref([])
    const nowFileUploadingCnt = ref(0);
    function beforeUpload() {
      nowFileUploadingCnt.value ++;
    }
    function handleChange(info) {
      if(info.file.status === 'done')
        nowFileUploadingCnt.value --;
      if(info.file.status === 'error') {
        nowFileUploadingCnt.value --;
        message.error('上传文件失败');
      }
    }

    return { coursewareState, columns, downloadCoursewareUrl, clickDelete, openModifyModal, route, store, courseInfo, Role, beforeUpload, nowFileUploadingCnt,
      handleChange, submit, closeModal, form, submitLoading, modalVisible, fileList, uploadCoursewareUrl, uploadCoursewareName }
  }
}
</script>
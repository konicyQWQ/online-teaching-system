<template>
  <div v-if="courseInfo.role in [Role.teacher, Role.administrator, Role.assistant]">
    <nav-card :router="false" :tab-list="tabList">
      <template #title><h3><edit-two-tone twotonecolor="#eb2f96"/> 课程操作</h3></template>
    </nav-card>
    <keep-alive>
      <modal v-model:visible="modalVisible">
        <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
          <template #title><h3 style="text-align: center">上传课件</h3></template>
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
              <a-button type="primary" :loading="submitLoading" html-type="submit" :disabled="nowFileUploadingCnt !== 0">上传</a-button>
              <a-divider type="vertical"/>
              <a-button type="default" @click="closeModal">关闭</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </modal>
    </keep-alive>
  </div>
</template>

<script>
import navCard from '../../base/nav-card.vue'
import modal from "../../base/modal.vue";
import { readonly, ref, reactive, inject } from 'vue'
import { useRoute } from 'vue-router'
import { Role } from "../../../type";
import { uploadCoursewareName, uploadCoursewareUrl, addCourseware } from "../../../api/courseware";
import { UploadOutlined, EditTwoTone } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

export default {
  components: { navCard, modal, UploadOutlined, EditTwoTone },
  setup() {
    const tabList = readonly([
      {name: '上传课件', handleClick: () => {modalVisible.value = true}}
    ])
    const route = useRoute()
    const store = useStore()
    const courseInfo = inject('courseInfo')
    const fetchCourseware = inject('fetchCourseware')
    // 添加课件
    const modalVisible = ref(false)
    const submitLoading = ref(false)
    const closeModal = () => modalVisible.value = false
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
        await addCourseware({ courseware: form })
        message.success('上传成功')
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

    return { tabList, modalVisible, form, submit, courseInfo, Role, route, beforeUpload, nowFileUploadingCnt,
      uploadCoursewareName, uploadCoursewareUrl, fileList, closeModal, submitLoading, handleChange, store }
  }
}
</script>
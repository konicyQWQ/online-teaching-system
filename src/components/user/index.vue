<template>
  <a-card class="ant-card-shadow" :loading="loading">
    <template #title>
      <h3>个人资料</h3>
    </template>
    <template #default>
      <a-form :model="userInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" :rules="rules" @finish="modifyUser">
        <a-form-item label="头像">
          <a-upload v-model:fileList="fileList"
                    :name="uploadName"
                    accept=".jpg,.png,.jpeg"
                    list-type="picture"
                    :show-upload-list="false"
                    :action="uploadUrl"
                    @change="fileUploadChange"
                    :before-upload="beforeUpload">
            <a-avatar :size="64" :src="getFileUrl(userInfo.avatarId)" style="cursor: pointer"/>
          </a-upload>
        </a-form-item>
        <a-form-item label="学号" name="id">
          {{userInfo.id}}
        </a-form-item>
        <a-form-item label="姓名" name="name">
          {{userInfo.name}}
        </a-form-item>
        <a-form-item label="年级" name="grade">
          大学 {{userInfo.grade}} 年级
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="userInfo.gender">
            <a-radio :value="0">男</a-radio>
            <a-radio :value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="userInfo.email"></a-input>
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="userInfo.phone" />
        </a-form-item>
        <a-form-item label="个人简介" name="introduction">
          <a-textarea v-model:value="userInfo.introduction" placeholder="填写你的个人简介"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="modifyLoading">
            修改
          </a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-card>
</template>

<script lang="ts">
import { ref, toRefs, reactive, inject } from 'vue'
import { getUserInfo, User } from "../../api/user";
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { uploadUrl, getFileUrl, uploadName } from "../../type";
import { modifyUserInfo } from "../../api/user";
import { useRouter } from "vue-router";

export default {
  setup() {
    const loading = ref(true)
    const store = useStore()
    const router = useRouter()
    const { token } = toRefs(store.state)
    const userInfo:User = reactive({})
    // 加载用户数据
    async function loadUser() {
      try {
        loading.value = true
        const res = await getUserInfo(token.value)
        Object.assign(userInfo, res)
      } catch (e) {
        message.error(e)
      } finally {
        loading.value = false
      }
    }
    loadUser()
    // 修改用户资料的表单规则
    const rules = reactive({
      phone: [{
        validator: (rule, value) => {
          if(/^\d{11}$/.test(value) === false)
            return Promise.reject('手机格式错误!')
          return Promise.resolve()
        },
        trigger: 'blur'
      }],
      email: [{
        validator: (rule, value) => {
          if(/^\w+@\w+(\.\w+)+$/.test(value) === false)
            return Promise.reject('邮箱格式错误!')
          return Promise.resolve()
        },
        trigger: 'blur'
      }]
    });
    const modifyLoading = ref(false)
    const modifyUser = async () => {
      try {
        modifyLoading.value = true
        const res = await modifyUserInfo(userInfo, token.value);
        message.success(res)
        await loadUser();
        await store.dispatch('loginByToken', { remember: true })
      } catch (e) {
        message.error(e)
      } finally {
        modifyLoading.value = false
      }
    }
    // 上传头像
    const fileList = ref([])
    const fileUploadChange = (info) => {
      if (info.file.status === 'done') {
        message.success('上传成功')
        userInfo.avatarId = info.file.response.fileList[0].id
      }
      if (info.file.status === 'error') {
        message.error(info.file.response.error)
      }
    }
    const beforeUpload = (file) => {
      const isImage =  /image\/.*/.test(file.type);
      if(!isImage) {
        message.error('只能上传图片!')
      }
      const isLt2m = file.size / 1024 / 1024 < 2;
      if(!isLt2m) {
        message.error('大小超过限制(2MB)!');
      }
      return isImage && isLt2m;
    }
    return { loading, userInfo, rules, modifyLoading, modifyUser, fileList, fileUploadChange, uploadUrl, beforeUpload, getFileUrl, uploadName }
  }
}
</script>
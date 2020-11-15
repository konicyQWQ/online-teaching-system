<template>
  <a-card class="ant-card-shadow" :loading="state.loading" :body-style="{ paddingRight: '20em' }">
    <template #title>
      <h3>个人资料</h3>
    </template>
    <create-form :model="model" :form="form" :fields="fields">
      <template #avatar>
        <a-upload v-model:fileList="fileList"
                  :name="StaticUploadName"
                  :action="StaticUploadUrl"
                  accept=".jpg,.png,.jpeg"
                  list-type="picture"
                  :show-upload-list="false"
                  @change="fileUploadChange"
                  :before-upload="checkImg">
          <a-avatar :size="64" :src="StaticPreviewUrl(model.avatarId, 'user')" style="cursor: pointer"/>
        </a-upload>
      </template>
    </create-form>
  </a-card>
</template>

<script lang="ts">
import {ref, reactive, watch} from 'vue'
import {useStore} from 'vuex'
import {message} from 'ant-design-vue'
import {StaticPreviewUrl, StaticUploadName, StaticUploadUrl, checkImgAndSize} from "../../type/file";
import {modifyUserInfo} from "../../api/user";
import createForm from "../base/createForm.vue";
import {useUserInfo} from "../../hooks/user";
import {
  DepartmentField,
  EmailField,
  Gender,
  GenderField,
  GradeField,
  IdField,
  IntroductionField,
  NameField,
  PhoneField
} from "../../type/user";
import {Fields} from "../../type/form";

export default {
  components: {createForm},
  setup() {
    const store = useStore()
    const {state, fetchData} = useUserInfo()

    // 加载完成时，传递这些值给表单
    watch(() => state.loading, (newVal) => {
      if (newVal === false)
        Object.assign(model, state.data)
    })

    const model = reactive({
      avatarId: 0,
      id: 0,
      name: '',
      gender: Gender.male,
      grade: 1,
      phone: '',
      email: '',
      introduction: '',
      department: ''
    })
    const fields: Fields = reactive({
      avatarId: {
        label: '头像',
        customRender: {slot: 'avatar'}
      },
      id: {
        ...IdField,
        disabled: true
      },
      name: {
        ...NameField,
        disabled: true
      },
      department: DepartmentField,
      gender: GenderField,
      grade: GradeField,
      phone: PhoneField,
      email: EmailField,
      introduction: IntroductionField,
    })
    const form = reactive({
      submitHint: '修改',
      finish: async () => {
        try {
          await modifyUserInfo(model);
          await fetchData()
          await store.dispatch('loginByToken', {remember: true})
          message.success('修改成功')
        } catch (e) {
          message.error(e)
        }
      }
    })
    // 上传头像
    const fileList = ref([])
    const fileUploadChange = (info) => {
      if (info.file.status === 'done') {
        message.success('上传成功')
        model.avatarId = info.file.response.fileList[0].id
      }
      if (info.file.status === 'error') {
        message.error(info.file.response.error)
      }
    }
    return {
      state,
      model,
      fields,
      form,
      fileList,
      fileUploadChange,
      StaticPreviewUrl,
      StaticUploadName,
      StaticUploadUrl,
      checkImgAndSize
    }
  }
}
</script>
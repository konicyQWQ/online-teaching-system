<template>
  <a-form :model="model" :rules="rules" :layout="layout" @finish="finish" v-bind="itemLayout">
    <a-form-item v-for="field, name in fields"
                 :label="field.label"
                 :key="field.label"
                 :name="name">
      <a-input v-if="field.type === 'input'" v-model:value="model[name]" :disabled="field.disabled"/>
      <a-input-password v-if="field.type === 'password'" v-model:value="model[name]" :disabled="field.disabled"/>
      <a-input-number v-if="field.type === 'number'" v-model:value="model[name]" :min="field.min" :max="field.max"
                      :disabled="field.disabled"/>
      <a-textarea v-if="field.type === 'textarea'" v-model:value="model[name]" :disabled="field.disabled" autosize/>
      <a-radio-group v-if="field.type === 'radio'" v-model:value="model[name]" :disabled="field.disabled">
        <a-radio v-for="radio in field.radios"
                 :value="radio.value">
          {{ radio.hint }}
        </a-radio>
      </a-radio-group>
      <a-upload v-if="field.type === 'upload'"
                v-model:fileList="model[name]"
                :multiple="field.file.multiple || false"
                :name="field.file.name"
                :action="field.file.action"
                :beforeUpload="CopyFields[name].__FILE.beforeUpload"
                @change="CopyFields[name].__FILE.handleChange"
                :data="field.file.data">
        <a-button>
          <UploadOutlined/>
          点击上传
        </a-button>
      </a-upload>
      <a-upload v-if="field.type === 'avatar'"
                v-model:fileList="CopyFields[name].__AVATAR.fileList"
                :name="StaticUploadName"
                :action="StaticUploadUrl"
                accept=".jpg,.png,.jpeg"
                list-type="picture-card"
                :show-upload-list="false"
                @change="CopyFields[name].__AVATAR.handleChange"
                :before-upload="checkImg">
        <img alt="上传图片"
             :src="StaticPreviewUrl(model[name])"
             style="cursor: pointer; width: 300px;"/>
      </a-upload>
      <a-auto-complete v-if="field.type === 'autocomplete'"
                       v-model:value="model[name]"
                       :data-source="CopyFields[name].__AUTOCOMPLETE.acList"
                       @search="CopyFields[name].__AUTOCOMPLETE.handleSearch">
        {{ field }}
        <template #default>
          <a-input/>
        </template>
      </a-auto-complete>
      <a-date-picker v-if="field.type === 'time'" v-model:value="model[name]" format="YYYY-MM-DD"/>
      <a-mentions v-if="field.type === 'search'"
                  v-model:value="model[name]"
                  :loading="CopyFields[name].__SEARCH.loading"
                  @search="CopyFields[name].__SEARCH.onSearch"
                  :placeholder="field.search.placeholder">
        <a-mentions-option v-for="{ id, name, avatarId } in CopyFields[name].__SEARCH.users" :key="id"
                           :value="`${name},${id}`">
          <a-avatar :src="StaticPreviewUrl(avatarId)" :size="20" style="margin-right: 8px"/>
          <span>{{ id }} : {{ name }}</span>
        </a-mentions-option>
      </a-mentions>
      <slot v-if="field.customRender"
            :name="field.customRender.slot"
            :field="field">
      </slot>
    </a-form-item>
    <a-form-item :wrapper-col="form.layout === 'inline' ? {} : { offset: 4 }">
      <a-button type="primary"
                html-type="submit"
                :loading="submitLoading"
                :disabled="nowFileUploadingCnt !== 0 || form.canSubmit === false">
        {{ form.submitHint || '提交' }}
      </a-button>
      <a-divider type="vertical"/>
      <a-button type="default" @click="form.cancel" v-if="form.cancel">{{ form.cancelHint || '取消' }}</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {PropType, ref, reactive} from 'vue'
import {UploadOutlined} from '@ant-design/icons-vue'
import {message} from "ant-design-vue";
import {Form, Model, Fields} from "../../type/form";
import {StaticUploadUrl, StaticUploadName, checkImgAndSize, StaticPreviewUrl} from "../../type/file";
import debounce from 'lodash.debounce'
import {searchUser} from "../../api/user";
import {Role} from "../../type/user";

export default {
  name: "createForm",
  components: {UploadOutlined},
  props: {
    model: Object as PropType<Model>,
    fields: Object as PropType<Fields>,
    form: Object as PropType<Form>
  },
  setup(props) {
    // 生成规则和文件以及自动补全等需要的函数
    const rules = reactive({})
    const nowFileUploadingCnt = ref(0)
    const CopyFields = reactive({})

    for (let x in props.fields) {
      let field = props.fields[x];
      CopyFields[x] = {};
      // 如果有规则
      if (field.rule) {
        rules[x] = props.fields[x].rule
        if (rules[x].required && !rules[x].validator)
          rules[x].message = `${field.label}不能为空!`
      }
      // 如果有文件
      if (field.type === 'upload') {
        CopyFields[x].__FILE = reactive({
          beforeUpload: () => {
            nowFileUploadingCnt.value++;
            if (field.file.beforeUpload)
              return field.file.beforeUpload()
            return true
          },
          handleChange: (info) => {
            if (info.file.status === 'done') {
              nowFileUploadingCnt.value--;
            }
            if (info.file.status === 'error') {
              nowFileUploadingCnt.value--;
              message.error('上传文件失败');
            }
            if (field.file.onChange)
              field.onChange(info)
          }
        })
      }
      if (field.type === 'autocomplete') {
        CopyFields[x].__AUTOCOMPLETE = reactive({
          acList: [],
          handleSearch: (now) => {
            field.autoComplete.handleSearch.call(this, CopyFields[x].__AUTOCOMPLETE, now)
          }
        })
      }
      if (field.type === 'avatar') {
        CopyFields[x].__AVATAR = reactive({
          fileList: [],
          handleChange: (info) => {
            if (info.file.status === 'done') {
              props.model[x] = info.file.response.fileList[0].id
              message.success('上传成功')
            }
            if (info.file.status === 'error') {
              message.error(info.file.response.error)
            }
            if (field.file.onChange)
              field.file.onChange(info);
          }
        })
      }
      if (field.type === 'search') {
        CopyFields[x].__SEARCH = reactive({
          loading: false,
          users: [],
          searchV: '',
          loadUsers: debounce(async (key) => {
            if (!key) {
              CopyFields[x].__SEARCH.users = []
              return;
            }
            try {
              if (CopyFields[x].__SEARCH.searchV !== key)
                return;
              CopyFields[x].__SEARCH.users = await searchUser({keyword: key, limit: 10, role: field.search.role})
              CopyFields[x].__SEARCH.loading = false
            } catch (e) {
              message.error(e);
            }
          }, 200),
          onSearch: (search) => {
            CopyFields[x].__SEARCH.searchV = search
            CopyFields[x].__SEARCH.loading = !!search
            CopyFields[x].__SEARCH.users = []
            CopyFields[x].__SEARCH.loadUsers(search)
          }
        })
      }
    }

    // 提交函数
    const submitLoading = ref(false)
    const finish = async () => {
      submitLoading.value = true
      try {
        await props.form.finish()
      } catch (e) {

      } finally {
        submitLoading.value = false
      }
    }

    // 布局
    const layout = ref(props.form.layout || 'horizontal')
    const itemLayout = ref(layout.value === 'horizontal' ? {labelCol: {span: 4}, wrapperCol: {span: 20}} : {})

    return {
      rules,
      finish,
      submitLoading,
      layout,
      itemLayout,
      nowFileUploadingCnt,
      CopyFields,
      StaticUploadName,
      StaticUploadUrl,
      checkImgAndSize,
      StaticPreviewUrl
    }
  }
}
</script>
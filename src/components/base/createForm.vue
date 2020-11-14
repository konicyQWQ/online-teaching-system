<template>
  <a-form :model="model" :rules="rules" :layout="layout" @finish="finish" v-bind="itemLayout">
    <a-form-item v-for="field, name in fields"
                 :label="field.label"
                 :key="field.label"
                 :name="name">
      <a-input v-if="field.type === 'input'" v-model:value="model[name]"/>
      <a-input-password v-if="field.type === 'password'" v-model:value="model[name]"/>
      <a-input-number v-if="field.type === 'number'" v-model:value="model[name]" :min="field.min" :max="field.max"/>
      <a-textarea v-if="field.type === 'textarea'" v-model:value="model[name]"/>
      <a-radio-group v-if="field.type === 'radio'" v-model:value="model[name]">
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
      <a-auto-complete v-if="field.type === 'autocomplete'"
                       v-model:value="model[name]"
                       :data-source="CopyFields[name].__AUTOCOMPLETE.acList"
                       @search="CopyFields[name].__AUTOCOMPLETE.handleSearch">
        {{field}}
        <template #default>
          <a-input />
        </template>
      </a-auto-complete>
      <slot v-if="field.customRender"
            :name="field.customRender.slot"
            :field="field">
      </slot>
    </a-form-item>
    <a-form-item :wrapper-col="form.layout === 'inline' ? {} : { offset: 4 }">
      <a-button type="primary"
                html-type="submit"
                :loading="submitLoading"
                :disabled="nowFileUploadingCnt !== 0">{{ form.submitHint || '提交' }}
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
        if(rules[x].required && !rules[x].validator)
          rules[x].message = `${field.label}不能为空!`
      }
      // 如果有文件
      if (field.type === 'upload') {
        CopyFields[x].__FILE = reactive({
          beforeUpload: () => {
            nowFileUploadingCnt.value++;
            if(field.file.beforeUpload)
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

    return {rules, finish, submitLoading, layout, itemLayout, nowFileUploadingCnt, CopyFields}
  }
}
</script>
<template>
  <a-form :model="model" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="finish">
    <a-form-item v-for="field, name in fields"
                 :label="field.label"
                 :key="field.label"
                 :name="name">
      <a-input          v-if="field.type === 'input'"    v-model:value="model[name]"/>
      <a-input-password v-if="field.type === 'password'" v-model:value="model[name]"/>
      <a-input-number   v-if="field.type === 'number'"   v-model:value="model[name]" :min="field.min" :max="field.max" />
      <a-textarea       v-if="field.type === 'textarea'" v-model:value="model[name]"/>
      <a-radio-group    v-if="field.type === 'radio'"    v-model:value="model[name]">
        <a-radio v-for="radio in field.radios"
                 :value="radio.value">
          {{ radio.hint }}
        </a-radio>
      </a-radio-group>
      <a-upload        v-if="field.type === 'upload'"
                       v-model:filelist="model[name]"
                       :multiple="field.file.multiple || false"
                       :name="field.file.name"
                       :action="field.file.action"
                       :beforeUpload="field.file.beforeUpload"
                       @change="field.file.onChange"
                       :data="field.file.data">
        <a-button><UploadOutlined/>点击上传</a-button>
      </a-upload>
      <slot            v-if="field.customRender"
                       :name="field.customRender.slot"
                       :field="field">
      </slot>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 4 }">
      <a-button type="primary" html-type="submit" :loading="submitLoading">{{ form.submitHint || '提交' }}</a-button>
      <a-divider type="vertical"/>
      <a-button type="default" @click="form.cancel">{{ form.cancelHint || '取消' }}</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { PropType, ref, reactive } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'

export declare interface Model {
  [property: string]: any
}

export declare interface Fields {
  [property: string]: {
    type: 'input' | 'number' | 'upload' | 'password' | 'radio',
    label: string,
    customRender?: {
      slot: string
    },
    min?: number,
    max?: number,
    radios?: Array<{value: number, hint: string}>,
    file?: {
      multiple: boolean,
      beforeUpload: () => void,
      onChange: (info) => void,
      name: string,
      action: string,
      data: Object
    },
    rule?: {
      required?: boolean,
      message?: string,
      validator?: () => Promise<string>,
      trigger: 'blur' | 'change'
    }
  }
}

export declare interface Form {
  submitHint?: string,
  cancelHint?: string,
  finish: () => Promise<string>,
  cancel: () => void
}

export default {
  name: "createForm",
  components: { UploadOutlined },
  props: {
    model: Object as PropType<Model>,
    fields: Object as PropType<Fields>,
    form: Object as PropType<Form>
  },
  setup(props) {
    // 生成规则
    const rules = reactive({})
    for(let x in props.fields)
      if(props.fields[x].rule)
        rules[x] = props.fields[x].rule

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
    return { rules, finish, submitLoading }
  }
}
</script>
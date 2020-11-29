<template>
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>系统公告</h3>
    </template>
    <create-from :model="model" :fields="fields" :form="form"/>
  </a-card>
</template>

<script>
import { reactive } from 'vue'
import createFrom from '../base/createForm.vue'
import { BulletinTitleField, BulletinContentField } from '../../type/bulletin'
import {addSystemAnnouncement} from "../../api/system";
import {message} from 'ant-design-vue'

export default {
  components: { createFrom },
  setup() {
    const model = reactive({
      title: '',
      content: ''
    })
    const fields = reactive({
      title: BulletinTitleField,
      content: BulletinContentField
    })
    const form = reactive({
      submitHint: '发布',
      finish: async () => {
        try {
          await addSystemAnnouncement(model.title, model.content);
          model.content = ''
          model.title = ''
          message.success('发布系统公告成功!')
        } catch (e) {
          message.error(e);
        }
      }
    })
    return { model, fields, form }
  }
}
</script>
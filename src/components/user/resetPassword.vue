<template>
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>修改密码</h3>
    </template>
    <create-form :form="form" :fields="fields" :model="model"/>
  </a-card>
</template>

<script lang="ts">
import {reactive} from 'vue'
import {message} from "ant-design-vue";
import {resetPassword} from "../../api/user";
import createForm from "../base/createForm.vue";
import {PasswordField} from "../../type/user";

export default {
  name: "resetPassword",
  components: {createForm},
  setup() {
    const model = reactive({
      oldPassword: '',
      newPassword: '',
      confirm: ''
    })
    const fields = reactive({
      oldPassword: PasswordField,
      newPassword: PasswordField,
      confirm: {
        type: 'password',
        label: '重复新密码',
        rule: {
          validator: (rule, value) => {
            if (value !== model.newPassword)
              return Promise.reject("两次密码不一致!")
            return Promise.resolve()
          },
          trigger: 'blur'
        }
      }
    })
    const form = reactive({
      submitHint: '修改',
      finish: async () => {
        try {
          await resetPassword(model)
          message.success('修改成功')
          model.newPassword = ''
          model.oldPassword = ''
          model.confirm = ''
        } catch (e) {
          message.error(e)
        }
      }
    })

    return {model, fields, form}
  }
}
</script>
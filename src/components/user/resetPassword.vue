<template>
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>修改密码</h3>
    </template>
    <a-form :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" @finish="clickResetPassword">
      <a-form-item label="旧密码" name="oldPassword">
        <a-input-password v-model:value="form.oldPassword"/>
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input-password v-model:value="form.newPassword" />
      </a-form-item>
      <a-form-item label="重复新密码" name="confirm">
        <a-input-password v-model:value="form.confirm"></a-input-password>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 4 }">
        <a-button html-type="submit" type="primary">修改</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { ref, reactive } from 'vue'
import {message} from "ant-design-vue";
import { resetPassword } from "../../api/user";

export default {
  name: "resetPassword",
  setup() {
    const store = useStore()
    const form = reactive({
      oldPassword: '',
      newPassword: '',
      confirm: ''
    });

    const rules = reactive({
      confirm: [{
        validator: (rule, value) => {
          if (value !== form.newPassword)
            return Promise.reject("两次密码不一致!")
          return Promise.resolve()
        },
        trigger: 'blur'
      }]
    })

    async function clickResetPassword() {
      try {
        await resetPassword({...form})
        message.success('修改成功')
        form.newPassword = ''
        form.oldPassword = ''
        form.confirm = ''
      } catch (e) {
        message.error(e)
      }
    }

    return { form, clickResetPassword, rules }
  }
}
</script>

<style scoped>

</style>
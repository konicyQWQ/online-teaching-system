<template>
  <a-card id="forget-password" class="ant-card-shadow">
    <template #title>
      <h3 style="text-align: center">找回密码</h3>
    </template>
    <a-form :model="form" :wrapper-col="{ span: 20 }" :label-col="{ span: 4 }" class="form">
      <a-form-item label="学号">
        <a-input v-model:value="form.id">
          <template #prefix><UserOutlined /></template>
        </a-input>
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model:value="form.phone">
          <template #prefix><MobileOutlined /></template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { UserOutlined, MobileOutlined } from "@ant-design/icons-vue";
export default {
  components: { UserOutlined, MobileOutlined },
  setup() {
    const form = reactive({
      id: '',
      phone: ''
    })
    // TODO: 补充找回密码相关内容
    return { form }
  }
}
</script>

<style scoped lang="scss">
#forget-password {
  width: 800px;
  margin: 0 auto;

  .form {
    padding: 0 10em;
  }
}
</style>
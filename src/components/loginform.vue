<template>
  <a-form :model="loginForm"
           ref="form"
          :rules="rules"
          :label-col="{span: 4}"
          :wrapper-col="{span: 16}">
    <a-form-item label="用户名" name="user">
      <a-input v-model:value="loginForm.user" placeholder="用户名">
          <template v-slot:prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
      </a-input>
    </a-form-item>
    <a-form-item label="密码" name="password">
      <a-input v-model:value="loginForm.password" type="password" placeholder="密码">
          <template v-slot:prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
      </a-input>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
      <a-checkbox v-model:checked="loginForm.checked">
        记住我
      </a-checkbox>
      <a-button type="primary" html-type="submit" @click="handleLogin" :style="{ float: 'right' }">
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default {
  name: 'loginForm',
  components: {
    UserOutlined,
    LockOutlined,
  },
  data() {
    return {
      loginForm: {
        user: '',
        password: '',
        checked: true,
      },
      rules: {
        user: [ { required: true, message: '请输入用户名!', trigger: 'blur' } ],
        password: [ { required: true, message: '请输入密码!', trigger: 'blur' } ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate()
        .then(() => {
          // todo: 完成登录
        }).catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
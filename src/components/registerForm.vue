<template>
  <a-form :model="registerForm"
          ref="form"
          :rules="rules"
          :label-col="{span: 4}"
          :wrapper-col="{span: 16}">
    <a-form-item label="用户名" name="user" has-feedback>
      <a-input v-model:value="registerForm.user" placeholder="用户名">
        <template v-slot:prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
      </a-input>
    </a-form-item>
    <a-form-item label="密码" name="password" has-feedback>
      <a-input v-model:value="registerForm.password" type="password" placeholder="密码">
        <template v-slot:prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
      </a-input>
    </a-form-item>
    <a-form-item label="确认密码" name="confirm" has-feedback>
      <a-input v-model:value="registerForm.confirm" type="password" placeholder="重新输入密码">
        <template v-slot:prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
      </a-input>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 17 }">
      <a-button type="primary" html-type="submit" @click="handleLogin">
        注册
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default {
  name: 'registerForm',
  components: {
    UserOutlined,
    LockOutlined,
  },
  data() {

    let confirmPass = async (rule, value, callback) => {
      if(value == this.registerForm.password && value != '') {
        return Promise.resolve()
      } else {
        return Promise.reject('请与密码一致!')
      }
    }

    return {
      registerForm: {
        user: '',
        password: '',
        confirm: ''
      },
      rules: {
        user: [ { required: true, message: '请输入用户名!', trigger: 'blur' } ],
        password: [ { required: true, message: '请输入密码!', trigger: 'blur' } ],
        confirm: [ { required: true, validator: confirmPass, trigger: 'blur' } ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate()
        .then(() => {
          // 注册
        }).catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
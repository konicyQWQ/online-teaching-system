<template>
  <div class="login-modal">
    <a-card class="ant-card-shadow login">
      <template #title>
        <h3 style="text-align: center">登录</h3>
      </template>
      <a-form :model="form" @submit="handleLogin">
        <a-form-item>
          <a-input v-model:value="form.username" placeholder="用户名">
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password v-model:value="form.password" placeholder="密码">
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="form.rememberMe">
            保持我的登录状态
          </a-checkbox>
          <a style="float: right" href="">忘记密码?</a>
        </a-form-item>
        <a-button html-type="submit" type="primary" block shape="round">
          登录
        </a-button>
      </a-form>
    </a-card>
    <div class="login-shadow">
      <h3>还没有账户？</h3>
      <p>现在注册，可以体验浙江大学的很多课程，著名学者分享心得，付费即可享受。</p>
      <a href="">立即注册</a>
    </div>
  </div>
</template>

<script>
import {LockOutlined, UserOutlined} from "@ant-design/icons-vue";
import {reactive} from 'vue'

export default {
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const form = reactive({
      username: '',
      password: '',
      rememberMe: true
    })

    const handleLogin = () => {
      alert('success')
    }

    return { form, handleLogin }
  }
}
</script>

<style scoped lang="scss">
.login-modal {
  display: flex;
  align-items: center;

  .login {
    width: 320px;
  }

  .login-shadow {
    width: 280px;
    padding: 3em 2em;
    background: rgba(0, 0, 0, .7);

    h3 {
      color: white;
      font-size: 24px;
      margin-bottom: .5em;
    }

    p {
      color: white;
      font-size: 16px;
      font-weight: 300;
    }
  }
}
</style>
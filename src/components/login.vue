<template>
  <modal :visible="visible">
    <div class="login-modal">
      <a-card class="ant-card-shadow login">
        <template #title>
          <h3 style="text-align: center">登录</h3>
        </template>
        <a-form :model="form" :rules="rules" @finish="handleLogin">
          <a-form-item>
            <a-input v-model:value="form.id" placeholder="学号">
              <template #prefix><UserOutlined /></template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
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
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { reactive, inject } from 'vue'
import { useStore } from "vuex";
import modal from './base/modal.vue'
import request from '../axios/index.js'
import md5 from 'md5'
import { Role } from '../js/type.ts'

export default {
  components: { UserOutlined, LockOutlined, modal },
  props: [
    'visible'
  ],
  setup(props) {
    const message = inject('message')
    const form = reactive({
      id: '',
      password: '',
      rememberMe: true
    })
    const rules = reactive({
      password: [{
        validator: (rule, value) => {
          if(value === '')
            return Promise.reject("密码不能为空！")
          return Promise.resolve()
        },
        trigger: 'blur'
      }]
    })
    const store = useStore()

    const handleLogin = async () => {
      try {
        const res = await request.post('/authentication', {
          id: form.id,
          password: md5(form.password)
        });
        if(res.data.role === Role.unknown) {
          throw '登录失败: ' + res.data.token
        } else {
          store.commit('saveToken', { token: res.data.token, remember: form.rememberMe});
          await store.dispatch('getUserInfo');
          message.success('登录成功!');
          props.visible = false
        }
      } catch (e) {
        message.error(e)
      }
    }
    return { form, rules, handleLogin }
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
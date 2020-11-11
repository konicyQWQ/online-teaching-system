<template>
  <modal v-model:visible="visible">
    <div class="login-modal">
      <a-card class="ant-card-shadow login">
        <template #title>
          <h3 style="text-align: center">登录</h3>
        </template>
        <a-form :model="form" :rules="rules" @finish="handleLogin" :wrapper-col="{ span: 24 }">
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
            <a-checkbox v-model:checked="form.remember">
              保持我的登录状态
            </a-checkbox>
            <a style="float: right" @click="forgetPassword">忘记密码?</a>
          </a-form-item>
          <a-button html-type="submit" type="primary" block shape="round" :loading="isLoading">
            {{ hint }}
          </a-button>
        </a-form>
      </a-card>
      <div class="login-shadow">
        <h3>还没有账户？</h3>
        <p>现在注册，可以体验浙江大学的优质课程，著名学者分享心得，付费即可享受。</p>
        <a @click="immediateRegister">立即注册</a>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { reactive, watch, ref } from 'vue'
import modal from './base/modal.vue'
import { login } from "../api/login";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default {
  components: { UserOutlined, LockOutlined, modal },
  props: { visible: Boolean },
  setup(props, ct) {
    const form = reactive({
      id: '',
      password: '',
      remember: true
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
    const router = useRouter()
    const hint = ref('登录')
    const isLoading = ref(false)
    const handleLogin = async () => {
      hint.value = '登录中'
      isLoading.value = true
      try {
        const res = await login(form)
        message.success(res)
        // router.push('/user')
        closeLogin()
      } catch (e) {
        message.error(e.toString())
      } finally {
        isLoading.value = false
        hint.value = '登录'
      }
    }
    const closeLogin = () => {
      ct.emit('update:visible', false)
    }
    watch(() => props.visible, (val) => {
      ct.emit('update:visible', val)
    })
    const forgetPassword = () => {
      router.push('/forget-password')
      closeLogin()
    }
    const immediateRegister = () => {
      router.push('/register')
      closeLogin()
    }
    return { form, rules, handleLogin, immediateRegister, forgetPassword, hint, isLoading }
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
<template>
  <a-card id="forget-password" class="ant-card-shadow">
    <template #title>
      <h3 style="text-align: center">找回密码</h3>
    </template>
    <a-steps :current="current">
      <a-step title="用户信息"/>
      <a-step title="身份验证"/>
      <a-step title="修改密码"/>
      <a-step title="成功"/>
    </a-steps>

    <div class="form">
      <create-form :model="firstModel" :form="firstForm" :fields="firstFields" v-if="current === 0"/>

      <div v-if="current === 1">
        <a-alert message="用户信息核对通过" description="一份含有验证码的信件已经发往您的邮箱......" type="success" show-icon/>
        <a-form :model="secondForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="handleSecondForm"
                style="margin-top: 2em">
          <a-form-item label="验证码" name="confirmCode">
            <a-input v-model:value="secondForm.confirmCode"/>
            <a-button type="default" @click="reSend" :loading="cannotReSend">{{ hint }}</a-button>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" html-type="submit" :loading="secondLoading">下一步</a-button>
          </a-form-item>
        </a-form>
      </div>

      <create-form :model="thirdModel" :fields="thirdFields" :form="thirdForm" v-if="current===2"/>

      <a-result status="success" title="密码重置成功!"
                sub-title="请保管好您的新密码"
                v-if="current===3">
        <template #extra>
          <a-button key="public" type="primary" @click="gotoPublicPage">
            公开课程
          </a-button>
        </template>
      </a-result>

    </div>
  </a-card>
</template>

<script lang="ts">
// 第一步，传 user.id 和 email ,如果匹配，返回special token，进入下一步
// 第二步，请输入验证码，发到邮箱验证码输入上去
// 点击找回，发送 token，验证码，返回是否成功，成功进入下一步
// 第三步，输入新的密码，传新密码，special token

import {reactive, ref} from 'vue'
import {UserOutlined, MobileOutlined} from "@ant-design/icons-vue";
import request from "../api/axios";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import {md5} from "../api/md5";
import {EmailField, IdField, PasswordField} from "../type/user";
import createForm from "../components/base/createForm.vue";

export default {
  components: {UserOutlined, MobileOutlined, createForm},
  setup() {
    const current = ref(0)
    const specialToken = ref('')
    const router = useRouter()

    const firstModel = reactive({
      id: '',
      email: ''
    })
    const firstFields = reactive({
      id: IdField,
      email: EmailField
    })
    const firstForm = reactive({
      submitHint: '下一步',
      finish: async () => {
        try {
          const res = await request.post('/user/RetrievePassword', {
            userID: firstModel.id,
            email: firstModel.email
          })
          if (res.data.res === false)
            throw res.data.error
          specialToken.value = res.data.token
          current.value++;
        } catch (e) {
          message.error(e);
        }
      },
    })

    const secondLoading = ref(false)
    const secondForm = reactive({
      confirmCode: ''
    })

    async function handleSecondForm() {
      secondLoading.value = true
      try {
        const res = await request.post('/user/VerifyEmail', {
          token: specialToken.value,
          code: secondForm.confirmCode
        })
        if (res.data.res === false)
          throw new Error(res.data.error)
        current.value++
      } catch (e) {
        message.error(e.toString())
      } finally {
        secondLoading.value = false
      }
    }

    // 重发验证码
    const hint = ref('重新发送验证码')
    const cannotReSend = ref(false)
    let cnt = 60;

    async function reSend() {
      cannotReSend.value = true

      await request.post('/user/ResendEmail', {
        token: specialToken.value
      })

      cnt = 60;
      let id = setInterval(() => {
        if (cnt === 0) {
          clearInterval(id)
          hint.value = '重新发送验证码'
          cannotReSend.value = true
        } else {
          cnt--;
          hint.value = `${cnt}秒后可重新发送`
        }
      }, 1000)
    }

    // 第三个步骤
    const thirdModel = reactive({
      newPassword: '',
      confirm: ''
    })
    const thirdFields = reactive({
      newPassword: PasswordField,
      confirm: {
        type: 'password',
        label: '确认密码',
        rule: {
          validator: async (rule, value) => {
            if (value !== thirdModel.newPassword)
              return Promise.reject('两次密码不一致')
            return Promise.resolve()
          },
          trigger: 'blur'
        }
      }
    })
    const thirdForm = reactive({
      submitHint: '重置',
      finish: async () => {
        try {
          const res = await request.post('/user/PasswordReset', {
            token: specialToken.value,
            newPassword: md5(thirdModel.newPassword)
          })
          if (res.data.res === false)
            throw res.data.error
          message.success('修改成功')
          current.value++
        } catch (e) {
          message.error(e)
        }
      }
    })

    const gotoPublicPage = () => router.push('/public')

    return {
      current, secondForm, thirdForm, firstModel, firstForm, firstFields,
      handleSecondForm, gotoPublicPage, reSend, cannotReSend, hint, thirdModel, thirdFields
    }
  }
}
</script>

<style scoped lang="scss">
#forget-password {
  width: 800px;
  margin: 0 auto;

  .form {
    margin-top: 2em;
    padding: 0 10em;
  }
}
</style>
<template>
  <a-card class="ant-card-shadow register">
    <template #title><h3 style="text-align: center">注册</h3></template>
    <a-steps :current="current">
      <a-step title="账号注册"></a-step>
      <a-step title="完善基本信息"></a-step>
      <a-step title="成功"></a-step>
    </a-steps>
    <div class="form">
      <create-form v-if="current===0" :model="firstModel" :fields="firstFields" :form="firstForm"/>
      <create-form v-if="current===1" :model="secondModel" :fields="secondFields" :form="secondForm"/>
      <a-result status="success"
                title="注册成功!"
                sub-title="你已经注册成功了, 系统已经自动为您登录，请您选择进一步的操作..."
                v-if="current===2">
        <template #extra>
          <a-button key="public" type="primary" @click="gotoPublicPage">
            公开课程
          </a-button>
          <a-button key="user" @click="gotoUserPage">
            用户首页
          </a-button>
        </template>
      </a-result>
    </div>
  </a-card>
</template>

<script lang="ts">
import {ref, reactive} from 'vue'
import {register} from "../api/user";
import {useStore} from 'vuex'
import {message} from 'ant-design-vue'
import router from "../router";
import createForm from "../components/base/createForm.vue";
import {
  IdField,
  PasswordField,
  Gender,
  NameField,
  PhoneField,
  EmailField,
  GradeField,
  GenderField,
  DepartmentField
} from "../type/user";

export default {
  components: {createForm},
  setup() {
    const current = ref(0);
    const store = useStore()
    const firstModel = reactive({
      id: '',
      password: '',
      confirmPassword: ''
    })
    const firstFields = reactive({
      id: IdField,
      password: PasswordField,
      confirmPassword: {
        type: 'password',
        label: '重复密码',
        rule: {
          required: true,
          validator: (rule, value) => {
            if (value !== firstModel.password)
              return Promise.reject('两次密码不一致!')
            return Promise.resolve('')
          },
          trigger: 'blur'
        }
      }
    })
    const firstForm = reactive({
      submitHint: '下一步',
      finish: () => current.value++
    })
    // 第二步
    const secondModel = reactive({
      name: '',
      gender: Gender.male,
      grade: 1,
      email: '',
      phone: '',
      avatarId: null,
      department: ''
    })
    const secondFields = reactive({
      name: NameField,
      department: DepartmentField,
      gender: GenderField,
      grade: GradeField,
      email: EmailField,
      phone: PhoneField
    })
    const secondForm = reactive({
      submitHint: '注册',
      cancelHint: '上一步',
      cancel: () => current.value--,
      finish: async () => {
        try {
          const token = await register({
            id: firstModel.id,
            password: firstModel.password,
            ...secondModel
          });
          await store.dispatch('loginByToken', {
            token,
            remember: true
          })
          current.value++;
        } catch (e) {
          current.value = 0;
          message.error(e)
        }
      }
    })
    const gotoUserPage = () => router.push('/user')
    const gotoPublicPage = () => router.push('/public')
    return {
      current, firstModel, firstForm, firstFields, gotoUserPage, gotoPublicPage, secondForm, secondFields, secondModel
    }
  }
}
</script>

<style scoped lang="scss">
.register {
  margin: 0 auto;
  width: 800px;
  padding: 0 1em;

  .form {
    padding: 2em 10em;
  }
}
</style>
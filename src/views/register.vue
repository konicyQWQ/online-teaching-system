<template>
  <a-card class="ant-card-shadow register">
    <template #title><h3 style="text-align: center">注册</h3></template>
    <a-steps :current="current">
      <a-step title="账号注册"></a-step>
      <a-step title="完善基本信息"></a-step>
      <a-step title="成功"></a-step>
    </a-steps>
    <div class="form">
      <a-form v-if="current===0"
              :model="form"
              :rules="firstRules"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              @finish="handleFirst">
        <a-form-item label="学号" name="id">
          <a-input v-model:value="form.id">
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="form.password">
            <template #prefix><KeyOutlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" name="confirm">
          <a-input-password v-model:value="form.confirm">
            <template #prefix><KeyOutlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item :wrapper-col="{ span:20, offset: 4 }">
          <a-button type="primary" html-type="submit">
            下一步
          </a-button>
        </a-form-item>
      </a-form>
      <a-form v-if="current===1"
              :model="form2"
              :rules="secondRules"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              @finish="handleSecond">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="form2.name">
            <template #prefix><IdcardOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-radio-group name="radioGroup" v-model:value="form2.gender">
            <a-radio :value="0">男</a-radio>
            <a-radio :value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="年级" name="grade">
          <a-input-number v-model:value="form2.grade" :min="1" :max="4"></a-input-number>
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="form2.phone">
            <template #prefix><MobileOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-auto-complete v-model:value="form2.email"
                           :data-source="emailAC"
                           @search="handleSearch">
            <template #default>
              <a-input>
                <template #prefix><MailOutlined /></template>
              </a-input>
            </template>
          </a-auto-complete>
        </a-form-item>
        <a-form-item :wrapper-col="{ span:20, offset: 4 }">
          <a-button type="primary" html-type="submit">
            完成
          </a-button>
        </a-form-item>
      </a-form>
      <a-result status="success"
                title="注册成功!"
                sub-title="你已经注册成功了, 系统已经自动为您登录，请您选择进一步的操作..."
                v-if="current===2">
        <template #extra>
          <a-button key="public" type="primary">
            公开课程
          </a-button>
          <a-button key="user">
            用户首页
          </a-button>
        </template>
      </a-result>
    </div>
  </a-card>
</template>

<script>
import { ref, reactive, inject } from 'vue'
import { UserOutlined, KeyOutlined, IdcardOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons-vue'
import request from '../axios/index.js'
import { useStore } from 'vuex'

export default {
  components: {
    UserOutlined,
    KeyOutlined,
    IdcardOutlined,
    MobileOutlined,
    MailOutlined
  },
  setup() {
    const current = ref(0);
    const message = inject("message");
    // 第一步
    const form = reactive({
      id: '',
      password: '',
      confirmPassword: ''
    });
    const firstRules = reactive({
      id: [{
          validator: (rule, value) => {
            if (value === '')
              return Promise.reject("学号不能为空!")
            return Promise.resolve()
          },
          trigger: 'blur'
      }],
      password: [{
          validator: (rule, value) => {
            if (value === '')
              return Promise.reject("密码不能为空!")
            return Promise.resolve()
          },
          trigger: 'blur'
      }],
      confirm: [{
          validator: (rule, value) => {
            if (value !== form.password)
              return Promise.reject("两次密码不一致!")
            return Promise.resolve()
          },
          trigger: 'blur'
      }]
    });
    const handleFirst = () => {
      current.value ++;
    };
    // 第二步
    const form2 = reactive({
      name: '',
      gender: 0,
      grade: 1,
      email: '',
      phone: ''
    });
    const secondRules = reactive({
      phone: [{
        validator: (rule, value) => {
          if(/^\d{11}$/.test(value) === false)
            return Promise.reject('手机格式错误!')
          return Promise.resolve()
        },
        trigger: 'blur'
      }],
      email: [{
        validator: (rule, value) => {
          if(/^\w+@\w+(\.\w+)+$/.test(value) === false)
            return Promise.reject('邮箱格式错误!')
          return Promise.resolve()
        },
        trigger: 'blur'
      }]
    });
    const emailAC = ref([]);
    const handleSearch = (now) => {
      if(!now || now.indexOf('@') >= 0)
        emailAC.value = []
      else
        emailAC.value = ['@163.com', '@qq.com', '@zju.edu.cn'].map((value) => { return now+value })
    }
    const handleSecond = async () => {
      try {
        const res = await request.post('/authentication/regist', {
          ...form, ...form2
        })
        if(res.data.res) {
          const store = useStore();
          store.commit('saveToken', res.data.token);
          store.dispatch('getUserInfo');
          current.value ++;
        } else {
          current.value = 0
          throw '注册失败: ' + res.data.token
        }
      } catch (e) {
        message.error(e);
      }
    }
    return {current, form, firstRules, handleFirst, form2, secondRules, handleSecond, emailAC, handleSearch}
  }
}
</script>

<style scoped lang="scss">
.register {
  margin: 0em auto;
  width: 800px;
  padding: 0 1em;

  .form {
    padding: 2em 10em;
  }
}
</style>
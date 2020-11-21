<template>
<a-card>
  <template #title>
    <h3>教师简介</h3> 
  </template>
  <a-row>
    <a-col :span="6"> 
  <a-upload
    v-model:fileList="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
    <div v-else>
      <!-- todo -->
      <loading-outlined v-if="loading" />
      <plus-outlined v-else />
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
    </a-col> 
    <a-col :span="18"> 
      <a-card title="名师事迹" style="height:270px;">
      <p>
        {{teacher.introduction}}

      </p>
      </a-card>
    </a-col>
  </a-row>
</a-card>  

<a-card>
  <template #title>
    <div>
    <h3>基本信息 <a-button style="margin-left:640px" @click="openModifyModal()">修改</a-button> </h3> 
   
    </div>
  </template>
  <create-form :form="form" :fields="fields" :model="model"/>
  <a-descriptions bordered>
        <a-descriptions-item label="姓名" :span = "3">
          {{teacher.name}}
        </a-descriptions-item>
        <a-descriptions-item label="性别">
        {{teacher.gender === 0 ? '男' : '女' }}
        </a-descriptions-item>
        <a-descriptions-item label="办公地点">
          曹西-503
        </a-descriptions-item>
        <a-descriptions-item label="电话">
          {{teacher.phone}}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{teacher.email}}
        </a-descriptions-item>
        <a-descriptions-item label="个人主页">
          <router-link to="www.baidu.com">www.baidu.com</router-link>
        </a-descriptions-item>
        <a-descriptions-item label="教龄">
          5年
        </a-descriptions-item>
        
        <a-descriptions-item label="职称" :span = "3">
          副教授
        </a-descriptions-item>
        <a-descriptions-item label="任职情况">
          在职
        </a-descriptions-item>
      </a-descriptions>    


      <modal v-model:visible="visible">
        
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }"
              :loading="modalLoading">
        <template #title><h3 style="text-align: center">修改教师信息</h3></template>
        <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :layout="horizontal">
          <a-form-item label="姓名">
            <a-input v-model:value="form.name" :placeholder="teacher.name"/>
          </a-form-item>
          <a-form-item label="性别">
          <a-select v-model:value="form.gender" >
            <a-select-option value="0">
              男
            </a-select-option>
            <a-select-option value="1">
              女
            </a-select-option>
          </a-select>
          </a-form-item>
          <a-form-item label="电话">
            <a-input v-model:value="form.phone" :placeholder="teacher.phone"/>
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-model:value="form.email" :placeholder="teacher.email"/>
          </a-form-item>
          <a-form-item label="教师事迹" name="desc">
            <a-textarea v-model:value="form.introduction" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">
            编辑
          </a-button>
          <a-button style="margin-left: 20px;" @click="cancel">
            重置
          </a-button>
          </a-form-item>
        </a-form>
    </modal>

</a-card> 


</template>
<script lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import requset from '../../api/axios'
import {deleteUser, modifyUserInfo, newGetUserInfo} from "../../api/user";
import modal from '../base/modal.vue'
import {useStore} from 'vuex'
import login from '../login.vue'
import {useRouter} from 'vue-router'
import createForm from "../base/createForm.vue";
import {
  EmailField,
  GenderField,
  IdField,
  IntroductionField,
  NameField,
  PhoneField,
  Role, RoleField
} from "../../type/user"

import {ref, onMounted, toRefs} from 'vue'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


export default {
  components: {
    LoadingOutlined,
    PlusOutlined,
    modal
    //createForm
  },
  data() {
    return {
      fileList: [],
      loading: false,
      imageUrl: '',
      visible: false,
      teacher: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      token: 0,
      avatarId:0, 
      role:0, 
      id:0,
    form:{
      name:'',
      gender:'',
      phone:'',
      email:'',
      introduction:''
    }
    };
  },
  mounted() {
    let id = this.$route.params.id
    
    const store = useStore()
    const router = useRouter()
    this.token = store.state.token

    requset.get('/user/TeacherPage', {
      params: {
        id
      }
    }).then(res => {
      this.teacher = res.data.teacherDetail.teacherInfo
      //console.log(this.teacher)

    }).catch(e=> {
      console.log("12345")
    })
    this.id = id
  },
 /*  setup()
  {

    const visible = ref(false)
    const modalLoading = ref(false)
    const openModifyModal = async (record) => {
      visible.value = true
      modalLoading.value = true
      try {
        const {userInfo} = await newGetUserInfo({userID: record.id})
        Object.assign(model, userInfo)
        modalLoading.value = false
      } catch (e) {
        message.error(e)
      }
    }
    const model = reactive({
      id: '',
      name: '',
      gender: 0,
      grade: 1,
      phone: '',
      email: '',
      role: Role.guest,
      introduction: '',
    })
    const fields = reactive({
      id: IdField,
      name: NameField,
      gender: GenderField,
      phone: PhoneField,
      email: EmailField,
      role: RoleField,
      introduction: IntroductionField
    })
    const form = reactive({
      submitHint: '更改完成',
      finish: async () => {
        try {
          await modifyUserInfo(model)
          //await handleChange(null, null, null)
          visible.value = false
          message.success('修改成功')
        } catch (e) {
          message.error(e.toString())
        }
      },
      cancel: () => {
        visible.value = false
      }
    })
    return {
      model, fields, form, visible, openModifyModal, modalLoading
    }
  }, */
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
      if (info.file.status === 'error') {
        this.loading = false;
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    openModifyModal(){
      this.visible = true;
    },
    createForm,
    onSubmit(){
      if(this.form.name != ''){
        this.teacher.name = this.form.name
      }      
      if(this.form.gender != ''){
        this.teacher.gender = this.form.gender
      }  if(this.form.email != ''){
        this.teacher.email = this.form.email
      }  if(this.form.introduction != ''){
        this.teacher.introduction = this.form.introduction
      }  if(this.form.phone != ''){
        this.teacher.phone = this.form.phone
      }  

      const sent = this.teacher
      const token = this.token
      console.log(token)
      /* requset.post('/user/TeacherPage/Update', {
        sent,
        token
    }) */
      this.visible = false
      message.success('修改成功')
    },
    cancel(){
      this.form = {}
      this.visible = false
    }
  },
};
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 200px;
  height: 270px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
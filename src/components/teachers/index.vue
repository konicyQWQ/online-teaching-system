<template>
<a-card>
  <template #title>
    <h3>教师简介</h3> 
  </template>
  <a-row>
    <a-col :span="6"> 
      <!-- <a-card title="教师近照" style="height:300px;">
        <img :src="StaticPreviewUrl(teacher.avatarId)" style="height:200px;">
      </a-card> -->
      <a-card  hoverable style="height:300px;">
      <template #cover>
        <img  :src="StaticPreviewUrl(teacher.avatarId)" />
      </template>
      <a-card-meta title="教师照片">
      </a-card-meta>
  </a-card>
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
    <h3>基本信息 <a-button v-if="role === 3" style="margin-left:640px" @click="openModifyModal()">修改</a-button> </h3> 
   
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
          {{teacherPage.officePlace}}
        </a-descriptions-item>
        <a-descriptions-item label="电话">
          {{teacher.phone}}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{teacher.email}}
        </a-descriptions-item>
        <a-descriptions-item label="个人主页">
          <router-link to="teacherPage.personalUrl">{{teacherPage.personalUrl}}</router-link>
        </a-descriptions-item>
        <a-descriptions-item label="教龄">
          {{teacherPage.teachingAge}}年
        </a-descriptions-item>
        
        <a-descriptions-item label="职称" :span = "3">
          {{teacherPage.posTitle}}
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
            <a-input v-model:value="teacher.name"/>
          </a-form-item>
          <!-- <a-form-item label="性别">
          <a-select v-model:value="form.gender" >
            <a-select-option value="0">
              男
            </a-select-option>
            <a-select-option value="1">
              女
            </a-select-option>
          </a-select>
          </a-form-item> -->
          <a-form-item label="个人主页">
            <a-input v-model:value="form.personalurl" :placeholder="teacherPage.personalUrl"/>
          </a-form-item>
          <a-form-item label="工作地点">
            <a-input v-model:value="form.officeplace" :placeholder="teacherPage.officePlace"/>
          </a-form-item>
          <a-form-item label="教龄" name="desc">
            <a-input v-model:value="form.teachage" :placeholder="teacherPage.teachingAge"/>
          </a-form-item>
          <a-form-item label="职称">
            <a-input v-model:value="form.postitle" :placeholder="teacherPage.posTitle"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit()">
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
import {StaticPreviewUrl} from "../../type/file";
import {Role} from "../../type/user";
import {ref, onMounted, toRefs} from 'vue'


export default {
  components: {
    LoadingOutlined,
    PlusOutlined,
    modal,
  },
  data() {
    return {
      fileList: [],
      loading: false,
      visible: false,
      teacher: {},
      teacherPage:{},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      token: 0,
      role:0, 
      id:0,
    form:{
      name:'',
      personalurl:'',
      officeplace:'',
      teachage:'',
      postitle:'',
      status:'',
    }
    };
  },
  mounted() {
    let id = this.$route.params.id
    
    const store = useStore()
    const router = useRouter()
    this.token = store.state.token
    const {token, avatarId, role} = toRefs(store.state)
    this.role = role
    requset.get('/user/TeacherPage', {
      params: {
        id
      }
    }).then(res => {
      this.teacher = res.data.teacherDetail.teacherInfo
      if(res.data.teacherDetail.teacherPage != ''){
        this.teacherPage = res.data.teacherDetail.teacherPage
      }

      //console.log(this.teacher)
      //console.log(this.teacherPage)

    }).catch(e=> {
      console.log("12345")
    })
    this.id = id
  },
  methods: {
    StaticPreviewUrl,
    //createForm,
    openModifyModal(){
      this.visible = true;
    },
    async onSubmit(){
      if(this.form.personalUrl == ''){
        this.form.personalUrl = this.teacherPage.personalUrl
      }
      if(this.form.teachage == ''){
        this.form.teachage = this.teacherPage.teachingAge
      }
      if(this.form.officePlace == ''){
        this.form.officeplace = this.teacherPage.officePlace
      }
      if(this.form.posTitle == ''){
        this.form.postitle = this.teacherPage.posTitle
      }
      const token = this.token
      const res = await requset.post('/user/TeacherPage/Update', {
        token,
        teacherPage: {
          id: this.id,
          personalUrl:this.form.personalurl,
          officePlace:this.form.officeplace,
          teachingAge:this.form.teachage,
          posTitle:this.form.postitle,
        }
    })
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
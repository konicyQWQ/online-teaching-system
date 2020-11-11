<template>
  <div>
    <a-card class="ant-card-shadow">
      <template #title>
        <h3>管理所有课程</h3>
      </template>
      <a-button type="primary" @click="openAddModal">
        新建课程
      </a-button>
      <a-table :columns="columns"
               :data-source="data"
               :row-key="record => record.id"
               :loading="dataLoading"
               :pagination="pagination"
               @change="handleTableChange">
        <template #teachers="{ text:teachers }">
          <a-tag v-for="teacher in teachers">
            {{ teacher.name }}
          </a-tag>
        </template>
        <template #actions="{ text, record }">
          <a type="link" @click="openModifyModal(record)">修改</a>
        </template>
      </a-table>
    </a-card>
    <modal v-model:visible="addModalVisible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">新建课程</h3></template>
        <a-form :model="newCoursesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="clickNewCourses">
          <a-form-item label="课程名称" name="name">
            <a-input placeholder="课程名称" v-model:value="newCoursesForm.name"/>
          </a-form-item>
          <a-form-item label="开课学院" name="institute">
            <a-input placeholder="开课学院" v-model:value="newCoursesForm.institute"/>
          </a-form-item>
          <a-form-item label="课程教师" name="teachers">
            <a-mentions v-model:value="newTeachers"
                        :loading="loading"
                        @search="onSearch"
                        placeholder="输入 @名字 来搜索教师">
              <a-mentions-option v-for="{ id, name, avatarId } in users" :key="id" :value="`${name},${id}`">
                <a-avatar :src="getFileUrl(avatarId)" :size="20" style="margin-right: 8px"/>
                <span>{{ id }} : {{ name }}</span>
              </a-mentions-option>
            </a-mentions>
          </a-form-item>
          <a-form-item label="开课状态" name="status">
            <a-radio-group v-model:value="newCoursesForm.status">
              <a-radio :value="0">未开课</a-radio>
              <a-radio :value="1">开课</a-radio>
              <a-radio :value="2">课程结束</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="开课学年" name="year">
            <a-input-number v-model:value="newCoursesForm.year" :min="2020" :max="2030"/>
          </a-form-item>
          <a-form-item label="开课时间" name="startTime">
            <a-date-picker placeholder="开课时间" v-model:value="newCoursesForm.startTime" format="YYYY-MM-DD"/>
          </a-form-item>

          <a-form-item label="课程图片">
            <a-upload v-model:fileList="fileList"
                      :name="uploadName"
                      accept=".jpg,.png,.jpeg"
                      list-type="picture-card"
                      :show-upload-list="false"
                      :action="uploadUrl"
                      @change="fileUploadChange"
                      :before-upload="checkImg">
              <img alt="上传图片" :src="getFileUrl(newCoursesForm.iconId)" style="cursor: pointer; width: 300px;"/>
            </a-upload>
          </a-form-item>

          <a-form-item label="课程简介" name="description">
            <a-textarea v-model:value="newCoursesForm.description"/>
          </a-form-item>
          <a-form-item label="评分方法" name="scoringMethod">
            <a-textarea v-model:value="newCoursesForm.scoringMethod"/>
          </a-form-item>
          <a-form-item label="参考书" name="textbook">
            <a-textarea v-model:value="newCoursesForm.textbook"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" :loading="newSending" html-type="submit">新建</a-button>
            <a-divider type="vertical"/>
            <a-button type="default" @click="closeNewCoursesModal">关闭</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </modal>
    <modal v-model:visible="modifyModalVisible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">修改课程</h3></template>
        <a-form :model="modifyCoursesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="clickModifyCourses">
          <a-form-item label="课程名称" name="name">
            <a-input placeholder="课程名称" v-model:value="modifyCoursesForm.name"/>
          </a-form-item>
          <a-form-item label="开课学院" name="institute">
            <a-input placeholder="开课学院" v-model:value="modifyCoursesForm.institute"/>
          </a-form-item>
          <a-form-item label="课程教师" name="teachers">
            <a-mentions v-model:value="modifyTeachers"
                        :loading="loading"
                        @search="onSearch"
                        placeholder="输入 @名字 来搜索教师">
              <a-mentions-option v-for="{ id, name, avatarId } in users" :key="id" :value="`${name},${id}`">
                <a-avatar :src="getFileUrl(avatarId)" :size="20" style="margin-right: 8px"/>
                <span>{{ id }} : {{ name }}</span>
              </a-mentions-option>
            </a-mentions>
          </a-form-item>
          <a-form-item label="开课状态" name="status">
            <a-radio-group v-model:value="modifyCoursesForm.status">
              <a-radio :value="0">未开课</a-radio>
              <a-radio :value="1">开课</a-radio>
              <a-radio :value="2">课程结束</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="开课学年" name="year">
            <a-input-number v-model:value="modifyCoursesForm.year" :min="2020" :max="2030"/>
          </a-form-item>
          <a-form-item label="开课时间" name="startTime">
            <a-date-picker placeholder="开课时间" v-model:value="modifyCoursesForm.startTime" format="YYYY-MM-DD"/>
          </a-form-item>

          <a-form-item label="课程图片">
            <a-upload v-model:fileList="modifyfileList"
                      :name="uploadName"
                      accept=".jpg,.png,.jpeg"
                      list-type="picture-card"
                      :show-upload-list="false"
                      :action="uploadUrl"
                      @change="modifyfileUploadChange"
                      :before-upload="checkImg">
              <img alt="上传图片" :src="getFileUrl(modifyCoursesForm.iconId)" style="cursor: pointer; width: 300px;"/>
            </a-upload>
          </a-form-item>

          <a-form-item label="课程简介" name="description">
            <a-textarea v-model:value="modifyCoursesForm.description"/>
          </a-form-item>
          <a-form-item label="评分方法" name="scoringMethod">
            <a-textarea v-model:value="modifyCoursesForm.scoringMethod"/>
          </a-form-item>
          <a-form-item label="参考书" name="textbook">
            <a-textarea v-model:value="modifyCoursesForm.textbook"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" :loading="modifySending" html-type="submit">修改</a-button>
            <a-divider type="vertical"/>
            <a-button type="default" @click="closeModifyCoursesModal">关闭</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </modal>

  </div>
</template>

<script lang="ts">
import { reactive, ref, readonly, getCurrentInstance } from 'vue';
import modal from '../base/modal.vue'
import { Courses, newCourses, getAllCourses, modifyCourses } from "../../api/courses";
import { CoursesStatus, getFileUrl, Role, uploadUrl, checkImg, uploadName } from "../../type";
import { searchUser } from "../../api/user";
import  { message } from 'ant-design-vue'
import debounce from 'lodash.debounce'
import { useRouter } from "vue-router";

export default {
  components: { modal },
  setup() {
    // 课程数据显示
    const columns = readonly([
      {dataIndex: 'id', title: '课程ID', key: 'id'},
      {dataIndex: 'name', title: '课程名字', key: 'name'},
      {dataIndex: 'institute', title: '开课学院', key: 'institute'},
      {dataIndex: 'teachers', title: '老师', slots: { customRender: 'teachers' }, key: 'teachers'},
      {dataIndex: 'status', title: '开课状态', key: 'status'},
      {dataIndex: 'year', title: '开课学年', key: 'year'},
      {title: '操作', key: 'action', slots: { customRender: 'actions' }}
    ])
    const data = ref([])
    const dataLoading = ref(false)
    const pagination = reactive({
      pageSize: 10,
      current: 1,
      total: 0
    })
    const getData = async () => {
      dataLoading.value = true
      try {
        const res = await getAllCourses({start: pagination.pageSize * (pagination.current - 1)})
        pagination.total = res.totalCount;
        data.value = res.resList.map((value) => {
          return {
            ...value.course,
            teachers: value.teachers,
          }
        });
      } catch (e) {
        message.error(e);
      } finally {
        dataLoading.value = false
      }
    }
    getData()
    const handleTableChange = async (p) => {
      console.log(p)
      pagination.current = p.current;
      getData();
    }
    // 修改课程
    const modifyModalVisible = ref(false)
    const modifyTeachers = ref('')
    const modifySending = ref(false)
    const modifyCoursesForm : Courses = reactive({})
    const openModifyModal = (record) => {
      Object.assign(modifyCoursesForm, record)
      modifyTeachers.value = record.teachers.map((value) => `@${value.name}, ${value.id}`).join(' ');
      modifyModalVisible.value = true
    }

    const clickModifyCourses = async () => {
      try {
        modifySending.value = true
        let teacherArray = modifyTeachers.value.split('@').map((value, index) => {
          if(!index) return undefined;
          return value.split(',')[1].trim()
        });
        await modifyCourses(modifyCoursesForm, teacherArray.slice(1));
        message.success('修改成功')
        modifySending.value = false
        getData();
        closeModifyCoursesModal();
      } catch (e) {
        message.error(e);
      } finally {
        modifySending.value = false
      }
    }
    const closeModifyCoursesModal = () => modifyModalVisible.value = false
    // 添加课程
    const addModalVisible = ref(false)
    const openAddModal = () => addModalVisible.value=true
    const newTeachers = ref('')
    const newSending = ref(false)
    const newCoursesForm : Courses = reactive({
      name: '',
      institute: '',
      status: CoursesStatus.pending,
      year: 2020,
      startTime: null,
      description: '',
      scoringMethod: '',
      iconId: null,
      textbook: '',
    })
    const clickNewCourses = async () => {
      try {
        newSending.value = true
        let teacherArray = newTeachers.value.split('@').map((value, index) => {
          if(!index) return undefined;
          return value.split(',')[1].trim()
        });
        await newCourses(newCoursesForm, teacherArray.slice(1));
        message.success('新建成功')
        newSending.value = false
        getData()
        closeNewCoursesModal();
      } catch (e) {
        message.error(e);
      } finally {
        newSending.value = false
      }
    }
    const closeNewCoursesModal = () => addModalVisible.value = false
    // 搜索教师
    const loading = ref(false);
    const users = ref([])
    let searchV;
    const onSearch = (search) => {
      searchV = search;
      loading.value = !!search
      users.value = []
      loadTeacherUsers(search)
    }
    const loadTeacherUsers = debounce(async (key) => {
      if(!key) {
        users.value = []
        return ;
      }
      try {
        if(searchV !== key)
          return;
        users.value = await searchUser({ keyword: key, limit: 10, role: Role.teacher })
        loading.value = false
      } catch (e) {
        message.error(e);
      }
    }, 300)

    // 上传头像
    const fileList = ref([])
    const fileUploadChange = (info) => {
      if (info.file.status === 'done') {
        message.success('上传成功')
        console.log(info)
        newCoursesForm.iconId = info.file.response.fileList[0].id
      }
      if (info.file.status === 'error') {
        message.error(info.file.response.error)
      }
    }

    const modifyfileList = ref([])
    const modifyfileUploadChange = (info) => {
      if (info.file.status === 'done') {
        message.success('上传成功')
        console.log(info)
        modifyCoursesForm.iconId = info.file.response.fileList[0].id
      }
      if (info.file.status === 'error') {
        message.error(info.file.response.error)
      }
    }



    return { columns, data, addModalVisible, newTeachers, users, dataLoading, uploadUrl, checkImg, modifyfileList, modifyfileUploadChange,
      pagination, handleTableChange, openAddModal, newCoursesForm, newSending,
      closeNewCoursesModal, clickNewCourses, loading, getFileUrl, onSearch, fileList, fileUploadChange, uploadName,
      modifyModalVisible, openModifyModal, modifyTeachers, modifySending, modifyCoursesForm, clickModifyCourses, closeModifyCoursesModal
    }
  }
}
</script>
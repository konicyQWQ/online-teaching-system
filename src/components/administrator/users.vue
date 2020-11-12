<template>
  <div>
    <a-card class="ant-card-shadow">
      <template #title><h3>管理所有用户</h3></template>
      <div>
        <a-input-search placeholder="搜索用户名" v-model:value="keyword" enter-button @search="handleChange(null, null, null)"/>
      </div>
      <a-table :columns="columns"
               :data-source="state.data"
               :loading="state.loading"
               :pagination="pagination"
               :row-key="record => record.id"
               @change="handleChange">
        <template #grade="{ text }">
          大学 {{ text }} 年级
        </template>
        <template #role="{ text }">
          <a-tag color="blue">
            {{ text === Role.student ? '学生'
              :text === Role.teacher ? '老师'
              :text === Role.administrator ? '管理员' : '空'}}
          </a-tag>
        </template>
        <template #gender="{ text }">
          {{ text === 0 ? '男' : '女' }}
        </template>
        <template #action="{ text, record }">
          <a @click="openModifyModal(record)">修改</a>
          <a-divider type="vertical"/>
          <confirm-delete @confirm="confirmDelete(record)"/>
        </template>
      </a-table>


    </a-card>
    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }" :loading="modalLoading">
        <template #title><h3 style="text-align: center">修改学生信息</h3></template>
        <create-form :model="model" :fields="fields" :form="form"/>
      </a-card>
    </modal>
  </div>
</template>

<script lang="ts">
import {reactive, readonly, ref, UnwrapRef, watch} from 'vue'
import {useAllUser} from "../../hooks/allUser";
import {Gender, Role} from "../../type";
import confirmDelete from "../base/confirmDelete.vue";
import {deleteUser, modifyUserInfo, newGetUserInfo} from "../../api/user";
import {message} from "ant-design-vue";
import modal from "../base/modal.vue";
import createForm, {Fields} from "../base/createForm.vue";

export default {
  components: { confirmDelete, modal, createForm },
  setup() {
    const columns = readonly([
      {dataIndex: 'id', title: '学号', key: 'id'},
      {dataIndex: 'name', title: '姓名', key: 'name'},
      {dataIndex: 'gender', title: '性别', key: 'gender', slots: { customRender: 'gender' }},
      {dataIndex: 'grade', title: '年级', slots: { customRender: 'grade' }, key: 'grade'},
      {dataIndex: 'phone', title: '手机', key: 'phone'},
      {dataIndex: 'role', title: '身份', slots: { customRender: 'role' }, key: 'role', filters: [
          {text: '管理员', value: Role.administrator},
          {text: '教师', value: Role.teacher},
          {text: '学生', value: Role.student}
        ]},
      {dataIndex: 'action', title: '操作', slots: { customRender: 'action' }, key: 'action'}
    ])
    const { state, fetchData } = useAllUser()
    const keyword = ref('')
    const pagination = reactive({
      pageSize: 10,
      current: 1,
      total: state.total
    })
    watch(() => state.total, () => {
      pagination.total = state.total
    })
    const handleChange = async (p, filters, sorter) => {
      if(p || filters || sorter) {
        pagination.current = p.current
      }
      await fetchData({
        start: pagination.pageSize * (pagination.current - 1),
        limit: pagination.pageSize,
        keyword: keyword.value,
        roles: filters ? filters.role : [0, 1, 2, 3],
      })
    }
    handleChange(null, null, null);

    // 修改和删除
    const confirmDelete = async (record) => {
      try {
        await deleteUser({ userID: record.id })
        message.success('删除成功')
        handleChange(null, null, null);
      } catch (e) {
        message.error(e.toString())
      }
    }

    const visible = ref(false)
    const modalLoading = ref(false)
    const openModifyModal = async (record) => {
      visible.value = true
      modalLoading.value = true
      try {
        const { userInfo, courseList } =  await newGetUserInfo({ userID: record.id })
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
    const fields : UnwrapRef<Fields> = reactive({
      id: {
        type: 'input',
        label: '学号',
        rule: {
          required: true,
          message: '学号不能为空'
        }
      },
      name: {
        type: 'input',
        label: '姓名',
        rule: {
          required: true,
          message: '姓名不能为空'
        }
      },
      gender: {
        type: 'radio',
        label: '性别',
        radios: [{ value: Gender.male, hint: '男' }, { value: Gender.female, hint: '女' }]
      },
      phone: {
        type: 'input',
        label: '手机号'
      },
      email: {
        type: 'input',
        label: '邮箱'
      },
      role: {
        type: 'radio',
        radios: [{value: Role.student, hint: '学生'}, { value: Role.teacher, hint: '老师' }, {value: Role.administrator, hint: '管理员'}],
        label: '身份'
      },
      introduction: {
        type: 'textarea',
        label: '个人简介'
      },
    })
    const form = reactive({
      finish: async () => {
        try {
          await modifyUserInfo(model)
          visible.value = false
          message.success('修改成功')
          handleChange(null, null, null)
        } catch (e) {
          message.error(e)
        }
      },
      cancel: () => {
        visible.value = false
      }
    })
    return { columns, state, pagination, fetchData, handleChange, model, fields, form,
      keyword, Role, confirmDelete, visible, openModifyModal, modalLoading }
  }
}
</script>
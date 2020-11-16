<template>
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>分组名单</h3>
    </template>

    <div style="display: flex;" v-if="notGuestAndStudent(courseInfo.role)">
      <create-form :model="model" :fields="fields" :form="form" style="flex: 1"/>
      <confirm-delete @confirm="deleteGroup" :hint="'删除所有组'" :type="'danger'"/>
    </div>

    <a-table :columns="columns" :loading="state.loading" :data-source="state.data">
      <template #action="{text, record}">
        <a @click="add(record.groupID)" v-if="!isInGroup">进入</a>
        <a-divider type="vertical"/>
        <a @click="remove(record.groupID)" v-if="record.member.find(value => value.id === id) || record.leader.id === id" style="color: red">退出</a>
      </template>
      <template #leader="{text, record}">
        <a-tag color="red" v-if="text.id">{{text.id}}:{{text.name}}</a-tag>
      </template>
      <template #member="{text, record}">
        <a-tag color="green" v-for="item in text">{{item.id}}:{{item.name}}</a-tag>
      </template>
    </a-table>

  </a-card>
</template>

<script lang="ts">
import {inject, reactive, readonly, toRefs, computed} from 'vue'
import {notGuestAndStudent} from "../../type/user";
import createForm from "../base/createForm.vue";
import {GroupCountField, MaxCountField, useGroup} from "../../type/group";
import confirmDelete from "../base/confirmDelete.vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {addGroup, createGroup, leaveGroup, removeGroup} from "../../api/group";
import {message} from "ant-design-vue";

export default {
  components: {createForm, confirmDelete},
  setup() {
    const courseInfo = inject('courseInfo')
    const store = useStore()
    const route = useRoute()
    const model = reactive({
      groupCount: 0,
      maxCount: 0
    })
    const fields = reactive({
      groupCount: GroupCountField,
      maxCount: MaxCountField
    })
    const {id} = toRefs(store.state)
    const form = reactive({
      layout: 'inline',
      submitHint: '新建',
      async finish() {
        try {
          await createGroup(route.params.cid, model.groupCount, model.maxCount)
          message.success('创建成功')
          fetchData()
        } catch (e) {
          message.error(e)
        }
      }
    })
    const { state, fetchData } = useGroup(route.params.cid)
    fetchData()

    const columns = readonly([
      {dataIndex: 'groupID', title: '组号'},
      {dataIndex: 'leader', title: '组长', slots: {customRender: 'leader'}},
      {dataIndex: 'member', title: '组员', slots: {customRender: 'member'}},
      {dataIndex: 'action', title: '操作', slots: {customRender: 'action'}}
    ])

    // 删除所有组
    async function deleteGroup() {
      try {
        await removeGroup(route.params.cid)
        message.success('删除成功')
        fetchData()
      } catch (e) {
        message.error(e)
      }
    }
    const add = async (groupID) => {
      try {
        await addGroup(route.params.cid, groupID)
        message.success('加入成功')
        fetchData()
      } catch (e) {
        message.error(e)
      }
    }
    const remove = async (groupID) => {
      try {
        await leaveGroup(route.params.cid, groupID)
        message.success('退出成功')
        fetchData()
      } catch (e) {
        message.error(e)
      }
    }

    const isInGroup = computed(() => {
      return state.data.find(value => {
        return value.leader.id === id.value || value.member.find(value => value.id === id.value);
      })
    })

    return {courseInfo, notGuestAndStudent, model, fields, form, deleteGroup, columns, state, add, remove, id, isInGroup}
  }
}
</script>
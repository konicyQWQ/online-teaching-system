<template>
  <div>
    <div v-if="[Role.teacher, Role.administrator, Role.assistant].indexOf(courseInfo.role) !== -1">
      <nav-card :tab-list="nav" :router="false">
        <template #title>
          <h3>
            <edit-two-tone twotonecolor="#eb2f96"/>
            课程操作
          </h3>
        </template>
      </nav-card>
    </div>

    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">新建公告</h3></template>
        <create-form :model="model" :fields="fields" :form="form"/>
      </a-card>
    </modal>
  </div>
</template>

<script lang="ts">
import navCard from '../../base/nav-card.vue'
import modal from "../../base/modal.vue";
import {EditTwoTone} from "@ant-design/icons-vue";
import {inject, readonly, ref, reactive} from "vue";
import {useRoute} from 'vue-router'
import {addBulletin} from "../../../api/bulletin";
import {message} from "ant-design-vue";
import createForm from "../../base/createForm.vue";
import {Role} from "../../../type/user";
import {BulletinContentField, BulletinModel, BulletinTitleField} from "../../../type/bulletin";

export default {
  components: {navCard, EditTwoTone, modal, createForm},
  setup() {
    const route = useRoute();
    const courseInfo = inject('courseInfo')
    const fetchBulletin = inject('fetchBulletin')
    const visible = ref(false)
    const nav = readonly([
      {
        name: '新建公告',
        handleClick: () => {
          visible.value = true
        }
      }
    ])

    const model = reactive(new BulletinModel({courseId: parseInt(route.params.cid)}))
    const fields = reactive({
      title: BulletinTitleField,
      content: BulletinContentField
    })
    const form = reactive({
      submitHint: '新建',
      cancel: () => visible.value = false,
      finish: async () => {
        try {
          await addBulletin({bulletin: model})
          message.success('添加公告成功');
          visible.value = false
          await fetchBulletin();
        } catch (e) {
          message.error(e)
        }
      }
    })
    return {nav, courseInfo, visible, Role, form, model, fields}
  }
}
</script>
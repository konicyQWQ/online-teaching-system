<template>
  <div>
    <a-card class="ant-card-shadow">
      <template v-slot:title>
        <h3>
          <BellTwoTone twoToneColor="#eb2f96"/>
          公告
        </h3>
      </template>
      <a-list item-layout="vertical" size="large" :data-source="state.bulletin" :loading="state.loading">
        <template v-slot:renderItem="{ item, index }">
          <a-list-item>
            <template v-slot:actions v-if="notGuestAndStudent(courseInfo.role)">
              <a-button type="link" @click="openModal(item)">编辑</a-button>
              <confirm-delete @confirm="delBulletin(item)"/>
            </template>
            <a-list-item-meta :description="`${new Date(item.time).toLocaleDateString()} 更新`">
              <template v-slot:title>
                {{ item.title }}
              </template>
            </a-list-item-meta>
            <p>
              {{ item.content }}
            </p>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">修改公告</h3></template>
        <create-form :model="model" :fields="fields" :form="form"/>
      </a-card>
    </modal>
  </div>
</template>

<script lang="ts">
import {inject, ref, reactive} from 'vue'
import {BellTwoTone} from '@ant-design/icons-vue'
import {deleteBulletin, updateBulletin} from "../../api/bulletin";
import {message} from 'ant-design-vue'
import modal from "../base/modal.vue";
import confirmDelete from "../base/confirmDelete.vue";
import {Role, notGuestAndStudent} from "../../type/user";
import {BulletinContentField, BulletinModel, BulletinTitleField} from "../../type/bulletin";
import createForm from "../base/createForm.vue";

export default {
  components: {BellTwoTone, modal, confirmDelete, createForm},
  setup() {
    const state = inject('bulletinState');
    const fetchBulletin = inject('fetchBulletin')
    const courseInfo = inject('courseInfo')

    const delBulletin = async (id) => {
      try {
        await deleteBulletin({bulletinID: id.bulletinId})
        message.success('删除成功')
        fetchBulletin()
      } catch (e) {
        message.error(e);
      }
    }

    const visible = ref(false)
    const openModal = (item) => {
      Object.assign(model, item)
      visible.value = true
    }

    const model = reactive(new BulletinModel())
    const fields = reactive({
      title: BulletinTitleField,
      content: BulletinContentField
    })
    const form = reactive({
      submitHint: '修改',
      cancel: () => visible.value = false,
      finish: async () => {
        try {
          await updateBulletin({bulletin: model})
          message.success('修改公告成功');
          visible.value = false
          await fetchBulletin();
        } catch (e) {
          message.error(e)
        }
      }
    })

    return {
      notGuestAndStudent,
      state,
      delBulletin,
      courseInfo,
      Role,
      visible,
      openModal,
      model,
      fields,
      form
    }
  }
}
</script>
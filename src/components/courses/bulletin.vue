<template>
  <div>
    <a-card class="ant-card-shadow">
      <template v-slot:title><h3><BellTwoTone twoToneColor="#eb2f96"/> 公告</h3></template>
      <a-list item-layout="vertical" size="large" :data-source="state.bulletin" :loading="state.loading">
        <template v-slot:renderItem="{ item, index }">
          <a-list-item>
            <template v-slot:actions v-if="courseInfo.role in [Role.teacher, Role.assistant, Role.administrator]">
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
        <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="clickModifyBulletin">
          <a-form-item label="标题" name="title">
            <a-input v-model:value="form.title"/>
          </a-form-item>
          <a-form-item label="内容" name="content">
            <a-textarea v-model:value="form.content"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" :loading="modifyLoading" html-type="submit">修改</a-button>
            <a-divider type="vertical"/>
            <a-button type="default" @click="closeModal">关闭</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </modal>
  </div>
</template>

<script>
import { inject, ref, reactive } from 'vue'
import { BellTwoTone } from '@ant-design/icons-vue'
import {deleteBulletin, updateBulletin} from "../../api/bulletin";
import { message } from 'ant-design-vue'
import modal from "../base/modal.vue";
import confirmDelete from "../base/confirmDelete.vue";
import { Role } from "../../type/user";

export default {
  components: { BellTwoTone, modal, confirmDelete },
  setup() {
    const state = inject('bulletinState');
    const fetchBulletin = inject('fetchBulletin')
    const courseInfo = inject('courseInfo')

    const delBulletin = async (id) => {
      try {
        await deleteBulletin({ bulletinID: id.bulletinId })
        message.success('删除成功')
        fetchBulletin()
      } catch (e) {
        message.error(e);
      }
    }

    const form = reactive({
      title: '',
      content: '',
      bulletinId: 0,
      courseId: 0,
      time: ''
    })

    const visible = ref(false)
    const modifyLoading = ref(false)
    const closeModal = () => visible.value = false

    const openModal = (item) => {
      Object.assign(form, item)
      visible.value = true
    }

    const clickModifyBulletin = async () => {
      modifyLoading.value = true;
      try {
        await updateBulletin({bulletin: form})
        message.success('修改公告成功');
        closeModal()
        fetchBulletin();
      } catch (e) {
        message.error(e)
      } finally {
        modifyLoading.value = false
      }
    }

    return { state, delBulletin, courseInfo, Role, visible, clickModifyBulletin, modifyLoading, openModal, closeModal, form }
  }
}
</script>
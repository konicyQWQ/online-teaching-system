<template>
  <div>
    <div v-if="[Role.teacher, Role.administrator, Role.assistant].indexOf(courseInfo.role) !== -1">
      <nav-card :tab-list="nav" :router="false">
        <template #title>
          <h3><edit-two-tone twotonecolor="#eb2f96"/> 课程操作</h3>
        </template>
      </nav-card>
    </div>

    <modal v-model:visible="visible">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">新建公告</h3></template>
        <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="clickAddBulletin">
          <a-form-item label="标题" name="title">
            <a-input v-model:value="form.title"/>
          </a-form-item>
          <a-form-item label="内容" name="content">
            <a-textarea v-model:value="form.content"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4 }">
            <a-button type="primary" :loading="addLoading" html-type="submit">新建</a-button>
            <a-divider type="vertical"/>
            <a-button type="default" @click="closeModal">关闭</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </modal>
  </div>
</template>

<script lang="ts">
import navCard from '../../base/nav-card.vue'
import modal from "../../base/modal.vue";
import {EditTwoTone} from "@ant-design/icons-vue";
import {inject, readonly, ref, reactive} from "vue";
import { Role } from "../../type/user";
import { useRoute } from 'vue-router'
import { addBulletin } from "../../../api/bulletin";
import {message} from "ant-design-vue";

export default {
  components: { navCard, EditTwoTone, modal },
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

    const form = reactive({
      title: '',
      content: '',
      courseId: route.params.cid,
      time: new Date().toJSON()
    })

    const addLoading = ref(false)
    const closeModal = () => visible.value = false

    const clickAddBulletin = async () => {
      addLoading.value = true;
      try {
        await addBulletin({bulletin: form})
        message.success('添加公告成功');
        closeModal()
        fetchBulletin();
      } catch (e) {
        message.error(e)
      } finally {
        addLoading.value = false
      }
    }

    return { nav, courseInfo, visible, Role, form, clickAddBulletin, addLoading, closeModal }
  }
}
</script>
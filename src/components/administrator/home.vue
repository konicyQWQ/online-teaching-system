<template>
  <div>
    <a-card class="ant-card-shadow" :loading="loading">
      <template #title>
        <h3>首页展示图片</h3>
      </template>
      <a-row>
        <a-col
          v-for="(page, index) in allHomePage.pages"
          :key="index"
          @click="openModal(index)"
          style="cursor: pointer"
          :span="4"
        >
          <img :src="StaticPreviewUrl(page.fileId)" style="width: 100%" />
        </a-col>
      </a-row>

      <div style="text-align: center; margin-top: 1em">
        <a-button type="primary" @click="newPage">新建</a-button>
        <a-button type="primary" @click="submit">保存</a-button>
      </div>
    </a-card>

    <modal v-model:visible="visible">
      <a-card
        style="width: 600px; margin: 0 2em"
        :body-style="{ overflowY: 'auto', maxHeight: '600px' }"
      >
        <template #title>
          <h3>图片上传</h3>
        </template>
        <create-form :model="model" :fields="fields" :form="form"></create-form>
      </a-card>
    </modal>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue'
import { StaticPreviewUrl } from '../../type/file'
import createForm from '../base/createForm.vue'
import modal from '../base/modal.vue'
import request from '../../api/axios'
import store from '../../store'
import { message } from 'ant-design-vue'

interface HomePage {
  id?: number
  fileId: number
  url: string
}

export default {
  components: { createForm, modal },
  setup() {
    const allHomePage = reactive<{ pages: HomePage[] }>({
      pages: [],
    })
    const newPage = () => allHomePage.pages.push({ fileId: 0, url: '' })
    const submit = async () => {
      try {
        const pages = allHomePage.pages.map((value, index) => {
          return {
            id: index + '',
            ...value,
          }
        })
        await request.post('system/home', {
          pages: pages,
          token: store.state.token,
        })
        message.success('保存成功')
      } catch (e) {
        message.error('保存失败')
      }
    }

    const currentIndex = ref(0)
    const model = reactive<HomePage>({
      fileId: 0,
      url: '',
    })
    const visible = ref(false)
    const fields = reactive({
      fileId: {
        type: 'avatar',
        label: '图片',
        file: {},
      },
      url: {
        type: 'input',
        label: '路径',
      },
    })
    const form = reactive({
      submitHint: '保存',
      cancelHint: '删除',
      finish: () => {
        Object.assign(allHomePage.pages[currentIndex.value], model)
        visible.value = false
      },
      cancel: () => {
        allHomePage.pages.splice(currentIndex.value, 1)
        visible.value = false
      },
    })

    const openModal = (index) => {
      visible.value = true
      currentIndex.value = index
      Object.assign(model, allHomePage.pages[currentIndex.value])
    }

    /**
     * 获取图片信息
     */
    const loading = ref(true)

    async function fetchData() {
      try {
        const res = await request.get('system/home')
        allHomePage.pages = res.data.pages
      } catch (e) {
        message.error(e)
      } finally {
        loading.value = false
      }
    }

    fetchData()

    return { allHomePage, newPage, submit, currentIndex, model, visible, fields, form, openModal, loading, fetchData, StaticPreviewUrl }
  }
}
</script>
<template>
  <a-card :loading="loading" class="ant-card-shadow" style="margin: 0 2em">
    <a-carousel autoplay style="width: 50%; margin: 0 auto;">
      <a :href="page.url" v-for="(page, index) in allHomePage.pages" :key="index">
        <img :src="StaticPreviewUrl(page.fileId)">
      </a>
    </a-carousel>
  </a-card>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import request from '../api/axios'
import { message } from 'ant-design-vue'
import { StaticPreviewUrl } from '../type/file'

interface HomePage {
  id?: number,
  fileId: number,
  url: string
}

export default {
  setup() {
    const allHomePage = reactive<{pages: HomePage[]}>({
      pages: []
    })

    /**
     * 获取图片信息
     */
    const loading = ref(true)
    async function fetchData() {
      try {
        const res = await request.get('system/home');
        allHomePage.pages = res.data.pages
      } catch (e) {
        message.error(e)
      } finally {
        loading.value = false
      }
    }
    fetchData();

    return { allHomePage, loading, fetchData, StaticPreviewUrl }
  }
}
</script>
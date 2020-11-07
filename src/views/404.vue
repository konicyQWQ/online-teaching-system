<template>
  <a-card class="ant-card-shadow not-found">
    <a-result status="404" title="404" sub-title="对不起，你访问的页面不存在">
      <template #extra>
        <a-button type="primary" @click="back">
          返回
        </a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script lang="ts">
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter()
    const back = () => {
      router.back();
    }
    return { back }
  }
}
</script>

<style scoped>
.not-found {
  width: 800px;
  margin: 0 auto;
}
</style>
<template>
  <a-card class="ant-card-shadow no-auth">
    <a-result status="403" title="403" sub-title="你没有权限访问这个页面">
      <template #extra>
        <a-button type="primary" @click="back">
          返回
        </a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>
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
.no-auth {
  width: 800px;
  margin: 0 auto;
}
</style>
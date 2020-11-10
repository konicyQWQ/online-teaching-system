<template>
  <a-badge status="default" text="等待开课" v-if="status===CoursesStatus.pending"/>
  <a-badge status="processing" text="正在开课" v-if="status===CoursesStatus.open"/>
  <a-badge status="error" text="已经结束" v-if="status===CoursesStatus.closed"/>
</template>

<script>
import { CoursesStatus } from "../../../type";

export default {
  name: "courseStatus",
  props: ['status'],
  setup() {
    return { CoursesStatus }
  }
}
</script>
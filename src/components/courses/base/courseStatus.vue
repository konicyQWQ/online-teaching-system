<template>
  <a-badge status="default" text="等待开课" v-if="status===CourseStatus.pending"/>
  <a-badge status="processing" text="正在开课" v-if="status===CourseStatus.open"/>
  <a-badge status="error" text="已经结束" v-if="status===CourseStatus.closed"/>
</template>

<script>
import {CourseStatus} from "../../../type/course";

export default {
  name: "courseStatus",
  props: ['status'],
  setup() {
    return { CourseStatus }
  }
}
</script>
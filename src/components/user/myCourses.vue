<template>
  <a-card class="ant-card-shadow">
    <template #title><h3>我的课程</h3></template>
    <a-list item-layout="horizontal" :data-source="state.data.courseList" :loading="state.loading">
      <template #renderItem="{ item, index }">
        <a-list-item @click="router.push(`/courses/${item.course.id}`)" class="course-list-item">
          <a-list-item-meta>
            <template #title>
              <h3>{{ item.course.name }}</h3>
            </template>
            <template #avatar>
              <img :src="StaticPreviewUrl(item.course.iconId)" style="width: 200px; height: 100px">
            </template>
            <template #description>
              <p style="margin-bottom: 0; color: #444">{{ item.course.institute }} {{ item.course.year }}</p>
              <p style="margin-top: 0; color: #666">{{ item.course.description }}</p>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts">
import {useRouter} from 'vue-router'
import {useUserWithCourses} from "../../hooks/userWithCourses";
import {StaticPreviewUrl} from "../../type/file";

export default {
  setup() {
    const router = useRouter()
    const {state, fetchData} = useUserWithCourses()

    return {state, StaticPreviewUrl, router}
  }
}
</script>

<style scoped lang="scss">
.course-list-item {
  transition: all .4s ease;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
}
</style>
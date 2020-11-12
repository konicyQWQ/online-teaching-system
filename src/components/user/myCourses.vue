<template>
  <a-card class="ant-card-shadow">
    <template #title><h3>我的课程</h3></template>
    <a-list item-layout="horizontal" :data-source="myCourses" :loading="loading">
      <template #renderItem="{ item, index }">
        <a-list-item @click="router.push(`/courses/${item.course.id}`)" class="course-list-item">
          <a-list-item-meta>
            <template #title>
              <h3>{{ item.course.name }}</h3>
            </template>
            <template #avatar>
              <img :src="getFileUrl(item.course.iconId)" style="width: 200px; height: 100px">
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

<script>
import { newGetUserInfo } from "../../api/user";
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { getFileUrl } from "../../type";
import { useRouter } from 'vue-router'

export default {
  setup() {
    const myCourses = ref([])
    const loading = ref(true)
    const router = useRouter()

    newGetUserInfo({})
        .then(res => {
          myCourses.value = res.courseList.teachList.concat(res.courseList.courseList).concat(res.courseList.assistList);
          loading.value = false
        })
        .catch(e => {
          message.error(e.toString())
        })

    return { myCourses, loading, getFileUrl, router }
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
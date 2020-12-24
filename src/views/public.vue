<template>
  <two-col :right="false">
    <template #left>
      <a-card class="ant-card-shadow" :loading="state.loading">
        <template #title>
          <h3 style="float: left">{{ hint }}</h3>
          <span style="float: right">
            <a-input-search
              v-model:value="keyword"
              placeholder="搜索课程"
              enter-button
              @search="onSearch"
            />
          </span>
        </template>
        <div class="body">
          <div class="course-list">
            <div
              v-for="course in state.data"
              :key="course.course.id"
              class="course"
            >
              <img
                :src="StaticPreviewUrl(course.course.iconId)"
                @click="goCoursePage(course.course.id)"
                class="course-img"
              />
              <a-tooltip :title="course.teachers[0].name">
                <a-avatar
                  :src="StaticPreviewUrl(course.teachers[0].avatarId, 'user')"
                />
              </a-tooltip>
              {{ course.course.name }}
            </div>
          </div>
        </div>
      </a-card>
    </template>
  </two-col>
</template>

<script lang="ts">
import twoCol from '../components/base/two-col.vue'
import { useAllCoursesState } from '../hooks/allCourses'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { StaticPreviewUrl } from '../type/file'

export default {
  components: { twoCol },
  setup() {
    const { state, fetchData } = useAllCoursesState()
    const router = useRouter()
    const keyword = ref('')
    const hint = ref('全部')

    // 搜索
    function onSearch() {
      fetchData({ keyword: keyword.value })
      hint.value = keyword.value ? `${keyword.value}的搜索结果` : '全部'
    }

    // 跳转对应课程路由
    const goCoursePage = (id) => router.push(`/courses/${id}`)

    return { state, keyword, onSearch, hint, goCoursePage, StaticPreviewUrl }
  },
}
</script>

<style scoped>
.body {
  margin: 0 auto;
  width: 1150px;
}

.course-list {
  margin: 0 auto;
}

.course {
  width: 250px;
  display: inline-block;
  margin: 14px;
}

.course-img {
  width: 100%;
  height: 138px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
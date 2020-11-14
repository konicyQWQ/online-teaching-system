<template>
  <two-col :right="false">
    <template #left>
      <a-card class="ant-card-shadow" :loading="state.loading">
        <template #title>
          <h3 style="float: left">{{ hint }}</h3>
          <span style="float: right">
            <a-input-search v-model:value="keyword" placeholder="搜索课程" enter-button @search="onSearch"/>
          </span>
        </template>
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="6" v-for="course in state.data">
            <a-card @click="goCoursePage(course.course.id)" style="cursor: pointer">
              <template #cover>
                <img :src="StaticPreviewUrl(course.course.iconId)" style="height: 200px"/>
              </template>
              <a-card-meta :title="course.course.name">
                <template #avatar>
                  <a-tooltip :title="course.teachers[0].name">
                    <a-avatar :src="StaticPreviewUrl(course.teachers[0].avatarId)"/>
                  </a-tooltip>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </template>
  </two-col>
</template>

<script lang="ts">
import twoCol from '../components/base/two-col.vue'
import {useAllCoursesState} from "../hooks/allCourses";
import {ref} from 'vue'
import {useRouter} from "vue-router";
import {StaticPreviewUrl} from "../type/file";

export default {
  components: {twoCol},
  setup() {
    const {state, fetchData} = useAllCoursesState();
    const router = useRouter()
    const keyword = ref('')
    const hint = ref('全部')

    // 搜索
    function onSearch() {
      fetchData({keyword: keyword.value})
      hint.value = keyword.value ? `${keyword.value}的搜索结果` : '全部'
    }

    // 跳转对应课程路由
    const goCoursePage = (id) => router.push(`/courses/${id}`)

    return {state, keyword, onSearch, hint, goCoursePage, StaticPreviewUrl}
  }
}
</script>
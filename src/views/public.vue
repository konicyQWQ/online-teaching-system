<template>
  <two-col :right="false">
    <template #left>
      <a-card class="ant-card-shadow" :loading="loading">
        <template #title>
          <h3 style="float: left">{{hint}}</h3>
          <span style="float: right">
            <a-input-search v-model:value="keyword" placeholder="搜索课程" enter-button @search="onSearch"/>
          </span>
        </template>
        <a-row type="flex" align="middle" :gutter="[16, 16]">
          <a-col :span="6" v-for="course in show">
            <a-card @click="goCoursePage(course.course.id)" style="cursor: pointer">
              <template #cover>
                <img :src="getFileUrl(course.course.iconId)" style="height: 200px"/>
              </template>
              <a-card-meta :title="course.course.name">
                <template #avatar>
                  <a-tooltip :title="course.teachers[0].name">
                    <a-avatar :src="getFileUrl(course.teachers[0].avatarId)" />
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
import { useAllCoursesState } from "../hooks/allCourses";
import { getFileUrl } from "../type";
import { ref, watch, computed } from 'vue'
import { useRouter } from "vue-router";

export default {
  components: { twoCol },
  setup() {
    const { state, loading } = useAllCoursesState();
    const search = ref([])
    const keyword = ref('')
    const hint = ref('全部')
    const router = useRouter()

    watch(loading, ()=>{
      search.value = state.value;
    })

    const onSearch = () => {
      search.value = state.value.filter((value) => {
        return value.course.name.trim().toLowerCase().includes(keyword.value.trim().toLowerCase());
      })
      if(keyword.value === '')
        hint.value = '全部'
      else
        hint.value = `${keyword.value}的搜索结果`;
    }

    const goCoursePage = (id) => {
      router.push(`/courses/${id}`);
    }

    const show = computed(() => {
      return search.value.filter((value) => {
        return value.teachers.length > 0
      })
    })

    return { show, loading, getFileUrl, keyword, onSearch, hint, goCoursePage }
  }
}
</script>

<style scoped>

</style>
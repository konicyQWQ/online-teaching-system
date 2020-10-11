<template>
  <two-col>
    <template v-slot:left>
      <a-card class="ant-card-shadow">
        <template v-slot:title>
          <h3>所有课程</h3>
        </template>
        <a-row :gutter="[24, 48]">
          <a-col v-for="course in allCourses" :key="course.id" :span="6">
            <router-link :to="`/courses/${course.id}`" class="course">
              <img :src="course.image">
              <div class="title"> {{ course.name }}</div>
              <div class="teacher">{{ course.teacher }}</div>
            </router-link>
          </a-col>
        </a-row>
      </a-card>
    </template>
    <template v-slot:right>
      <a-card class="ant-card-shadow">
        <a-input-search v-model:value="searchTitle" enter-button placeholder="搜索课程名称"/>
      </a-card>
    </template>
  </two-col>
</template>

<script>
import twoCol from "../components/base/two-col.vue";
import {allCourses} from "../axios/courses.js";
import {ref} from 'vue';

export default {
  name: "public",
  components: {
    'two-col': twoCol,
  },
  setup() {
    let searchTitle = ref('');
    return {allCourses, searchTitle}
  }
}
</script>

<style lang="scss" scoped>
.course {
  display: inline-block;
  font-weight: 300;

  img {
    width: 100%;
  }

  .title {
    color: #333;
    font-size: 16px;
  }

  .teacher {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
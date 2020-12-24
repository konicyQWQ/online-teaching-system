<template>
  <a-card class="ant-card-shadow" :body-style="{ padding: 0 }">
    <a-card :bordered="false" id="information" :loading="loading">
      <template v-slot:title>
        <h3>
          <ProfileTwoTone twoToneColor="#eb2f96"/>
          课程信息
        </h3>
      </template>
      <a-descriptions bordered>
        <a-descriptions-item label="课程名称">
          {{ courseInfo.course.name }}
        </a-descriptions-item>
        <a-descriptions-item label="课程代码">
          {{ courseInfo.course.id }}
        </a-descriptions-item>
        <a-descriptions-item label="开课院系">
          {{ courseInfo.course.institute }}
        </a-descriptions-item>
        <a-descriptions-item label="开课教师">
          <router-link v-for="teacher in courseInfo.teachers"
                       :to="`/teacher/${teacher.id}`"
                       style="margin-right: 1em"  >
            {{teacher.name}}
          </router-link>
        </a-descriptions-item>
        <a-descriptions-item label="学年期">
          {{ courseInfo.course.year }}
        </a-descriptions-item>
        <a-descriptions-item label="开始日期">
          {{ new Date(courseInfo.course.startTime).toLocaleDateString() }}
        </a-descriptions-item>
        <a-descriptions-item label="课程属性" :span = "3">
          一般课程
        </a-descriptions-item>
        <a-descriptions-item label="开课情况">
          <course-status :status="courseInfo.course.status"/>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" id="description" :loading="loading">
      <template v-slot:title>
        <h3>
          <ProfileTwoTone twoToneColor="#eb2f96"/>
          课程简介
        </h3>
      </template>
      <p v-html="courseInfo.course.description">
      </p>
    </a-card>
    <a-card :bordered="false" id="scoreMethod" :loading="loading">
      <template v-slot:title>
        <h3>
          <ProfileTwoTone twoToneColor="#eb2f96"/>
          课程评分方式
        </h3>
      </template>
      <p v-html="courseInfo.course.scoringMethod">
        
      </p>
    </a-card>
    <a-card :bordered="false" id="textbook" :loading="loading">
      <template v-slot:title>
        <h3>
          <ProfileTwoTone twoToneColor="#eb2f96"/>
          课程教材
        </h3>
      </template>
      <p v-html="courseInfo.course.textbook">
      </p>
    </a-card>
  </a-card>
</template>

<script>
import { ProfileTwoTone } from '@ant-design/icons-vue'
import courseStatus from "./base/courseStatus.vue";
import { inject, computed } from 'vue'

export default {
  components: { ProfileTwoTone, courseStatus },
  setup() {
    const courseInfo =  inject('courseInfo')
    const loading = computed(() => courseInfo.loading)
    return { courseInfo, loading}
  }
}
</script>
<template>
  <div class="content">
    <homework-information />
    <teacher-score v-if="isStudent(courseInfo.role)" />
    <student-submit v-if="isStudent(courseInfo.role)"/>
    <student-list v-if="notGuestAndStudent(courseInfo.role)"/>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import homeworkInformation from "./homework/homeworkInformation.vue";
import studentSubmit from "./homework/studentSubmit.vue";
import teacherScore from "./homework/teacherScore.vue";
import { useHomework } from "../../hooks/homework";
import { provide, inject } from 'vue'
import { isStudent, notGuestAndStudent } from "../../type/user";
import studentList from "./homework/studentList.vue";

export default {
  components: { homeworkInformation, teacherScore, studentSubmit, studentList },
  setup() {
    const route = useRoute()
    const homeworkInfo = useHomework(route.params.hwID)
    provide('oneHomeworkState', homeworkInfo.state)
    provide('oneHomeworkFetchData', homeworkInfo.fetchData)

    const courseInfo = inject('courseInfo')

    return { homeworkInfo, courseInfo, isStudent, notGuestAndStudent }
  }
}
</script>

<style scoped lang="scss">
.content {
  & > * {
    margin-top: 1em;
  }
  & > *:nth-child(1) {
    margin-top: 0;
  }
}
</style>
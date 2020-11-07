<template>
  <two-col>
    <template v-slot:left>
      <fade>
        <router-view></router-view>
      </fade>
    </template>
    <template v-slot:right>
      <nav-card :tabList="tabList">
        <template v-slot:title>
          <h3>
            {{ courses.name }}
            <a-tooltip>
              <template v-slot:title>
                {{ courses.teacher }}
              </template>
              <a-avatar style="float: right;" :src="courses.teacherAvatar"></a-avatar>
            </a-tooltip>
          </h3>
        </template>
      </nav-card>
      <fade>
        <router-view name="extra"></router-view>
      </fade>
    </template>
  </two-col>
</template>

<script>
import twoCol from "../components/base/two-col.vue";
import navCard from "../components/base/nav-card.vue"
import fade from "../components/base/fade.vue";
import { reactive, readonly } from 'vue';

export default {
  name: 'courses',
  components: {
    'two-col': twoCol,
    'nav-card': navCard,
    fade
  },
  setup() {
    const tabList = readonly([
      {key: 'description', name: '课程简介'},
      {key: 'bulletin', name: '公告'},
      {key: 'courseware', name: '课件'},
      {key: 'homework', name: '作业'},
      {key: 'exam', name: '测试'},
      {key: 'discuss', name: '讨论'},
      {key: 'score', name: '成绩'}
    ]);

    const courses = reactive({
      name: '程序设计',
      teacher: '翁恺',
      teacherAvatar: ''
    })

    return {courses, tabList}
  }
}
</script>
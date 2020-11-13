<template>
  <two-col :fixed="true">
    <template v-slot:left>
      <fade>
        <router-view></router-view>
      </fade>
    </template>
    <template v-slot:right>
      <nav-card :tabList="tabList" >
        <template v-slot:title>
          <h3>
            {{ courseInfo.course.name }}
            <a-tooltip v-for="teacher in courseInfo.teachers">
              <template v-slot:title>
                {{ teacher.name }}
              </template>
              <a-avatar style="float: right;" :src="getFileUrl(teacher.avatarId)" />
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
import { readonly, provide, ref, computed } from 'vue';
import { useCourseState } from "../hooks/courses";
import {getFileUrl, Role} from "../type";
import {useRoute} from "vue-router";
import {useBulletin} from "../hooks/bulletin";
import { useCoursewareState } from "../hooks/courseware";
import { useAllHomework } from "../hooks/homework";

export default {
  name: 'courses',
  components: {
    'two-col': twoCol,
    'nav-card': navCard,
    fade
  },
  setup() {
    const tabList = computed(() => {
      if([Role.teacher, Role.administrator].indexOf(courseInfo.course.role) != -1) {
        return [
          {key: 'description', name: '课程简介', keyByName: true},
          {key: 'bulletin', name: '公告', keyByName: true},
          {key: 'courseware', name: '课件', keyByName: true},
          {key: 'homework', name: '作业', keyByName: true},
          {key: 'exam', name: '测试', keyByName: true},
          {key: 'discuss', name: '讨论', keyByName: true},
          {key: 'score', name: '成绩', keyByName: true},
          {key: 'studentList', name: '课程名单', keyByName: true}
        ]
      } else {
        return [
          {key: 'description', name: '课程简介', keyByName: true},
          {key: 'bulletin', name: '公告', keyByName: true},
          {key: 'courseware', name: '课件', keyByName: true},
          {key: 'homework', name: '作业', keyByName: true},
          {key: 'exam', name: '测试', keyByName: true},
          {key: 'discuss', name: '讨论', keyByName: true},
          {key: 'score', name: '成绩', keyByName: true},
        ]
      }
    });
    const route = useRoute()

    const courseInfo = useCourseState(route.params.cid)
    provide('updateCourse', courseInfo.fetchCourse)
    provide('courseInfo', courseInfo.course);

    const bulletinInfo = useBulletin(route.params.cid);
    provide('bulletinState', bulletinInfo.state);
    provide('fetchBulletin', bulletinInfo.fetchBulletin);

    const coursewareInfo = useCoursewareState(route.params.cid);
    provide('coursewareState', coursewareInfo.state)
    provide('fetchCourseware', coursewareInfo.fetchCourseware)

    const homeworkInfo = useAllHomework(route.params.cid);
    provide('homeworkState', homeworkInfo.state)
    provide('fetchHomeworkData', homeworkInfo.fetchData)

    return {courseInfo: courseInfo.course, tabList, getFileUrl}
  }
}
</script>
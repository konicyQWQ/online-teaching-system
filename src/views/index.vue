<template>
  <div class="content">
    <div class="background"></div>
    <div class="announcements">
      <div v-for="item in data.announcements" 
           :key="item.id"
           class="announcement"
           >
        <h4 class="title">{{item.content.Title}}</h4>
        <p>
          {{item.content.Content}}
        </p>
      </div>
    </div>
    <div class="flex-left-width-right">
      <carousel :pages="data.pages" class="carousel"/>
      <a-card class="new-courses ant-card-shadow" 
              :loading="data.loading"
              >
        <template #title>
          <span style="font-size: 1.4em; font-weight: 600">新课速递</span>
        </template>
        <div class="course-list">
          <div
            v-for="course in data.courses"
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
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import carousel from '../components/index/carousel.vue'
import { HomePage, getHomePage } from '../api/homePage'
import { message } from 'ant-design-vue'
import { Event, getSystemAnnouncement } from '../api/system'
import { getAllCourses } from '../api/courses'
import { CourseWithTeachers } from '../type/course'
import { StaticPreviewUrl } from '../type/file'
import { useRouter } from 'vue-router'
import { SmileOutlined } from '@ant-design/icons-vue'

export default {
  components: { carousel, SmileOutlined },
  setup(props, context) {
    const loading = ref(true);
    const router = useRouter()
    const data = reactive<{pages: HomePage[], announcements: Event[], courses: CourseWithTeachers[]}>({
      pages: [],
      announcements: [],
      courses: []
    })
    // 获取数据
    Promise.all([
      getHomePage(), 
      getSystemAnnouncement(0, 4), 
      getAllCourses({keyword: null, start: 0, limit: 2})]
    )
      .then(([res1, res2, res3]) => {
        loading.value = true;
        data.pages = res1;
        data.announcements = res2.eventList;
        data.courses = res3.resList
      })
      .catch(e => message.error("获取数据失败!"))
    // 跳转路由
    const goCoursePage = (id) => router.push(`/courses/${id}`)
    return {data, loading, StaticPreviewUrl, goCoursePage}
  }
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  min-height: 600px;
  width: 80%;
  margin: 0 auto;
}

.new-courses {
  margin: 1em;
  border: none;
}

.carousel {
  width: 100%;
  height: 360px;
  margin: 0 auto 0;
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
  transition: all .5s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.announcements {
  width: 280px;
  height: 284px;
  padding: 23px 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, .4);
  top: 30px;
  position: absolute;
  z-index: 1;
  right: 30px;
  color: rgba(255, 255, 255, .8);
  overflow: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
  }
  &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);
  }
}

.announcement {
  >.title {
    color: inherit;
    font-size: 22px;
    color: rgba(255, 255, 255, .9);
  }
}
</style>
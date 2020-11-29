<template>
  <a-card class="ant-card-shadow">
    <template #title><h3>TA的课程</h3></template>
    <a-list item-layout="horizontal" :data-source="teacher" :loading="loading">
      <template #renderItem="{ item,index}">
        <a-list-item @click="goToCourse(item.course.id)" class="course-list-item">
          <a-list-item-meta>
            <template #title>
              <h3>{{ item.course.name }}</h3>
            </template>
            <template #avatar>
              <img :src="StaticPreviewUrl(item.course.iconId)" style="width: 200px; height: 100px">
            </template>
            <template #description>
              <p style="margin-bottom: 0; color: #444">{{ item.course.institute }} {{ item.course.year }}</p>
              <p style="margin-top: 0; color: #666">课程id:{{ item.course.id }}</p>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts">
import {useRouter} from 'vue-router'
import {StaticPreviewUrl} from "../../type/file";
import requset from '../../api/axios'


export default {
  data(){
    return{
    loading: true,
    id: 0,
    teacher: [],
    };
  },
  mounted(){
    const router = useRouter()
    let id = this.$route.params.id
    requset.get('/user/TeacherPage', {
      params: {
        id
      }
    }).then(res => {
      this.loading = false;
      this.teacher = res.data.teacherDetail.teachList;
      console.log(this.teacher);

    }).catch(e=> {
      console.log("12345")
    })
  },
  methods:{
    StaticPreviewUrl,
    goToCourse(id) {
      this.$router.push(`/courses/${id}`);
    }
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
<template>
   <!-- <a-button-group @click="countbadge(state.data)">
      <a-button type="primary" @click="mode1">
        通知模式1
      </a-button>
      <a-button type="primary" @click="mode2">
        通知模式2
      </a-button>
    </a-button-group> -->
  <div v-if="this.visible==='mode1'">
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>您的消息
      <a-button style="float: right" type="primary" @click="mode2(state.data)">
        <template #icon><SwapOutlined /></template>切换通知模式
      </a-button>
      </h3>
    </template>
    <a-list :loading="state.loading" :data-source="state.data" item-layout="vertical">
      <template #loadMore>
        <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-button type="primary" @click="fetchData" :loading="state.loading" v-if="state.canLoadMore">
            加载更多
          </a-button>
        </div>
      </template>
      <template #renderItem="{ item, index }">
        <a-list-item>
          <a-list-item-meta :description="new Date(item.time).toLocaleString()">
            <template #title>
              {{ item.eventType===EventType.SystemMessage ? '系统公告'
                : item.eventType===EventType.CourseAnnouncement ? '公告'
                : item.eventType===EventType.CoursewareUploaded ? '课件'
                : item.eventType===EventType.DiscussionCreated ? '讨论'
                : item.eventType===EventType.ExamCreated ? '考试'
                : item.eventType===EventType.ExamGraded ? '考试得分'
                : item.eventType===EventType.ExamOpen ? '考试开放'
                : item.eventType===EventType.HomeworkCreated ? '作业'
                : item.eventType===EventType.HomeworkGraded ? '作业得分'
                : item.eventType===EventType.HomeworkNearDDL ? '作业接近截至日期'
                : item.eventType===EventType.HomeworkOpen ? '作业开放' : ''
              }}
            </template>
            <template #avatar>
              <a-avatar style="backgroundColor:#E6F7FF">
                <template #icon>
                  <BellTwoTone />
                </template>
              </a-avatar>
            </template>
          </a-list-item-meta>
          <div v-if="item.eventType===EventType.SystemMessage">
            <a-alert :message="item.content.Title">
              <template #description>
                {{item.content.Content}}
              </template>
            </a-alert>
          </div>
          <div v-else>
            你的课程 <router-link :to="`/courses/${item.courseID}/description`">{{item.courseName}}</router-link>
            <span v-if="item.eventType===EventType.CourseAnnouncement">
              发布了新公告 <router-link :to="`/courses/${item.courseID}/bulletin`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.DiscussionCreated">
              发起了新的讨论 <router-link :to="`/courses/${item.courseID}/discuss/${item.content.Id}`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.CoursewareUploaded">
              上传了新的课件 <router-link :to="`/courses/${item.courseID}/courseware`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.HomeworkCreated">
              创建了新的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.HomeworkOpen">
              的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
              已经 <a-tag color="#108ee9">开放提交</a-tag>
            </span>
            <span v-if="item.eventType===EventType.HomeworkNearDDL">
              的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
              <a-tag color="#f50">即将截止</a-tag>
            </span>
            <span v-if="item.eventType===EventType.HomeworkGraded">
              的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
              得到了 {{item.content.Score}} 分
            </span>
            <span v-if="item.eventType===EventType.ExamOpen">
              的考试 <router-link :to="`/courses/${item.courseID}/exam`">{{item.content.Title}}</router-link>
              已经 <a-tag color="#87d068">开始进行</a-tag>
            </span>
            <span v-if="item.eventType===EventType.ExamCreated">
              创建了新的考试 <router-link :to="`/courses/${item.courseID}/exam`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.ExamGraded">
              的考试 <router-link :to="`/exam/edit?mode=preview&courseID=${item.courseID}&examId=${item.content.Id}`">{{item.content.Title}}</router-link>
              得到了 {{item.content.Score}} 分
            </span>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
  </div>
  <!-- #######################################################下面是通知模式2########################################## -->
  <div v-if="this.visible==='mode2'">
    <a-card class="ant-card-shadow" style="margin-top:30px">
      <template #title>
        <h3>您的消息
          <a-button style="float: right" type="primary" @click="mode1">
            <template #icon><SwapOutlined /></template>切换通知模式
          </a-button>
        </h3>
      </template>
      <a-card class="ant-card-shadow" >
        <collapse>
          <collapse-panel @click="setwares">
        <template #header>
          <h3>
            公告      
            <a-badge v-if="this.wares!==0" style="float: right" :count="wares"/>
          </h3>
        </template>
        <a-list :loading="state.loading" :data-source="state.data" item-layout="vertical">
          <template #loadMore>
            <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <a-button type="dashed" @click="fetchData" :loading="state.loading" v-if="state.canLoadMore">
                加载更多
              </a-button>
              <a-button type="primary" @click="inform" :loading="state.loading">
            设为未读
          </a-button>
            </div>
          </template>
          <template #renderItem="{ item, index }">
            <div v-if="item.eventType===EventType.SystemMessage || item.eventType===EventType.CourseAnnouncement">
            <a-list-item>
              <a-list-item-meta :description="new Date(item.time).toLocaleString()">
              <template #title>
                {{ item.eventType===EventType.SystemMessage ? '系统公告'
                  :item.eventType===EventType.CourseAnnouncement ? '公告': ''
                }}
              </template>
              <template #avatar>
                <a-avatar style="backgroundColor:#E6F7FF">
                  <template #icon>
                    <BellTwoTone />
                  </template>
                </a-avatar>
              </template>
              </a-list-item-meta>
          <div v-if="item.eventType===EventType.SystemMessage">
            <a-alert :message="item.content.Title">
              <template #description>
                {{item.content.Content}}
              </template>
            </a-alert>
          </div>
          <div v-else>
            你的课程 <router-link :to="`/courses/${item.courseID}/description`">{{item.courseName}}</router-link>
            <span v-if="item.eventType===EventType.CourseAnnouncement">
              发布了新公告 <router-link :to="`/courses/${item.courseID}/bulletin`">{{item.content.Title}}</router-link>
            </span>
          </div>
            </a-list-item>
            </div>  
          </template>  
        </a-list>
        </collapse-panel>
      </collapse>  
      </a-card>
      <a-card class="ant-card-shadow" style="margin-top:30px">
        <collapse>
          <collapse-panel @click="setcourseinf">
        <template #header>
          <h3>
            课程信息
            <a-badge v-if="this.courseinf!==0" style="float: right" :count="courseinf"/>
          </h3>
        </template>
        <a-list :loading="state.loading" :data-source="state.data" item-layout="vertical">
        <template #loadMore>
        <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-button type="dashed" @click="fetchData" :loading="state.loading" v-if="state.canLoadMore">
            加载更多
          </a-button>
          <a-button type="primary" @click="inform" :loading="state.loading">
            设为未读
          </a-button>
        </div>
        </template>
      <template #renderItem="{ item, index }">
        <div v-if="item.eventType===EventType.CoursewareUploaded || item.eventType===EventType.DiscussionCreated
                || item.eventType===EventType.ExamCreated || item.eventType===EventType.ExamGraded || item.eventType===EventType.ExamOpen">
        <a-list-item>
          <a-list-item-meta :description="new Date(item.time).toLocaleString()">
            <template #title>
              {{  item.eventType===EventType.CoursewareUploaded ? '课件'
                : item.eventType===EventType.DiscussionCreated ? '讨论'
                : item.eventType===EventType.ExamCreated ? '考试'
                : item.eventType===EventType.ExamGraded ? '考试得分'
                : item.eventType===EventType.ExamOpen ? '考试开放' : ''
              }}
            </template>
            <template #avatar>
              <a-avatar style="backgroundColor:#E6F7FF">
                <template #icon>
                  <BellTwoTone />
                </template>
              </a-avatar>
            </template>
          </a-list-item-meta>
          <div v-if="item.eventType===EventType.SystemMessage">
            <a-alert :message="item.content.Title">
              <template #description>
                {{item.content.Content}}
              </template>
            </a-alert>
          </div>
          <div v-else>
            你的课程 <router-link :to="`/courses/${item.courseID}/description`">{{item.courseName}}</router-link>
            <span v-if="item.eventType===EventType.DiscussionCreated">
              发起了新的讨论 <router-link :to="`/courses/${item.courseID}/discuss/${item.content.Id}`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.CoursewareUploaded">
              上传了新的课件 <router-link :to="`/courses/${item.courseID}/courseware`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.ExamOpen">
              的考试 <router-link :to="`/courses/${item.courseID}/exam`">{{item.content.Title}}</router-link>
              已经 <a-tag color="#87d068">开始进行</a-tag>
            </span>
            <span v-if="item.eventType===EventType.ExamCreated">
              创建了新的考试 <router-link :to="`/courses/${item.courseID}/exam`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.ExamGraded">
              的考试 <router-link :to="`/exam/edit?mode=preview&courseID=${item.courseID}&examId=${item.content.Id}`">{{item.content.Title}}</router-link>
              得到了 {{item.content.Score}} 分
            </span>
          </div>
        </a-list-item>
      </div>  
      </template>
      </a-list>
        </collapse-panel>
      </collapse>
      </a-card>
      <a-card class="ant-card-shadow" style="margin-top:30px">
        <collapse>
          <collapse-panel @click="sethomework">
        <template #header>
          <h3>
            作业信息
            <a-badge v-if="this.homework!==0" style="float: right" :count="homework"/>
          </h3>
        </template>
  
          <a-list :loading="state.loading" :data-source="state.data" item-layout="vertical">
        <template #loadMore>
        <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-button type="dashed" @click="fetchData" :loading="state.loading" v-if="state.canLoadMore">
            加载更多
          </a-button>
          <a-button type="primary" @click="inform" :loading="state.loading">
            设为未读
          </a-button>
        </div>
      </template>
      <template #renderItem="{ item, index }">
        <div v-if="item.eventType===EventType.HomeworkCreated || item.eventType===EventType.HomeworkGraded
                || item.eventType===EventType.HomeworkNearDDL || item.eventType===EventType.HomeworkOpen ">
        <a-list-item>
          <a-list-item-meta :description="new Date(item.time).toLocaleString()">
            <template #title>
              {{  item.eventType===EventType.HomeworkCreated ? '作业'
                : item.eventType===EventType.HomeworkGraded ? '作业得分'
                : item.eventType===EventType.HomeworkNearDDL ? '作业接近截至日期'
                : item.eventType===EventType.HomeworkOpen ? '作业开放' : ''
              }}
            </template>
            <template #avatar>
              <a-avatar style="backgroundColor:#E6F7FF">
                <template #icon>
                  <BellTwoTone />
                </template>
              </a-avatar>
            </template>
          </a-list-item-meta>
          <div v-if="item.eventType===EventType.SystemMessage">
            <a-alert :message="item.content.Title">
              <template #description>
                {{item.content.Content}}
              </template>
            </a-alert>
          </div>
          <div v-else>
            你的课程 <router-link :to="`/courses/${item.courseID}/description`">{{item.courseName}}</router-link>
            <span v-if="item.eventType===EventType.HomeworkCreated">
              创建了新的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
            </span>
            <span v-if="item.eventType===EventType.HomeworkOpen">
              的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
              已经 <a-tag color="#108ee9">开放提交</a-tag>
            </span>
            <span v-if="item.eventType===EventType.HomeworkNearDDL">
              的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
              <a-tag color="#f50">即将截止</a-tag>
            </span>
            <span v-if="item.eventType===EventType.HomeworkGraded">
              的作业 <router-link :to="`/courses/${item.courseID}/homework/${item.content.Id}`">{{item.content.Title}}</router-link>
              得到了 {{item.content.Score}} 分
            </span>
          </div>
        </a-list-item>
      </div>  
      </template>
    </a-list>
        </collapse-panel>
      </collapse>  
      </a-card>
    
    </a-card>







  </div>
</template>

<script lang="ts">
import {ref, reactive} from 'vue'
import {getAllEvent, EventType} from "../../api/system";
import {message} from 'ant-design-vue'
import {BellTwoTone} from '@ant-design/icons-vue';
import {SwapOutlined} from '@ant-design/icons-vue';
import collapse from "../base/collapse.vue";
import collapsePanel from "../base/collapsePanel.vue";

export default {
  components: {BellTwoTone,SwapOutlined,collapse,collapsePanel},
  data() {
    return {
    visible: "mode1",
    homework: 0,
    wares: 0,
    courseinf: 0,
    }
  },
  setup() {
    const state = reactive({
      loading: true,
      data: [],
      start: 0,
      limit: 10,
      canLoadMore: true
    })
    async function fetchData() {
      state.loading = true
      try {
        const { totalCount, eventList } = await getAllEvent(state.start, state.limit)
        if(eventList.length === 0) {
          message.error('没有更多的公告了!')
          state.canLoadMore = false
        } else {
          state.data = state.data.concat(eventList)
          state.start += eventList.length;
        }
      } catch (e) {
        message.error(e)
      } finally {
        state.loading = false;
      }
    }
    console.log(state);
    fetchData();
    console.log();
    return {state, fetchData, EventType};

  },
  methods: {
    mode1(){
      this.visible = "mode1";
    },
    mode2(data){
      this.visible = "mode2";
      console.log(data);
      this.courseinf = 0;
      this.wares = 0;
      this.homework = 0;
      for(var i = 0,l = data.length;i < l;i++ )
          {
            if(data[i].eventType == 4 || data[i].eventType == 5 
            || data[i].eventType == 6 || data[i].eventType == 9)
            {
              this.homework++;
            }
            else if(data[i].eventType == 0 || data[i].eventType == 1)
            {
              this.wares++;
            }
            else
            {
              this.courseinf++;
            }
          }
    },
    async setwares(){
      this.wares = 0;
    },
    async setcourseinf(){
      this.courseinf = 0;
    },
    sethomework(){
      this.homework = 0;
    },
    inform(){
      this.homework = 1;
      console.log(this.homework);
    },
    /* countbadge(data){
      console.log(data);
      this.courseinf = 0;
      this.wares = 0;
      this.homework = 0;
      for(var i = 0,l = data.length;i < l;i++ )
          {
            if(data[i].eventType == 4 || data[i].eventType == 5 
            || data[i].eventType == 6 || data[i].eventType == 9)
            {
              this.homework++;
            }
            else if(data[i].eventType == 0 || data[i].eventType == 1)
            {
              this.wares++;
            }
            else
            {
              this.courseinf++;
            }
          }        
    } */
  },
}
</script>
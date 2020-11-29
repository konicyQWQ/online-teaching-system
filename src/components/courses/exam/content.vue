<template>
  <div>
    <a-card class="ant-card-shadow" :loading="state.loading" :tab-list="tabList" :active-tab-key="activeTabKey"
            @tabChange="onTabChange">
      <template #title>
        <h3>{{ state.header.title }}</h3>
      </template>
      <div v-show="activeTabKey === 'base'">
        <a-descriptions bordered :column="4">
          <a-descriptions-item label="开始时间">
            {{ moment(state.header.startTime).format('YYYY年MM月DD日 HH:mm:ss') }}
          </a-descriptions-item>
          <a-descriptions-item label="持续时间">
            {{ state.header.duration }} 分钟
          </a-descriptions-item>
          <a-descriptions-item label="总分">
            {{ state.header.maxMark }}
          </a-descriptions-item>
          <a-descriptions-item label="占比">
            {{ state.header.percentage }} %
          </a-descriptions-item>
        </a-descriptions>
        <a-row :gutter="16" type="flex" justify="center" style="margin-top: 1em">
          <a-col :span="8">
            <a-statistic title="考试人数" :value="state.statistics.startCount">
              <template #suffix>
                <span> / {{state.statistics.totalCount}}</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="8">
            <a-statistic title="提交人数" :value="state.statistics.finishedCount">
              <template #suffix>
                <span> / {{state.statistics.totalCount}}</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="8">
            <a-statistic title="平均分" :value="state.statistics.averageMark.toFixed(2)">
              <template #suffix>
                <span> / {{state.header.maxMark}}</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>
      </div>
      <div v-show="activeTabKey === 'charts'">
        <div ref="chartsDom" style="height: 400px; width:700px; margin: 0 auto;"></div>
      </div>
      <div v-show="activeTabKey === 'question'">
        <div ref="questionDom" style="height: 400px; width:700px; margin: 0 auto;"></div>
      </div>
    </a-card>
    <a-card class="ant-card-shadow" style="margin-top: 1em">
      <template #title>
        <h3>考试名单</h3>
      </template>
      <a-table :columns="columns" :data-source="state.userExams" :loading="state.loading">
        <template #action="{text, record}">
          <a @click="examScore(record)">批改</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import {useExam} from "../../exam/exam";
import {useRoute, useRouter} from 'vue-router'
import moment from 'moment'
import {readonly, ref, onMounted, watch, computed, nextTick} from 'vue'
import {QuestionType} from "../../exam/exam";
import echarts from 'echarts'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const examId = route.params.examId
    const courseID = route.params.cid
    const chartsDom = ref(null)
    const questionDom = ref(null)
    let pieChart;
    let questionChart;

    const {state, fetchData} = useExam(parseInt(examId), parseInt(courseID))
    fetchData()

    const columns = readonly([
      {dataIndex: 'userInfo.id', title: '学号'},
      {dataIndex: 'userInfo.name', title: '姓名'},
      {dataIndex: 'userInfo.phone', title: '手机'},
      {dataIndex: 'userExam.mark', title: '分数'},
      {dataIndex: 'action', title: '操作', slots: {customRender: 'action'}},
    ])
    const examScore = (record) => {
      router.push({
        path: '/exam/edit',
        query: {
          mode: 'score',
          courseID: route.params.cid,
          examId: route.params.examId,
          stuId: record.userInfo.id
        }
      })
    }

    let PieOptions;
    let questionOptions;
    watch(() => state.loading, () => {
      if(!state.loading) {
        PieOptions = {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['不及格(0~59)', '及格(60~69)', '中等(70~79)', '良好(80~89)', '优秀(90~99)', '满分(100)']
          },
          series: [{
            type: 'pie',
            data: ['不及格(0~59)', '及格(60~69)', '中等(70~79)', '良好(80~89)', '优秀(90~99)', '满分(100)'].map((value, index) => {
              return {
                name: value,
                value: state.userExams.reduce((acc, { userExam }) => {
                  if(index === 0) return acc + (userExam && userExam.mark <= 59 ? 1: 0);
                  else if(index === 1) return acc + (userExam && userExam.mark <= 69 && userExam.mark >= 60 ? 1: 0);
                  else if(index === 2) return acc + (userExam && userExam.mark <= 79 && userExam.mark >= 70 ? 1: 0);
                  else if(index === 3) return acc + (userExam && userExam.mark <= 89 && userExam.mark >= 80 ? 1: 0);
                  else if(index === 4) return acc + (userExam && userExam.mark <= 99 && userExam.mark >= 90 ? 1: 0);
                  else if(index === 5) return acc + (userExam && userExam.mark === 100 ? 1: 0);
                }, 0)
              }
            })
          }]
        }
        questionOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['平均分']
          },
          grid: {},
          xAxis: [{
            type: 'category',
            data: state.questions.map((value, index) => index+1)
          }],
          yAxis: [{
            type: 'value',
            min: 0,
            max: 100,
          }],
          series: [{
            name: '平均分',
            type: "bar",
            barWidth: "50%",
            data: state.questions.map((value, index) => value.statistics.averageScore)
          }]
        }

        nextTick(() => {
          pieChart = echarts.init(chartsDom.value)
          pieChart.setOption(PieOptions)
          questionChart = echarts.init(questionDom.value)
          questionChart.setOption(questionOptions)
        })
      }
    })
    // 展示逻辑
    const tabList = readonly([
      {key: 'base', tab: '基本信息'},
      {key: 'charts', tab: '成绩比例'},
      {key: 'question', tab: '题目数据'}
    ])
    const activeTabKey = ref('base');
    const onTabChange = (key) => {
      activeTabKey.value = key;
    }

    return {state, moment, columns, examScore, QuestionType, tabList, activeTabKey, onTabChange, chartsDom, questionDom}
  }
}
</script>
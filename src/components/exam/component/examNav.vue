<template>
  <a-card class="ant-card-shadow" :loading="state.loading" :body-style="{padding: '1em 0'}">
    <div v-if="!state.userExam.userExam" style="text-align: center">
      <a-button type="primary" @click="start">开始考试</a-button>
    </div>
    <div v-if="state.userExam.userExam">
      <h2 style="text-align: center">考试结束还有</h2>
      <h2 style="text-align: center">
        {{lastTime}}
      </h2>
      <h2 class="operation"><a-button type="primary" @click="submit">保存</a-button></h2>
      <h2 class="operation">
        <a-popconfirm title="确认要结束吗？" @confirm="finish">
          <a-button type="danger">结束考试</a-button>
        </a-popconfirm>
      </h2>
    </div>
  </a-card>
</template>

<script lang="ts">
import {inject, computed, ref} from 'vue'
import {finishExam, startExam, submitExam} from "../../../api/exam";
import moment from "moment";
import {message} from 'ant-design-vue'
import {ExamState} from "../exam";
import {useRoute, useRouter} from "vue-router";

export default {
  setup() {
    const state:ExamState = inject('state')
    const route = useRoute()
    const router = useRouter()
    const fetchStuData = inject('fetchStuData')

    const start = async () => {
      try {
        await startExam(state.header.examId);
        await fetchStuData()
      } catch (e) {
        message.error(e)
      }
    }

    let nowTime = ref(moment())
    setInterval(()=>{
      nowTime.value = moment()
    }, 1000)
    const lastTime = computed(() => {
      let endTime = moment(new Date(state.header.startTime)).add(state.header.duration, "minutes");
      let diff = endTime.diff(nowTime.value)
      return `${moment.duration(diff).hours()} 时 ${moment.duration(diff).minutes()} 分 ${moment.duration(diff).seconds()} 秒`
    })

    async function submit() {
      try {
        await submitExam(state.userExam.answers.map((value) => {
          if(value.answer instanceof Array) {
            return {
              ...value,
              answer: value.answer.sort().join('')
            }
          }
          return value
        }))
        message.success('保存成功')
      } catch (e) {
        message.error(e)
      }
    }
    async function finish() {
      try {
        await submitExam(state.userExam.answers.map((value) => {
          if(value.answer instanceof Array) {
            return {
              ...value,
              answer: value.answer.sort().join('')
            }
          }
          return value
        }))
        message.success('保存成功')
        await finishExam(state.header.examId);
        message.success('结束考试成功')
        router.push(`/courses/${route.query.courseID}/exam`);
      } catch (e) {
        message.error(e)
      }
    }

    return {state, start, lastTime, nowTime, submit, finish}
  }
}
</script>

<style scoped lang="scss">
.operation {
  text-align: center;
  margin: 0;
  padding: .4em;
  transition: all .3s ease;

  &:hover {
    background: #eeeeee;
  }
}
</style>
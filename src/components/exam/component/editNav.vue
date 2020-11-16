<template>
  <nav-card :tab-list="examEditNav" :router="false">
    <template #title><h3>工具栏</h3></template>
  </nav-card>
  <a-card class="ant-card-shadow">
    <template #title>
      <h3>总计</h3>
    </template>
    <h3>判断题有{{questionNum[0].value}}道</h3>
    <h3>单选题有{{questionNum[1].value}}道</h3>
    <h3>多选题有{{questionNum[2].value}}道</h3>
    <h3>填空题有{{questionNum[3].value}}道</h3>
    <h3>主观题有{{questionNum[4].value}}道</h3>
    <h3>总分{{totalScore}}分</h3>
  </a-card>
</template>

<script lang="ts">
import {computed, inject, readonly, ref} from "vue";
import {AnswerSeparator, ExamState, MulSeparator, QuestionType} from "../exam";
import navCard from '../../base/nav-card.vue'
import {message} from "ant-design-vue";
import {addExam, updateExam} from "../../../api/exam";
import {useRoute, useRouter} from "vue-router";

export default {
  components: {navCard},
  setup() {
    const addNewQuestion = inject('addNewQuestion')
    const state: ExamState = inject('state')
    const router = useRouter()
    const route = useRoute()

    const questionNum = [QuestionType.True_False,
      QuestionType.Single_Choice,
      QuestionType.Multi_Choice,
      QuestionType.Fill_In_Blanks,
      QuestionType.Sub_Question].map(value => computed(() => {
        return state.questions.reduce((acc, cur) => {
          return acc + (cur.question.type === value ? 1 : 0);
        }, 0)
    }))
    const totalScore = computed(()=>{
      return state.questions.reduce((acc, cur) => {
        return acc + cur.question.mark;
      }, 0)
    })

    const examAdding = ref(false)
    const preload = () => {
      state.questions.forEach((value, index) => {
        if(value.question.type === QuestionType.Single_Choice || value.question.type === QuestionType.Multi_Choice) {
          value.question.optionA = value.question.options[0] || null
          value.question.optionB = value.question.options[1] || null
          value.question.optionC = value.question.options[2] || null
          value.question.optionD = value.question.options[3] || null
          value.question.optionE = value.question.options[4] || null
          value.question.optionF = value.question.options[5] || null
          value.question.optionG = value.question.options[6] || null
          value.question.optionH = value.question.options[7] || null
        }
        if(value.question.type === QuestionType.Multi_Choice) {
          value.question.rightAnswer = value.question.rightAnswer.sort().join('');
        }
        if(value.question.type === QuestionType.Fill_In_Blanks) {
          value.question.optionA = value.question.options.length;
          value.question.rightAnswer = value.question.options.join(AnswerSeparator);
        }
      })
    }

    const examEditNav = readonly([
      {name: `添加判断题`, handleClick: () => addNewQuestion(QuestionType.True_False)},
      {name: `添加单选题`, handleClick: () => addNewQuestion(QuestionType.Single_Choice)},
      {name: `添加多选题`, handleClick: () => addNewQuestion(QuestionType.Multi_Choice)},
      {name: `添加填空题`, handleClick: () => addNewQuestion(QuestionType.Fill_In_Blanks)},
      {name: `添加主观题`, handleClick: () => addNewQuestion(QuestionType.Sub_Question)},
      {
        name: route.query.mode === 'edit' ? '保存编辑' : `添加`,
        handleClick: async () => {
          if(totalScore.value !== state.header.maxMark)
            message.error('总分不匹配！')
          else {
            if(examAdding.value == false) {
              examAdding.value = true
              try {
                message.success('系统验证中，耐心等待');
                preload()
                if(route.query.mode === 'edit') {
                  // 如果是编辑做下面的事情
                  await updateExam(state.header, state.questions.map((value) => value.question))
                  message.success('编辑成功')
                  router.push(`/courses/${route.query.courseID}/exam`)
                } else {
                  // 如果是添加做下面的事情
                  await addExam(state.header, state.questions.map((value) => value.question))
                  message.success('新建成功')
                  router.push(`/courses/${route.query.courseID}/exam`)
                }
              } catch (e) {
                message.error(e)
              } finally {
                examAdding.value = false
              }
            } else {
              message.success('系统验证中，耐心等待');
            }
          }
        }
      }
    ])
    return {examEditNav, totalScore, questionNum}
  }
}
</script>
<template>
  <div class="question" v-if="mode==='new' || mode==='edit'">
    <div>
      {{ questiondetail.question.questionId }}:
      <span :contenteditable="true"
            @blur="questiondetail.question.content=$event.target.innerText"
            v-html="questiondetail.question.content"></span>
      <a-button type="danger" style="float: right" @click="delQuestion(questiondetail.question.questionId)">删除
      </a-button>
      <span class="right" style="float: right">本题分值：<a-input-number v-model:value="questiondetail.question.mark"
                                                                    :min="0" :max="100"/></span>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.question.type === QuestionType.True_False">
      <div>
        <span style="margin-right: 1em">T: 对</span>
        <span style="margin-right: 1em">F: 错</span>
      </div>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          <a-radio-group v-model:value="questiondetail.question.rightAnswer">
            <a-radio :value="'T'">
              对
            </a-radio>
            <a-radio :value="'F'">
              错
            </a-radio>
          </a-radio-group>
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.question.type === QuestionType.Single_Choice">
      <div>
        <span v-for="item, index in questiondetail.question.options" :value="['A','B','C','D','E','F','G'][index]"
              style="margin-right: 2em">
          {{ ['A', 'B', 'C', 'D', 'E', 'F', 'G'][index] }}:
          <span :contenteditable="true"
                @blur="questiondetail.question.options[index]=$event.target.innerText"
                v-html="questiondetail.question.options[index]"></span>
        </span>
      </div>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          <a-radio-group v-model:value="questiondetail.question.rightAnswer">
            <a-radio v-for="item, index in questiondetail.question.options"
                     :value="['A','B','C','D','E','F','G'][index]">
              {{ ['A', 'B', 'C', 'D', 'E', 'F', 'G'][index] }}
            </a-radio>
          </a-radio-group>
          <a-button type="primary" @click="addNewChoice">增加选项</a-button>
          <a-button type="default" @click="delChoice">移除选项</a-button>
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.question.type === QuestionType.Multi_Choice">
      <div>
        <span v-for="item, index in questiondetail.question.options" :value="['A','B','C','D','E','F','G'][index]"
              style="margin-right: 2em">
          {{ ['A', 'B', 'C', 'D', 'E', 'F', 'G'][index] }}:
          <span :contenteditable="true"
                @blur="questiondetail.question.options[index]=$event.target.innerText"
                v-html="questiondetail.question.options[index]"></span>
        </span>
      </div>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          <a-checkbox-group v-model:value="questiondetail.question.rightAnswer">
            <a-checkbox v-for="item, index in questiondetail.question.options"
                        :value="['A','B','C','D','E','F','G'][index]">
              {{ ['A', 'B', 'C', 'D', 'E', 'F', 'G'][index] }}
            </a-checkbox>
          </a-checkbox-group>
          <a-button type="primary" @click="addNewChoice">增加选项</a-button>
          <a-button type="default" @click="delChoice">移除选项</a-button>
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.question.type === QuestionType.Fill_In_Blanks">
      <div>
        <span v-for="item, index in questiondetail.question.options" :value="['A','B','C','D','E','F','G'][index]"
              style="margin-right: 2em">
          {{ ['A', 'B', 'C', 'D', 'E', 'F', 'G'][index] }}: ______
        </span>
      </div>
      <a-alert type="success" style="margin-top: 1em;">
        <template #message>
          <span class="right">正确答案：</span>
          <div style="display: inline-block; margin-right: 1em;" v-for="item, index in questiondetail.question.options">
            <a-input :addon-before="['A', 'B', 'C', 'D', 'E', 'F', 'G'][index]"
                     v-model:value="questiondetail.question.options[index]"/>
          </div>
          <a-button type="primary" @click="addNewChoice">增加填空</a-button>
          <a-button type="default" @click="delChoice">移除填空</a-button>
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.question.type === QuestionType.Sub_Question">
      _____________________________
    </div>
  </div>
  <div class="question" v-if="mode==='write'">
    <div>
      {{ questiondetail.questionId }}:
      <span>{{ questiondetail.content }}</span>
      <span class="right" style="float: right">本题分值：{{ questiondetail.mark }}</span>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.True_False">
      <a-radio-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer">
        <a-radio :value="'T'">对</a-radio>
        <a-radio :value="'F'">错</a-radio>
      </a-radio-group>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Single_Choice">
      <a-radio-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer">
        <a-radio v-for="item in options" :value="item">
          <span v-if="questiondetail[`option${item}`] !== null">
            {{ item }}:
            {{ questiondetail[`option${item}`] }}
          </span>
        </a-radio>
      </a-radio-group>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Multi_Choice">
      <a-checkbox-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer">
        <a-checkbox v-for="item in options" :value="item">
          <span v-if="questiondetail[`option${item}`] !== null">
            {{ item }}:
            {{ questiondetail[`option${item}`] }}
          </span>
        </a-checkbox>
      </a-checkbox-group>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Fill_In_Blanks">
      <div style="display: inline-block; margin-right: 1em" v-for="item, index in input">
        <a-input v-model:value="input[index]" @change="blankChange"/>
      </div>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Sub_Question">
      <a-textarea v-model:value="state.userExam.answers[questiondetail.questionId-1].answer"/>
    </div>
  </div>
  <div class="question" v-if="mode==='preview'">
    <div>
      {{ questiondetail.questionId }}:
      <span>{{ questiondetail.content }}</span>
      <span class="right" style="float: right">本题分值：{{ questiondetail.mark }}</span>
      <a-tag style="float: right"
             :color="state.userExam.answers[questiondetail.questionId - 1].mark !== questiondetail.mark ? 'red' : 'green'">
        本题得分：{{
          state.userExam.answers[questiondetail.questionId - 1].mark
        }}
      </a-tag>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.True_False">
      <a-radio-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled>
        <a-radio :value="'T'">对</a-radio>
        <a-radio :value="'F'">错</a-radio>
      </a-radio-group>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Single_Choice">
      <a-radio-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled>
        <a-radio v-for="item in options" :value="item">
          <span v-if="questiondetail[`option${item}`] !== null">
            {{ item }}:
            {{ questiondetail[`option${item}`] }}
          </span>
        </a-radio>
      </a-radio-group>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Multi_Choice">
      <a-checkbox-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled>
        <a-checkbox v-for="item in options" :value="item">
          <span v-if="questiondetail[`option${item}`] !== null">
            {{ item }}:
            {{ questiondetail[`option${item}`] }}
          </span>
        </a-checkbox>
      </a-checkbox-group>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Fill_In_Blanks">
      <div style="display: inline-block; margin-right: 1em" v-for="item, index in input">
        <a-input v-model:value="input[index]" @change="blankChange" :disabled/>
      </div>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer.split('!&!').join('; ') }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Sub_Question">
      <a-textarea v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled/>
    </div>
  </div>
  <div class="question" v-if="mode==='score'">
    <div>
      {{ questiondetail.questionId }}:
      <span>{{ questiondetail.content }}</span>
      <span class="right" style="float: right">本题分值：{{ questiondetail.mark }}</span>
      <a-tag style="float: right"
             :color="state.userExam.answers[questiondetail.questionId - 1].mark !== questiondetail.mark ? 'red' : 'green'">
        本题得分：{{
          state.userExam.answers[questiondetail.questionId - 1].mark
        }}
      </a-tag>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.True_False">
      <a-radio-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled>
        <a-radio :value="'T'">对</a-radio>
        <a-radio :value="'F'">错</a-radio>
      </a-radio-group>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Single_Choice">
      <a-radio-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled>
        <a-radio v-for="item in options" :value="item">
          <span v-if="questiondetail[`option${item}`] !== null">
            {{ item }}:
            {{ questiondetail[`option${item}`] }}
          </span>
        </a-radio>
      </a-radio-group>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Multi_Choice">
      <a-checkbox-group v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled>
        <a-checkbox v-for="item in options" :value="item">
          <span v-if="questiondetail[`option${item}`] !== null">
            {{ item }}:
            {{ questiondetail[`option${item}`] }}
          </span>
        </a-checkbox>
      </a-checkbox-group>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer.join('') }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Fill_In_Blanks">
      <div style="display: inline-block; margin-right: 1em" v-for="item, index in input">
        <a-input v-model:value="input[index]" @change="blankChange" :disabled/>
      </div>
      <a-alert type="success" style="margin-top: 1em">
        <template #message>
          <span class="right">正确答案：</span>
          {{ state.questions[questiondetail.questionId - 1].rightAnswer.split('!&!').join('; ') }}
        </template>
      </a-alert>
    </div>
    <div style="margin: 1em 0" v-if="questiondetail.type === QuestionType.Sub_Question">
      <a-textarea v-model:value="state.userExam.answers[questiondetail.questionId-1].answer" :disabled/>
      <a-alert type="info" style="margin-top: 1em">
        <template #message>
          <span class="right">本题打分：</span>
          <a-input-number v-model:value="state.userExam.answers[questiondetail.questionId-1].mark" :min="0" :max="questiondetail.mark"/>
          <a-button type="primary" @click="clickSetScore(questiondetail.questionId)">确定打分</a-button>
        </template>
      </a-alert>
    </div>
  </div>
</template>

<script lang="ts">
import {PropType, inject, computed, ref, watch} from 'vue'
import {AnswerSeparator, ExamState, Question, QuestionDetail, QuestionType} from "../exam";
import {useRoute} from "vue-router";
import {setScoreExam} from "../../../api/exam";
import {message} from "ant-design-vue";

export default {
  name: "question",
  props: {
    questiondetail: Object as PropType<QuestionDetail> | Object as PropType<Question>,
    mode: String
  },
  setup(props) {
    const state: ExamState = inject('state')
    const fetchData = inject('fetchData')

    const route = useRoute()
    const addNewChoice = () => {
      if (props.questiondetail.question.options.length < 7)
        props.questiondetail.question.options.push('点击编辑')
    }
    const delChoice = () => {
      if (props.questiondetail.question.options.length > 0)
        props.questiondetail.question.options.pop()
    }
    const delQuestion = (id) => {
      state.questions.splice(id - 1, 1);
      for (let i in state.questions) {
        state.questions[i].question.questionId = parseInt(i) + 1;
      }
    }
    // 以下是学生做考试题用到的
    const options = computed(() => {
      if (props.mode === 'write' || props.mode === 'preview' || props.mode === 'score')
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].filter((value) => {
          return props.questiondetail[`option${value}`] !== null
        })
    })
    const input = ref([])
    if ((props.mode === 'write' || props.mode === 'preview' || props.mode === 'score') && props.questiondetail.type === QuestionType.Fill_In_Blanks) {
      input.value = state.userExam.answers[props.questiondetail.questionId - 1].answer.split(AnswerSeparator);
      while (input.value.length < parseInt(props.questiondetail.optionA)) {
        input.value.push('')
      }
    }
    const blankChange = () => {
      if (props.mode === 'write') {
        state.userExam.answers[props.questiondetail.questionId - 1].answer = input.value.join(AnswerSeparator);
      }
    }
    const clickSetScore = async (qid) => {
      try {
        await setScoreExam({
          stuID: route.query.stuId,
          examID: route.query.examId,
          questionID: qid,
          score: state.userExam.answers[qid-1].mark
        })
        message.success('打分成功')
        fetchData()
      } catch (e) {
        message.error(e)
      }
    }
    return {QuestionType, addNewChoice, delChoice, delQuestion, state, options, input, blankChange, clickSetScore}
  }
}
</script>

<style scoped lang="scss">
.question {
  margin: 2em 2em;

  .right {
    font-weight: 600;
  }

  * {
    outline: none;
  }
}
</style>
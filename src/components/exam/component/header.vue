<template>
  <div class="contentedit">
    <a-tooltip title="标题">
      <h2 style="text-align: center" :contenteditable="editable" v-html="header.title" @blur="header.title=$event.target.innerText"></h2>
    </a-tooltip>
    <a-row type="flex" justify="space-between" v-if="editable">
      <a-col>
        总分: <a-input-number v-model:value="header.maxMark" :min="0" :max="100"/>
      </a-col>
      <a-col>
        占总成绩百分比: <a-input-number v-model:value="header.percentage" :min="0" :max="100"/> %
      </a-col>
      <a-col>
        开始时间: <a-date-picker show-time v-model:value="time" @change="timeChange"/>
      </a-col>
      <a-col>
        考试时长: <a-input-number v-model:value="header.duration" :min="0" :max="2400"/> 分钟
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-between" v-else>
      <a-col>
        总分: {{header.maxMark}}
      </a-col>
      <a-col>
        占总成绩百分比: {{header.percentage}}%
      </a-col>
      <a-col>
        开始时间: {{new Date(header.startTime).toLocaleString()}}
      </a-col>
      <a-col>
        考试时长: {{header.duration}} 分钟
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {PropType, ref} from 'vue'
import {Exam} from "../exam";
import moment from "moment";

export default {
  props: {
    header: Object as PropType<Exam>,
    editable: Boolean
  },
  setup(props, ct) {
    const time = ref(null)
    if(props.header.startTime) {
      time.value = moment(props.header.startTime)
    }
    function timeChange() {
      props.header.startTime = time.value.toDate()
    }
    return {time, timeChange}
  }
}
</script>

<style lang="scss" scoped>
.contentedit {
  * {
    outline: none;
  }
}
</style>
<template>
  <a-card class="ant-card-shadow" :loading="state.loading">
    <template #title>
      <h3>{{ state.data.homework.homework.title }}</h3>
    </template>
    <a-descriptions bordered :column="4">
      <a-descriptions-item label="开始时间">
        {{ moment(state.data.homework.homework.startTime).format('YYYY年MM月DD日 HH:mm:ss') }}
      </a-descriptions-item>
      <a-descriptions-item label="结束时间">
        {{ moment(state.data.homework.homework.endTime).format('YYYY年MM月DD日 HH:mm:ss') }}
      </a-descriptions-item>
      <a-descriptions-item label="总分">
        {{ state.data.homework.homework.totalMark }}
      </a-descriptions-item>
      <a-descriptions-item label="占比">
        {{ state.data.homework.homework.percentage }} %
      </a-descriptions-item>
    </a-descriptions>
    <p style="margin: 1em">
      {{ state.data.homework.homework.content }}
    </p>
    <showFile :files="state.data.homework.files"
              :download-file-fun="ThisHomeworkDownloadUrl"
              :can-download="canDownload"/>
  </a-card>
</template>

<script lang="ts">
import {inject, computed} from 'vue'
import moment from 'moment'
import showFile from "../../base/showFile.vue";
import {HomeworkDownloadUrl} from "../../../type/file";
import {useRoute} from 'vue-router'
import {notGuest} from "../../../type/user";
import {HomeworkState_State} from "../../../hooks/homework";

export default {
  components: {showFile},
  setup() {
    const state: HomeworkState_State = inject('oneHomeworkState');
    const courseInfo = inject('courseInfo');
    const route = useRoute()
    const hwID = route.params.hwID

    const ThisHomeworkDownloadUrl = HomeworkDownloadUrl.bind(null, hwID);
    const canDownload = computed(() => notGuest(courseInfo.role))

    return {state, moment, courseInfo, ThisHomeworkDownloadUrl, canDownload}
  }
}
</script>
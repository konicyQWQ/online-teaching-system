<template>
  <a-card class="ant-card-shadow" :loading="state.loading" >
    <template #title><h3>作业批改情况</h3></template>
    <div v-if="state.data.userHomework.userHomework">
      <a-row>
        <a-col :span="12">
          <a-card title="你提交的作业" :bordered="false" :body-style="{ margin: '0' }">
            <p>{{ state.data.userHomework.userHomework.description }}</p>
            <show-file :files="state.data.userHomework.files" :can-download="true" :download-file-fun="downloadUrl"/>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="老师批改" :bordered="false" :body-style="{ margin: '0' }">
            <div v-if="state.data.userHomework.userHomework.mark">
              <a-statistic title="分数" :value="state.data.userHomework.userHomework.mark" class="demo-class">
                <template #suffix>
                  <span> / {{state.data.homework.homework.totalMark}}</span>
                </template>
              </a-statistic>
              <a-alert type="success" :message="state.data.userHomework.userHomework.comment"/>
            </div>
            <div v-else>
              <a-alert message="老师还没有批改"/>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div v-else>
      <a-alert message="你还没有提交作业" type="error"/>
    </div>
  </a-card>
</template>

<script>
import { inject } from 'vue'
import showFile from "../../base/showFile.vue";
import { StudentHomeworkDownloadUrl } from "../../../type/file";
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: "teacherScore",
  components: { showFile },
  setup() {
    const route = useRoute()
    const state = inject('oneHomeworkState')
    const store = useStore()
    const downloadUrl = StudentHomeworkDownloadUrl.bind(null, store.state.id, route.params.hwID);
    return { state, downloadUrl }
  }
}
</script>
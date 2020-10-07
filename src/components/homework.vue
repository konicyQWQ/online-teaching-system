<template>
  <a-table :columns="columns" :data-source="data" :loading="isLoading">
    <template v-slot:name="{ text, record }">
      <router-link :to="$route.path + '/' + record.key">{{ text }}</router-link>
    </template>
    <template v-slot:status="{ text }">
      <a-badge :status="text == 1 ? 'success' : 'processing'" :text="text == 1 ? '已提交' : '未交'"/>
    </template>
  </a-table>
</template>

<script>
export default {
  name: "homework",
  data() {
    return {
      columns: [
        { dataIndex: 'name', title: '作业名称', slots: { customRender: 'name' }},
        { dataIndex: 'time', title: '截止时间' },
        { dataIndex: 'status', title: '状态', slots: { customRender: 'status' } },
        { dataIndex: 'score', title: '成绩'}
      ],
      data: [
        { key: 1, name: '线上教学系统设计', time: '2020-02-02', status: 1, score: 100 }
      ],
      isLoading: true
    }
  },
  mounted() {
    this.isLoading = false
  }
}
</script>

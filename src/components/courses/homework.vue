<template>
  <a-card class="ant-card-shadow">
    <template v-slot:title>
      <h3>作业</h3>
    </template>
    <a-table :columns="columns" :data-source="data">
      <template v-slot:name="{ text, record }">
        <router-link :to="$route.path + '/' + record.key">{{ text }}</router-link>
      </template>
      <template v-slot:status="{ text }">
        <a-badge :status="text == 1 ? 'success' : 'processing'" :text="text == 1 ? '已提交' : '未交'"/>
      </template>
      <template v-slot:score="{ text }">
                <span style="font-size: 1.2em; font-weight: 400; border-bottom: 4px double var(--choose-color);">
                    {{ text }}
                </span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  name: "homework",
  data() {
    return {
      columns: [
        {dataIndex: 'name', title: '作业名称', slots: {customRender: 'name'}},
        {dataIndex: 'startTime', title: '开始时间'},
        {dataIndex: 'deadline', title: '截止时间'},
        {dataIndex: 'status', title: '状态', slots: {customRender: 'status'}},
        {dataIndex: 'score', title: '成绩', slots: {customRender: 'score'}}
      ],
      data: [
        {key: 1, name: '线上教学系统设计', startTime: '2020-10-09', deadline: '2021-01-01', status: 1, score: 100}
      ],
    }
  }
}
</script>

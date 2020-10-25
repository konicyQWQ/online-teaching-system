<template>
  <a-card class="ant-card-shadow">
    <template v-slot:title>
      <h3>
        <FileTextTwoTone twoToneColor="#eb2f96"/>
        课件
      </h3>
    </template>
    <a-table :columns="column" :data-source="data">
      <template v-slot:filename="{ text, record }">
        <a :href="record.url" style="font-size: 1.2em; font-weight: 400;">{{ text }}</a>
      </template>
      <template v-slot:action="{ record }">
        <a-button type="link">
          <template v-slot:icon>
            <CloudDownloadOutlined/>
          </template>
          下载
        </a-button>
        <a-divider type="vertical"/>
        <a-button type="link" style="color: red">
          <template v-slot:icon>
            <CloudDownloadOutlined/>
          </template>
          删除
        </a-button>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import {FileTextTwoTone, CloudDownloadOutlined} from '@ant-design/icons-vue'
import {reactive, readonly} from 'vue'

export default {
  name: 'courseware',
  components: {
    FileTextTwoTone,
    CloudDownloadOutlined
  },
  setup() {
    const column = readonly([
      {dataIndex: 'filename', title: '文件名', slots: {customRender: 'filename'}},
      {dataIndex: 'time', title: '时间'},
      {dataIndex: 'description', title: '简介'},
      {dataIndex: 'action', title: '操作', slots: {customRender: 'action'}}
    ])

    const data = reactive([
      {
        filename: 'pdf1.pdf',
        time: '2020.09.09 10.51',
        description: '线上教学系统的参考文件',
        url: 'http://localhost:3000/public/1.pdf'
      }
    ])

    return {column, data}
  }
}
</script>

<style scoped lang="scss">

</style>
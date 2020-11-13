<template>
  <a-table :columns="columns"
           :data-source="files"
           :pagination="false">
    <template #name="{ text, record }">
      <FilePdfTwoTone twoToneColor="#eb2f96"/> <a :href="downloadFileFun(record.id)" target="_blank">{{text}}</a>
    </template>
    <template #size="{ text }">
      {{  parseInt(text) < 1024 ?        `${parseInt(text)}B`
        : parseInt(text) < 1024 * 1024 ? `${Math.floor(parseInt(text)/1024)}KB`
        :                                `${Math.floor(parseInt(text)/1024/1024)}MB` }}
    </template>
    <template #action="{ record }"
              v-if="canDownload">
      <a :href="downloadFileFun(record.id, true)"  target="_blank"  :download="record.name"><DownloadOutlined /></a>
      <a-divider type="vertical"/>
      <a :href="downloadFileFun(record.id)"        target="_blank"><EyeOutlined /></a>
    </template>
  </a-table>
</template>

<script lang="ts">
import {readonly, PropType} from 'vue'
import { File } from '../../type/file'
import {DownloadOutlined, EyeOutlined, FilePdfTwoTone} from '@ant-design/icons-vue'

export default {
  name: "showFile",
  components: { DownloadOutlined, EyeOutlined, FilePdfTwoTone },
  props: {
    files: Array as PropType<File>,
    downloadFileFun: Function,
    canDownload: Boolean
  },
  setup() {
    const columns = readonly([
      {dataIndex: 'name', key: 'name', title: '文件名', slots: {customRender: 'name'}},
      {dataIndex: 'size', key: 'size', title: '文件大小', slots: {customRender: 'size'}},
      {dataIndex: 'action', key: 'action', slots: {customRender: 'action'}, title: '操作'}
    ])

    return { columns }
  }
}
</script>
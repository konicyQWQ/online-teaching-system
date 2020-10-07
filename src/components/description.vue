<template>
  <a-skeleton :loading="isLoading" active :paragraph="{rows: 10}">
    <a-card :bordered="false" id="information">
      <template v-slot:title>
        <h3><ProfileTwoTone twoToneColor="#eb2f96" />课程信息</h3>
      </template>
      <a-descriptions bordered>
        <a-descriptions-item label="课程名称">
          程序设计方法学
        </a-descriptions-item>
        <a-descriptions-item label="课程代码">
          (2020-2021-1)-21190650
        </a-descriptions-item>
        <a-descriptions-item label="开课院系">
          计算机科学与技术学院
        </a-descriptions-item>
        <a-descriptions-item label="学年期">
          2020-2021秋冬
        </a-descriptions-item>
        <a-descriptions-item label="开始日期">
          2020-08-31
        </a-descriptions-item>
        <a-descriptions-item label="课程属性">
          一般课程
        </a-descriptions-item>
        <a-descriptions-item label="开课情况">
          <a-badge status="processing" text="正在开课" />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" id="description">
      <template v-slot:title>
        <h3><ProfileTwoTone twoToneColor="#eb2f96" />课程简介</h3>
      </template>
      本课程是关于编程语言原理的，主要讲述编程语言的概念、分类、元素和实现。本课程主要由五部分内容组成：编程语言基本概念、语言要素及其实现、四种编程范式、虚拟机技术及实现、三个专题（函数式、并行计算和递归计算）。 本课程通过讲课、论文阅读与综述、编写编程语言解释器的方式实现学习目标。 本课程不涉及编译原理的知识。
    </a-card>
    <a-card :bordered="false" id="scoreMethod">
      <template v-slot:title>
        <h3><ProfileTwoTone twoToneColor="#eb2f96" />课程评分方式</h3>
      </template>
    </a-card>
    <a-card :bordered="false" id="textbook">
      <template v-slot:title>
        <h3><ProfileTwoTone twoToneColor="#eb2f96" />课程教材</h3>
      </template>
    </a-card>
    <a-card :bordered="false" id="other">
      <template v-slot:title>
        <h3><ProfileTwoTone twoToneColor="#eb2f96" />其他信息</h3>
      </template>
    </a-card>
    <a-anchor class="anchor" :wrapperStyle="{ background: 'transparent' }">
      <a-anchor-link href="#information" title="课程信息" />
      <a-anchor-link href="#description" title="课程简介" />
      <a-anchor-link href="#scoreMethod" title="课程评分方式" />
      <a-anchor-link href="#textbook" title="课程教材" />
      <a-anchor-link href="#other" title="其他信息" />
    </a-anchor>
  </a-skeleton>
</template>

<script>
import { ProfileTwoTone } from '@ant-design/icons-vue'

export default {
  name: 'cDescription',
  components: {
    ProfileTwoTone
  },
  data() {
    return {
      isLoading: true,
    }
  },
  created() {
    // 增加异步获取数据
    setTimeout(() => {
      this.isLoading = false
    }, 1000);
  }
}
</script>

<style scoped>
.anchor {
  position: fixed;
  top: 140px;
  right: 70px;
}
</style>
<template>
  <a-card :tab-list="tabList"
          :active-tab-key="tabKey"
          :style="{ margin: '20px 200px'}"
          @tabChange="onTabChange">
    <template v-slot:title>
      <h1 :style="{ display: 'inline-block' }">{{ title }}</h1>
      <span :style="{ color: 'grey' }">{{ college }}</span>
    </template>
    <template v-slot:extra>
      <a-avatar :stc="teacherAvatar" size="large" />
      <span :style="{ margin: '1em', fontSize: '1.2em' }">{{ teacher }}</span>
    </template>
    <router-view></router-view>
  </a-card>
</template>

<script>
export default {
  name: 'courses',
  data() {
    return {
      tabList: [
        { key: 'description', tab: '课程简介' },
        { key: 'bulletin', tab: '公告' },
        { key: 'courseware', tab: '课件' },
        { key: 'homework', tab: '作业' },
        { key: 'exam', tab: '测试' },
        { key: 'forum', tab: '讨论' },
        { key: 'score', tab: '成绩' }
      ],
      tabKey: 'description',
      title: '程序设计方法学',
      college: '计算机科学与技术学院',
      teacher: '翁恺',
      teacherAvatar: ''
    }
  },
  created() {
    this.tabKey = this.$route.path.split('/')[3] || 'description'
  },
  methods: {
    onTabChange(key) {
      const id = this.$route.params.id
      this.tabKey = key
      this.$router.push(`/courses/${id}/${key}`)
    }
  }
}
</script>
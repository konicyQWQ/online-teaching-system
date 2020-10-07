<template>
  <a-list item-layout="vertical" size="large" :data-source="bulletinData" :loading="isLoading">
    <template v-slot:renderItem="{ item, index }">
      <a-list-item>
        <a-list-item-meta :description="item.description">
          <template v-slot:title>
            {{ item.title }}
          </template>
          <template v-slot:avatar>
            <a-avatar :src="item.avatar" />
          </template>
        </a-list-item-meta>
        {{ item.content }}
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
export default {
  name: 'bulletin',
  data() {
    return {
      isLoading: true,
      bulletinData: [
        {
          title: '请及早成立2-3人的研讨小组',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          description: '2020-09-28',
          content: '本课程有科研内容研讨任务和编程实践任务，需要2-3名的同学组成的小组共同完成。请同学们及早找到同伴将分组结果告诉助教，谢谢配合。最晚请于国庆后发给助教，否则会影响编程任务的开展，只能进行随机分组。'
        },
        {
          title: '明天不上课',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          description: '2020-09-28',
          content: '明天不上课'
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false
    }, 1000)
  }
}
</script>
<template>
  <a-card class="ant-card-shadow">
    <template v-slot:title>
      <h3>
        <BellTwoTone twoToneColor="#eb2f96"/>
        公告
      </h3>
    </template>
    <a-list item-layout="vertical" size="large" :data-source="bulletinData">
      <template v-slot:renderItem="{ item, index }">
        <a-list-item>
          <template v-slot:actions>
            <a-button type="link">编辑</a-button>
            <a-button type="link" :style="{ color: 'red' }">删除</a-button>
          </template>
          <a-list-item-meta :description="item.description + ' 更新'">
            <template v-slot:title>
              {{ item.title }}
            </template>
          </a-list-item-meta>
          <p>
            {{ item.content }}
          </p>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script>
import {BellTwoTone} from '@ant-design/icons-vue';

export default {
  name: 'bulletin',
  components: {
    BellTwoTone
  },
  data() {
    return {
      bulletinData: [
        {
          title: '请及早成立2-3人的研讨小组',
          description: '2020-09-28',
          content: '本课程有科研内容研讨任务和编程实践任务，需要2-3名的同学组成的小组共同完成。请同学们及早找到同伴将分组结果告诉助教，谢谢配合。最晚请于国庆后发给助教，否则会影响编程任务的开展，只能进行随机分组。'
        },
        {
          title: '明天不上课',
          description: '2020-09-28',
          content: '明天不上课'
        }
      ]
    }
  }
}
</script>
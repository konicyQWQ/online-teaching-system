<template>
  <a-list
    class="comment-list"
    :header="`${data.length} replies`"
    item-layout="horizontal"
    :data-source="data"
  >
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-comment :author="item.author" :avatar="item.avatar">
          <template #content>
            <p>
              {{ item.content }}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.datetime.fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>
  <a-button @click="handleSubmit"></a-button>
</template>

<script>
import { useRoute } from "vue-router";
import { List } from "ant-design-vue";
import {
  createDiscuss,
  getDiscussion,
  getDiscussDetail,
  submitDiscuss,
  updateDiscuss,
  removeDiscuss,
  withdrawDiscuss,
} from "../../../api/discuss";
import moment from "moment";
import { readonly } from "vue";
export default {
  setup() {
    const route = useRoute();
    const disId = route.params.disId;
    const disDetail = getDiscussDetail(disId);

    const handleSubmit = () => {
      console.log(disDetail);
    };

    const data = readonly([
      {
        actions: ["Reply to"],
        author: "Han Solo",
        avatar:
          "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        content:
          "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        datetime: moment().subtract(1, "days"),
      },
      {
        actions: ["Reply to"],
        author: "Han Solo",
        avatar:
          "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        content:
          "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        datetime: moment().subtract(2, "days"),
      },
    ]);

    
    return { handleSubmit, data, moment };
  },
};
</script>

<style scoped>
</style>
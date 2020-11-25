<template>
  <a-button @click="handleCreate">我要发贴</a-button>
  <!-- <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="发帖主题">
      <a-input v-model:value="form.name" />
    </a-form-item>
  </a-form> -->
  <a-list item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-card
          :title="item.title"
          style="width: 800px"
          hoverable="true"
          @click="enter_discussion(item.diss_id)"
        >
          发起人：{{ item.creator }}
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
import { inject, defineComponent, reactive, readonly } from "vue";
import { List, Card, Button } from "ant-design-vue";
import modal from "../../base/modal";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import {
  createDiscuss,
  getDiscussion,
  getDiscussDetail,
  submitDiscuss,
  updateDiscuss,
  removeDiscuss,
  withdrawDiscuss,
} from "../../../api/discuss";

export default {
  //components: { modal },
  //props: { visiable: Boolean },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const courseID = route.params.cid;
    const userInfo = useStore();
    // userInfo.state.token 目前登录用户的token
    // userInfo.state.avatarId 目前登录用户的头像ID
    // userInfo.state.role 登录用户的身份(跟课程不是对应关系的)
    // userInfo.state.name 登录用户的姓名
    const data = readonly([
      {
        title: "Ant Design Title 1",
        creator: "yjsp",
        diss_id: "1",
      },
      {
        title: "Ant Design Title 2",
        creator: "yjsp",
        diss_id: "2",
      },
      {
        title: "Ant Design Title 3",
        creator: "yjsp",
        diss_id: "3",
      },
    ]);
    //const allDiscussion = getDiscussion(courseID);
    const enter_discussion = (diss_id) => {
      //console.log(allDiscussion);
      /* alert(diss_id);
      router.push({
        path: "./page",
      }); */
    };

    const handleCreate = () => {};
    return { data, enter_discussion,  handleCreate };
  },
};
</script>

<style scoped>
</style>
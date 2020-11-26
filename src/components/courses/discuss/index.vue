<template>
  <a-list item-layout="horizontal" :data-source="allDiscussion.data">
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-card
          :title="item.discussion.title"
          style="width: 800px"
          hoverable="true"
          @click="enterDiscussion(item.discussion.discussionId)"
        >
          <template #extra> </template>
          发起人：{{ item.creatorInfo.name }} </a-card
        ><a-button
          @click="deleteDiscussion(item.discussion.discussionId)"
          v-show="isAdmin(courseInfo.role)"
          >删帖</a-button
        >
      </a-list-item>
    </template>
  </a-list>
  <div v-show="notGuest(courseInfo.role)">
    <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="发贴标题">
        <a-input v-model:value="form.title" type="textarea" />
      </a-form-item>
      <a-form-item label="贴子描述">
        <a-textarea
          v-model:value="form.topic"
          showCount
          :maxlength="114"
          :rows="4"
          style="width: 600px"
        />
      </a-form-item>
    </a-form>
    <a-button @click="handleCreate">我要发贴</a-button>
  </div>
</template>

<script>
import {
  inject,
  defineComponent,
  reactive,
  readonly,
  computed,
  onMounted,
} from "vue";
import { List, Card, Button, message } from "ant-design-vue";
import modal from "../../base/modal.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { notGuest, isAdmin } from "../../../type/user";

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
    const allDiscussion = reactive({
      data: [],
    });
    const userInfo = useStore();
    const courseInfo = inject("courseInfo");

    // userInfo.state.token 目前登录用户的token
    // userInfo.state.avatarId 目前登录用户的头像ID
    // userInfo.state.role 登录用户的身份(跟课程不是对应关系的)
    // userInfo.state.name 登录用户的姓名

    const form = reactive({
      title: "",
      topic: "",
    });

    const enterDiscussion = (diss_id) => {
      console.log(allDiscussion);
      router.push({
        path: "./discuss/" + diss_id,
      });
    };

    onMounted(() => {
      getDiscussion(route.params.cid).then((res) => {
        allDiscussion.data = res;
      });
    });

    const handleCreate = () => {
      createDiscuss({
        courseId: route.params.cid,
        title: form.title,
        creatorID: userInfo.state.id,
        description: form.topic,
      })
        .then((res) => {
          message.success("success");
        })
        .catch((e) => {
          message.error("error");
          console.log(
            route.params.cid,
            form.title,
            userInfo.state.id,
            form.topic
          );
        });
    };

    const deleteDiscussion = (disID) => {
      removeDiscuss({ disID: disID })
        .then((res) => {
          message.success("success");
        })
        .catch((e) => {
          message.error("error");
        });
      console.log(allDiscussion.data);
    };

    return {
      enterDiscussion,
      allDiscussion,
      handleCreate,
      form,
      courseInfo,
      notGuest,
      isAdmin,
      deleteDiscussion,
    };
  },
};
</script>

<style scoped>
</style>
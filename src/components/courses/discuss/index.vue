<template>
  <a-list item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-card
          :title="item.title"
          style="width: 800px"
          hoverable="true"
          @click="enterDiscussion(item.diss_id)"
        >
          发起人：{{ item.creator }}
        </a-card>
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
import { notGuest } from "../../../type/user";

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
    const allDiscussion = getDiscussion(route.params.cid);
    const userInfo = useStore();
    const courseInfo = inject("courseInfo");

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
    const form = reactive({
      title: "",
      topic: "",
    });

    const enterDiscussion = (diss_id) => {
      console.log(allDiscussion);
      console.log(courseInfo);
      console.log(form);

      /* alert(diss_id);*/
      router.push({
        path: "./discuss/" + diss_id,
      });
    };

    onMounted(() => {
      createDiscuss(
        route.params.cid,
        form.title,
        userInfo.state.id,
        form.topic
      ).then((res) => {
        message.success("success");
      });
    });
    const handleCreate = () => {
      createDiscuss(route.params.cid, form.title, userInfo.state.id, form.topic)
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

    return {
      data,
      enterDiscussion,
      allDiscussion,
      handleCreate,
      form,
      courseInfo,
      notGuest,
    };
  },
};
</script>

<style scoped>
</style>
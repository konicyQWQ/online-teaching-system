<template>
  <a-card :title="disDetail.data.discussion.discussion.title">
    {{ disDetail.data.discussion.discussion.description }}
  </a-card>
  <a-list
    class="comment-list"
    :header="`共${disDetail.data.userDiscussionList.length}条回复`"
    item-layout="horizontal"
    :data-source="disDetail.data.userDiscussionList"
  >
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-comment :author="item.userInfo.name" :avatar="getAvatar(item.userInfo.id)">
          <template #content>
            <p>
              {{ item.userDiscussion.content }}
            </p>
          </template>
          <template #datetime>
            <a-tooltip>
              <span>第{{ item.userDiscussion.level }}楼</span>
              <span>{{ item.userDiscussion.submitTime }}</span>
            </a-tooltip>
          </template>
        </a-comment>
        <a-button
          v-show="canDelete(item.userDiscussion.userId)"
          @click="handleDelete(item.userDiscussion.level)"
          >删除</a-button
        >
      </a-list-item>
    </template>
  </a-list>
  <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="回帖">
      <a-textarea
        v-model:value="form.comment"
        showCount
        :maxlength="114"
        :rows="4"
        style="width: 600px"
      />
    </a-form-item>
  </a-form>
  <a-button @click="handleSubmit(form)">评论</a-button>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { List, message } from "ant-design-vue";
import { StaticPreviewUrl } from "../../../type/file";
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
import { readonly, inject, reactive, onMounted } from "vue";
import { isAdmin } from "../../../type/user";
export default {
  setup() {
    const route = useRoute();
    const disId = route.params.disId;
    const userInfo = useStore();
    const courseInfo = inject("courseInfo");
    const disDetail = reactive({
      data: {
        discussion: {
          creatorInfo: "",
          discussion: "",
        },
        userDiscussionList: [],
      },
    });

    const handleSubmit = () => {
      submitDiscuss({
        userId: userInfo.state.id,
        content: form.comment,
        discussionId: route.params.disId,
      })
        .then((res) => {
          message.success("success");
        })
        .catch((e) => {
          message.error("error");
        });
      form.comment = "";
      getDiscussDetail(route.params.disId)
        .then((res) => {
          disDetail.data = res;
        })
        .catch((e) => {
          message.error("error");
        });
    };

    const form = reactive({
      comment: "",
    });

    onMounted(() => {
      getDiscussDetail(route.params.disId)
        .then((res) => {
          disDetail.data = res;
        })
        .catch((e) => {
          message.error("error");
        });
      console.log(disDetail);
    });

    const canDelete = (id) => {
      return userInfo.state.id == id || isAdmin(courseInfo.role);
    };

    const handleDelete = (level) => {
      withdrawDiscuss({
        disID: route.params.disId,
        level: level,
      })
        .then((res) => {
          message.success("success");
        })
        .catch((e) => {
          message.error("error");
        });
      getDiscussDetail(route.params.disId)
        .then((res) => {
          disDetail.data = res;
        })
        .catch((e) => {
          message.error("error");
        });
    };

    const getAvatar = (id) => {
      return StaticPreviewUrl(id, "user");
    };

    return {
      handleSubmit,
      moment,
      disDetail,
      form,
      canDelete,
      handleDelete,
      getAvatar,
    };
  },
};
</script>

<style scoped>
</style>
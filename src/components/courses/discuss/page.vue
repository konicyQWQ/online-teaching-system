<template>
  <div>
    <a-card class="ant-card-shadow">
      <template #title>
        <h3>{{ disDetail.data.discussion.discussion.title }}</h3>
      </template>
      {{ disDetail.data.discussion.discussion.description }}
    </a-card>
    <a-card class="ant-card-shadow" style="margin-top: 1em">
      <a-list
          :header="`共${disDetail.data.userDiscussionList.length}条回复`"
          :data-source="disDetail.data.userDiscussionList"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-comment :author="item.userInfo.name" :avatar="StaticPreviewUrl(item.userInfo.avatarId, 'user')">
              <template #content>
                <p>
                  {{ item.userDiscussion.content }}
                </p>
              </template>
              <template #datetime>
                <a-tooltip>
                  <span style="margin-right: 1em">第{{ item.userDiscussion.level }}楼</span>
                  <span>{{ new Date(item.userDiscussion.submitTime).toLocaleString() }}</span>
                </a-tooltip>
              </template>
            </a-comment>
            <a-button
                v-show="canDelete(item.userDiscussion.userId)"
                @click="handleDelete(item.userDiscussion.level)"
                type="danger"
            >
              删除
            </a-button>
          </a-list-item>
        </template>
      </a-list>
      <a-divider :dashed="true"></a-divider>
      <create-form :model="model" :fields="fields" :form="form" style="width: 70%">
        <template #comment>
          <a-textarea
              v-model:value="model.comment"
              showCount
              :maxlength="200"
              :rows="4"
          />
        </template>
      </create-form>
    </a-card>
    <!--      <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">-->
    <!--        <a-form-item label="回帖">-->
    <!--          <a-textarea-->
    <!--            v-model:value="form.comment"-->
    <!--            showCount-->
    <!--            :maxlength="114"-->
    <!--            :rows="4"-->
    <!--            style="width: 600px"-->
    <!--          />-->
    <!--        </a-form-item>-->
    <!--      </a-form>-->
    <!--      <a-button @click="handleSubmit(form)">评论</a-button>-->
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {List, message} from "ant-design-vue";
import {StaticPreviewUrl} from "../../../type/file";
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
import {readonly, inject, reactive, onMounted} from "vue";
import {isAdmin} from "../../../type/user";
import createForm from "../../base/createForm.vue";

export default {
  components: {createForm},
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
      loading: true
    });

    const fetchData = () => {
      disDetail.loading = true
      getDiscussDetail(route.params.disId)
          .then((res) => {
            disDetail.data = res;
            disDetail.loading = false
          })
          .catch((e) => {
            message.error("error");
          });
    }

    const model = reactive({
      comment: ''
    })

    const handleSubmit = () => {
      submitDiscuss({
        userId: userInfo.state.id,
        content: model.comment,
        discussionId: route.params.disId,
      })
          .then((res) => {
            message.success("回复成功");
            model.comment = ''
            fetchData()
          })
          .catch((e) => {
            message.error("回帖失败");
          });
    };

    const fields = reactive({
      comment: {
        label: '回帖',
        customRender: {
          slot: 'comment'
        }
      }
    })

    const form = reactive({
      submitHint: '回帖',
      finish: handleSubmit
    });

    onMounted(() => {
      fetchData();
    });

    const canDelete = (id) => {
      return userInfo.state.id === id || isAdmin(courseInfo.role);
    };

    const handleDelete = (level) => {
      withdrawDiscuss({
        disID: route.params.disId,
        level: level,
      })
          .then((res) => {
            message.success("删除成功");
            fetchData()
          })
          .catch((e) => {
            message.error("error");
          });
    };

    return {
      handleSubmit,
      moment,
      disDetail,
      form,
      canDelete,
      handleDelete,
      StaticPreviewUrl,
      fields,
      model
    };
  },
};
</script>
<template>
  <div>
    <a-card class="ant-card-shadow">
      <template #title>
        <h3>所有讨论</h3>
      </template>
      <a-list item-layout="vertical" :data-source="allDiscussion.data" :loading="allDiscussion.loading">
        <template #renderItem="{ item, index }">
          <a-list-item>
<!--            <a-card-->
<!--                :title="item.discussion.title"-->
<!--                style="width: 800px"-->
<!--                hoverable="true"-->
<!--                :bordered="false"-->
<!--                @click="enterDiscussion(item.discussion.discussionId)"-->
<!--            >-->
<!--              <template #extra></template>-->
<!--              发起人：{{ item.creatorInfo.name }}-->
<!--            </a-card>-->
<!--            <a-button-->
<!--                @click="deleteDiscussion(item.discussion.discussionId)"-->
<!--                v-show="isAdmin(courseInfo.role)">-->
<!--              删帖-->
<!--            </a-button>-->
            <template #actions v-if="isAdmin(courseInfo.role)">
              <confirm-delete @confirm="deleteDiscussion(item.discussion.discussionId)"></confirm-delete>
            </template>
            <a-list-item-meta :description="new Date(item.discussion.createTime).toLocaleString()">
              <template #title>
                <a @click="enterDiscussion(item.discussion.discussionId)">{{ item.discussion.title }}</a>
              </template>
              <template #avatar>
                <a-tooltip>
                  <template #title>
                    {{item.creatorInfo.name}}
                  </template>
                  <a-avatar :src="StaticPreviewUrl(item.creatorInfo.avatarId, 'user')"></a-avatar>
                </a-tooltip>
              </template>
            </a-list-item-meta>
            {{item.discussion.description}}
          </a-list-item>
        </template>
      </a-list>
      <div v-show="notGuest(courseInfo.role)">
<!--        <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">-->
<!--          <a-form-item label="发贴标题">-->
<!--            <a-input v-model:value="form.title" type="textarea"/>-->
<!--          </a-form-item>-->
<!--          <a-form-item label="贴子描述">-->
<!--            <a-textarea-->
<!--                v-model:value="form.topic"-->
<!--                showCount-->
<!--                :maxlength="200"-->
<!--                :rows="4"-->
<!--                style="width: 600px"-->
<!--            />-->
<!--          </a-form-item>-->
<!--        </a-form>-->
<!--        <a-button @click="handleCreate">我要发贴</a-button>-->
        <a-divider :dashed="true"></a-divider>
        <create-form :model="model" :fields="fields" :form="form" style="width: 70%">
          <template #topic>
            <a-textarea
                v-model:value="model.topic"
                showCount
                :maxlength="200"
                :rows="4"
            />
          </template>
        </create-form>
      </div>
    </a-card>
  </div>
</template>

<script>
import {
  inject,
  reactive,
  onMounted,
} from "vue";
import {message} from "ant-design-vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {notGuest, isAdmin} from "../../../type/user";
import {
  createDiscuss,
  getDiscussion,
  removeDiscuss,
} from "../../../api/discuss";
import {StaticPreviewUrl} from "../../../type/file";
import confirmDelete from "../../base/confirmDelete.vue";
import createForm from "../../base/createForm.vue";

export default {
  components: { confirmDelete, createForm },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const allDiscussion = reactive({
      data: [],
      loading: true
    });
    const userInfo = useStore();
    const courseInfo = inject("courseInfo");

    // userInfo.state.token 目前登录用户的token
    // userInfo.state.avatarId 目前登录用户的头像ID
    // userInfo.state.role 登录用户的身份(跟课程不是对应关系的)
    // userInfo.state.name 登录用户的姓名

    // const form = reactive({
    //   title: "",
    //   topic: "",
    // });

    const model = reactive({
      title: "",
      topic: ""
    })

    const fields = reactive({
      title: {
        type: 'input',
        label: '发帖标题',
        rule: {
          required: true,
          trigger: 'blur'
        }
      },
      topic: {
        label: '内容',
        customRender: {
          slot: 'topic'
        }
      }
    })

    const handleCreate = () => {
      createDiscuss({
        courseId: route.params.cid,
        title: model.title,
        creatorID: userInfo.state.id,
        description: model.topic,
      })
          .then((res) => {
            message.success("发帖成功");
            fetchData()
          })
          .catch((e) => {
            message.error("发帖失败");
          });
    };

    const form = reactive({
      submitHint: '我要发贴',
      finish: handleCreate
    })

    const enterDiscussion = (diss_id) => {
      router.push({
        path: "./discuss/" + diss_id,
      });
    };

    const fetchData = () => {
      allDiscussion.loading = true
      getDiscussion(route.params.cid).then((res) => {
        allDiscussion.data = res;
        allDiscussion.loading = false
      });
    }

    onMounted(() => {
      fetchData();
    });

    const deleteDiscussion = (disID) => {
      removeDiscuss({disID: disID})
          .then((res) => {
            message.success("删除成功");
            fetchData();
          })
          .catch((e) => {
            message.error("删除失败");
          });
    };

    return {
      enterDiscussion,
      allDiscussion,
      handleCreate,
      courseInfo,
      notGuest,
      isAdmin,
      deleteDiscussion,
      StaticPreviewUrl,
      model,
      fields,
      form
    };
  },
};
</script>
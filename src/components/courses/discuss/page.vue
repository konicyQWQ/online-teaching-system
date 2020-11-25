<template>
  <a-card title="Default size card" style="width: 300px">
    <p>发起人：{{}}</p>
    <p>发布时间：{{}}</p>
  </a-card>
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
            <!-- <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.datetime.fromNow() }}</span>
            </a-tooltip> -->
            {{ item.datetime.format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>
  <a-comment>
    <template #avatar>
      <a-avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
    </template>
    <template #content>
      <a-form-item>
        <a-textarea :rows="4" v-model:value="value" />
      </a-form-item>
      <a-form-item>
        <a-button
          html-type="submit"
          :loading="submitting"
          type="primary"
          @click="handleSubmit"
        >
          提交
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    //const disId = route.params.disId;

    const handleSubmit = () => {};

    return { handleSubmit };
  },
};
</script>

<style scoped>
</style>
<template>
  <a-card class="ant-card-shadow" :body-style="{ padding: '.5em 0' }">
    <template v-slot:title>
      <slot name="title"></slot>
    </template>
    <div v-if="router">
      <router-link v-for="tab in tabList"
                   :to="tab.key"
                   class="tab">
        {{ tab.name }}
      </router-link>
    </div>
    <div v-else>
      <div v-for="tab in tabList"
           class="tab"
           @click="tab.handleClick"
           style="cursor: pointer">
        {{ tab.name }}
      </div>
    </div>
  </a-card>
</template>

<script lang="ts">
/**
 * <navCard :tabList="">
 *   <template #title>标题内容，可以自定义任意信息</template>
 * </navCard>
 *
 * tabList 一个数组，数组的每个元素是下面的Tab类型
 *
 */

interface Tab {
  key: string, // 点击之后会进入到的路由
  name: string // 显示在导航栏上的名字
}

export default {
  props: {
    tabList: Array<Tab> | undefined,
    router: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.tab {
  display: block;
  color: #555;
  font-size: 16px;
  padding: .5em 1em;
  transition: all .3s ease;
  border-left: 3px solid transparent;

  &:hover {
    border-left-color: var(--hover-color);
    background: var(--hover-background);
  }

  &.router-link-active {
    border-left-color: var(--choose-color);
    background: var(--hover-background);
  }
}
</style>
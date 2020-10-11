<template>
  <a-card class="ant-card-shadow" :body-style="{ padding: '.5em 0' }">
    <template v-slot:title>
      <slot name="title"></slot>
    </template>
    <div v-if="router">
      <router-link v-for="tab in tabList"
                   :to="{ name: tab.key }"
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

<script>
export default {
  name: 'navCard',
  props: {
    tabList: Object,
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
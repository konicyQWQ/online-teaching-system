<template>
  <a-popconfirm title="你确定要删除吗?" ok-text="确认" cancel-text="取消">
    <a-button :type="type" :style="{color: type === 'link' ? 'red' : 'white'}" v-if="button === 'button'">{{ hint }}</a-button>
    <a type="link" style="color: red" v-else>{{ hint }}</a>
  </a-popconfirm>
</template>

<script>

// 有一个confirm和cancel事件

export default {
  name: "confirmDelete",
  props: {
    hint: {
      type: String,
      default: '删除'
    },
    button: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: "link"
    }
  }
}
</script>
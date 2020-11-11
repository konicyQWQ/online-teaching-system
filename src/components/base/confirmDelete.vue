<template>
  <a-popconfirm title="你确定要删除吗?" ok-text="确认" cancel-text="取消">
    <a-button type="link" style="color: red">删除</a-button>
  </a-popconfirm>
</template>

<script>

// 有一个confirm和cancel事件

export default {
  name: "confirmDelete"
}
</script>
<template>
  <div class="collapse">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "collapse"
}
</script>

<style scoped lang="scss">
.collapse {
  position: relative;

  > *:nth-child(1) {
    border-top: 1px solid #ebeef5;
  }

  > * {
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
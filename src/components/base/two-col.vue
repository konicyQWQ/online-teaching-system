<template>
  <div class="two-col-row">
    <div class="col left">
      <slot name="left"></slot>
    </div>
    <div :class="['col', 'right', { fixed: fixed && scrollTop > 144 }]" v-show="right">
      <slot name="right"></slot>
    </div>
    <div class="col right empty" v-show="fixed && scrollTop > 144"/>
  </div>
</template>

<script>
/**
 * <twoCol :right="true | false" :fixed="true | false">
 *   <template #left> 页面左侧显示的内容 </template>
 *   <template #right> 页面右侧显示的内容 </template>
 * </twoCol>
 *
 * right属性: true则显示右侧内容，默认为true
 * fixed属性: true则右侧内容将会变为fixed状态，默认为false
 */
import {onMounted, ref} from "vue";

export default {
  name: "twoCol",
  props: {
    right: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    let scrollTop = ref(0)
    onMounted(() => {
      window.addEventListener('scroll', () => {
        scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      })
    })
    return {scrollTop}
  }
}
</script>

<style lang="scss">
.two-col-row {
  display: flex;
  margin: 0em 7%;

  @media screen and (max-width: 1200px) {
    margin: 0;
  }

  .col {
    margin: 0 1em;

    &.left {
      flex: 14;

      > * {
        margin-top: 1em;

        &:first-child {
          margin-top: 0;
        }
      }
    }

    &.right {
      width: 240px;
      @media screen and (max-width: 1200px) {
        width: 200px;
      }

      > * {
        margin-top: 1em;

        &:first-child {
          margin-top: 0;
        }
      }
    }

    &.empty {
      @media screen and (max-width: 1200px) {
        display: none;
      }
    }

    &.fixed {
      position: fixed;
      top: calc(2em + 57px);
      right: 7%;
      z-index: 9;

      @media screen and (max-width: 1200px) {
        position: static;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>
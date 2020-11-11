<template>
  <div class="collapse-panel">
    <div class="tab" @click="changeActive">
      <div class="left">
        <slot name="header"></slot>
      </div>
      <div :class="['right', { 'active': active }]">
        <RightOutlined />
      </div>
    </div>
    <transition @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter"
                @before-leave="beforeLeave"
                @leave="leave"
                @after-leave="afterLeave"
                :css="false">
      <div v-show="active">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'

export default {
  name: "collapsePanel",
  components: {RightOutlined},
  setup() {
    const active = ref(false)
    const changeActive = () => {
      active.value = !active.value;
    }

    const elTransition = 'all .3s ease'

    const beforeEnter = (el) => {
      el.style.transition = elTransition
      if(!el.dataset) el.dataset = {}
      el.style.height = 0;
    }

    const enter = (el, done) => {
      el.dataset.oldOverflow = el.style.overflow

      if(el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px'
      } else {
        el.style.height = ''
      }

      el.style.overflow = 'hidden'
    }

    const afterEnter = (el) => {
      el.style.transition = ''
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
    }

    const beforeLeave = (el) => {
      if(!el.dataset) el.dataset = {}
      el.dataset.oldOverflow = el.style.overflow

      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
    }

    const leave = (el, done) => {
      if(el.scrollHeight !== 0) {
        el.style.height = 0
        el.style.transition = elTransition
      }
    }

    const afterLeave = (el) => {
      el.style.transition = ''
      el.style.height = 0
      el.style.overflow = el.dataset.oldOverflow
    }

    return { active, changeActive, enter, beforeEnter, afterEnter, afterLeave, beforeLeave, leave }
  }
}
</script>

<style scoped lang="scss">
.collapse-panel {
  position: relative;
  margin: 0 1em;

  .tab {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #303133;
    padding: 1em 0;

    .left {
      flex: 1;
    }

    .right {
      transition: all .5s ease;
      margin-left: 2em;
      &.active {
        transform: rotateZ(90deg);
      }
    }
  }
}
</style>
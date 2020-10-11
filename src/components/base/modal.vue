<template>
  <teleport to="#modal">
    <div v-if="visible" class="my-mask" @click="handleClickMask" />
    <transition name="modal-scale">
      <div class="fixed-center" v-if="visible">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script>
import {} from 'vue'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    // 点击遮罩
    const handleClickMask = () => {
      context.emit('close')
    }

    return { handleClickMask }
  }
}
</script>

<style scoped lang="scss">
.my-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.fixed-center {
  position: fixed;
  z-index: 200;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 0 0;
}

.modal-scale-enter-active, .modal-scale-leave-active {
  transition: all .3s ease;
}

.modal-scale-enter-from, .modal-scale-leave-to {
  transform: scale(.5) translate(-50%, -50%);
  opacity: 0;
}
</style>
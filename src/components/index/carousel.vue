<template>
  <div class="carousel">
    <div class="page-list">
      <img v-for="page in pages" 
           :key="page.id" class="page" 
           :src="StaticPreviewUrl(page.fileId)"
           @click="handleClickImg(page.url)"
           :style="{transform: `translateX(-${nowIndex}00%)`}"
           >
    </div>
    <div class="dot-list">
      <div v-for="(page, index) in pages" 
           :key="page.id"
           :class="['dot', {'dot-active': nowIndex==index}]"
           @click="handleClickDot(index)">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { HomePage } from '../../api/homePage'
import { PropType, ref } from 'vue'
import { StaticPreviewUrl } from '../../type/file'
import { useRouter } from 'vue-router'

export default {
  name: 'carousel',
  props: {
    pages: Object as PropType<HomePage[]>
  },
  setup(props) {
    const router = useRouter()
    const nowIndex = ref(0);
    // 点击了图片
    const handleClickImg = (url) => {
      router.push(url);
    }
    // 点击了小点
    const handleClickDot = (index) => {
      nowIndex.value = index;
    }
    // 图片每隔一段时间旋转
    setInterval(() => {
      nowIndex.value = nowIndex.value + 1 < props.pages.length ? nowIndex.value + 1 : 0;
    }, 5000)

    return { StaticPreviewUrl, handleClickImg, nowIndex, handleClickDot }
  }
}
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
  box-shadow: 2px 0px 10px 0 #aaa;

  .page-list {
    white-space: nowrap;
    height: 100%;
    overflow: hidden;

    .page {
      transition: all 1s ease;
      object-fit: cover;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
  }

  .dot-list {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translateX(-50%);

    .dot {
      border-radius: 50%;
      border: 1px solid #000;
      background-color: #aaa;
      width: 1em;
      height: 1em;
      display: inline-block;
      margin: 0 .3em;
      cursor: pointer;

      &.dot-active {
        background: #fff;
      }
    }
  }
}
</style>
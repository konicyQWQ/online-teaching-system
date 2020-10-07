<template>
  <a-carousel autoplay>
    <router-link v-for="item in img"
                 :to="`/courses/${item.courseId}`">
      <img :src="`/public/${item.imgName}`" :style="{ width: '100%' }"/>
    </router-link>
  </a-carousel>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      img: [
        {
          courseId: 1,
          imgName: '1.jpg'
        },
        {
          courseId: 2,
          imgName: '2.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>
.ant-carousel {
  margin: 50px 300px;
}

.ant-carousel ::v-deep(.slick-slide) {
  height: 400px;
}
</style>
<template>
  <a-card>
    {{a}}
    <a-button type="primary" @click="add">
      Primary
    </a-button>
  </a-card>
</template>

<script>
import request from "../../api/axios";
import { getUserInfo } from "../../api/user";

export default {
  data() {
    return {
      a: 1
    }
  },
  methods: {
    add() {
      this.a = this.a + 1
      // 全局变量 token
      const token = this.$store.state.token
      getUserInfo(token).then(res => {
        console.log(res)
      }).catch((e)=> {

      })
      //
      // request.get('url', {
      //   params: {
      //
      //   }
      // }).then((res) => {
      //
      // }).catch(e => {
      //
      // })
      //
      // request.post('url', {
      //   a: 1
      // })
    }
  }
}
</script>

<style scoped>

</style>
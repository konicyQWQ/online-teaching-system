<template>
  <div class="footer">
    <ul v-for="list in category" class="list">
      <li class="title">{{ list.title }}</li>
      <li v-for="item in list.linkList">
        <a :href="item.link" target="_blank">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import {readonly} from 'vue'

export default {
  name: 'mFooter',
  setup() {
    let category = readonly([
      {
        title: '友情链接',
        linkList: [{name: '学在浙大', link: 'http://course.zju.edu.cn/'},
          {name: '网易云课堂', link: 'https://study.163.com/'}]
      },
      {
        title: '开发记录',
        linkList: [{name: 'Github--前端', link: 'https://github.com/konicyQWQ/online-teaching-system'},
          {name: 'Github--后端', link: 'https://github.com/konicyQWQ/online-teaching-system-server'}]
      },
      {
        title: '技术支持',
        linkList: [{name: 'Vue', link: 'https://cn.vuejs.org/'},
          {name: 'Ant Design Vue', link: 'https://2x.antdv.com/docs/vue/introduce-cn/'},
          {name: '.NET Core', link: 'https://docs.microsoft.com/zh-cn/aspnet/core/?view=aspnetcore-3.1'},]
      }
    ])
    return { category }
  }
}
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  padding: 2em 5%;
  background: #222;

  .list {
    list-style: none;
    margin-right: 5%;

    li {
      margin-bottom: .3em;

      &.title {
        font-size: 18px;
        font-weight: 300;
        color: #fff;
        margin-bottom: .5em;
      }

      a {
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
</style>
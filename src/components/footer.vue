<template>
  <a-row :style="{textAlign: 'center'}">
    <a-col :span="6" v-for="item in catagory">
      <div class="list">
        <h3>{{  item.title  }}</h3>
        <a v-for="link in item.linkList" 
          :href="link.link"
           target="_blank">
          {{ link.name }}
        </a>
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'footer',
  data() {
    return {
      catagory: [
        {
          title: '友情链接',
          linkList: [{name: '学在浙大', link: 'http://course.zju.edu.cn/'},
                     {name: '网易云课堂', link: 'https://study.163.com/'}]
        },
        {
          title: '开发记录',
          linkList: [{name: 'Github', link: ''}]
        },
        {
          title: '技术支持',
          linkList: [{name: 'Vue', link: 'https://cn.vuejs.org/'},
                     {name: 'Ant Design Vue', link: 'https://2x.antdv.com/docs/vue/introduce-cn/'},
                     {name: '.NET Core', link: 'https://docs.microsoft.com/zh-cn/dotnet/core/about'},]
        },
        {
          title: '其他',
          linkList: [{name: '没啥其它', link: ''}]
        }
      ]
    }
  }  
}
</script>

<style scoped>
.list {
  display: inline-block;
  text-align: left;
}

.list > h3 {
  font: bold 1.2em sans-serif;
}

.list > a {
  display: block;
  margin-top: .5em;
  color: rgba(0, 0, 0, .9);
}
</style>
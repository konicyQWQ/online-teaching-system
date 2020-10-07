import { createApp } from 'vue'
import App from './App.vue'
import request from './axios'
import router from './router'
import store from './store'

import { Button, message, Layout, Row, Col, Form, Menu, Avatar, Card, Spin, Carousel,
    Tabs, Skeleton, Descriptions, Badge, BackTop, Anchor, Affix, Table, Input, List, Checkbox, Pagination } from 'ant-design-vue'
import 'ant-design-vue/lib/style/index.css'
import 'ant-design-vue/lib/button/style/index.css'
import 'ant-design-vue/lib/message/style/index.css'
import 'ant-design-vue/lib/layout/style/index.css'
import 'ant-design-vue/lib/grid/style/index.css'
import 'ant-design-vue/lib/form/style/index.css'
import 'ant-design-vue/lib/menu/style/index.css'
import 'ant-design-vue/lib/avatar/style/index.css'
import 'ant-design-vue/lib/card/style/index.css'
import 'ant-design-vue/lib/tabs/style/index.css'
import 'ant-design-vue/lib/skeleton/style/index.css'
import 'ant-design-vue/lib/descriptions/style/index.css'
import 'ant-design-vue/lib/badge/style/index.css'
import 'ant-design-vue/lib/back-top/style/index.css'
import 'ant-design-vue/lib/anchor/style/index.css'
import 'ant-design-vue/lib/affix/style/index.css'
import 'ant-design-vue/lib/table/style/index.css'
import 'ant-design-vue/lib/input/style/index.css'
import 'ant-design-vue/lib/list/style/index.css'
import 'ant-design-vue/lib/checkbox/style/index.css'
import 'ant-design-vue/lib/pagination/style/index.css'
import 'ant-design-vue/lib/spin/style/index.css'
import 'ant-design-vue/lib/carousel/style/index.css'

const app = createApp(App)

app.use(Button).use(Layout).use(Row).use(Col).use(Form).use(Badge).use(BackTop).use(Affix).use(Input).use(Pagination).use(Spin)
    .use(Menu).use(Avatar).use(Card).use(Tabs).use(Skeleton).use(Descriptions).use(Anchor).use(Table).use(List).use(Checkbox).use(Carousel)

app.config.globalProperties.$message = message
app.config.globalProperties.$request = request

app.use(router).use(store)
app.mount('#app')

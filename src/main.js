import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Card, Form, Input, Button, Checkbox, Row, Col, Divider,
    Avatar, Descriptions, Badge, Tooltip, List, Table, Pagination } from 'ant-design-vue'
import 'ant-design-vue/lib/style/index.css'
import 'ant-design-vue/lib/card/style/index.css'
import 'ant-design-vue/lib/button/style/index.css'
import 'ant-design-vue/lib/input/style/index.css'
import 'ant-design-vue/lib/form/style/index.css'
import 'ant-design-vue/lib/checkbox/style/index.css'
import 'ant-design-vue/lib/grid/style/index.css'
import 'ant-design-vue/lib/avatar/style/index.css'
import 'ant-design-vue/lib/message/style/index.css'
import 'ant-design-vue/lib/descriptions/style/index.css'
import 'ant-design-vue/lib/badge/style/index.css'
import 'ant-design-vue/lib/tooltip/style/index.css'
import 'ant-design-vue/lib/list/style/index.css'
import 'ant-design-vue/lib/table/style/index.css'
import 'ant-design-vue/lib/pagination/style/index.css'
import 'ant-design-vue/lib/divider/style/index.css'

import './index.css'

const app = createApp(App)
app.use(Card).use(Form).use(Input).use(Button).use(Checkbox).use(Row).use(Col).use(Pagination)
    .use(Avatar).use(Descriptions).use(Badge).use(Tooltip).use(List).use(Table).use(Divider)

app.use(router).use(store)
app.mount('#app')

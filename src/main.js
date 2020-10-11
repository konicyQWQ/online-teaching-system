import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.ts';

import {
    Card, Avatar, Row, Col, Divider, Result, Badge, Tooltip, Pagination,
    Form, Input, Button, Checkbox, Radio, AutoComplete, Select, InputNumber,
    Descriptions, List, Table, Steps,
    message
} from 'ant-design-vue';

import 'ant-design-vue/lib/style/index.css';
import 'ant-design-vue/lib/card/style/index.css';
import 'ant-design-vue/lib/button/style/index.css';
import 'ant-design-vue/lib/input/style/index.css';
import 'ant-design-vue/lib/form/style/index.css';
import 'ant-design-vue/lib/checkbox/style/index.css';
import 'ant-design-vue/lib/grid/style/index.css';
import 'ant-design-vue/lib/avatar/style/index.css';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/descriptions/style/index.css';
import 'ant-design-vue/lib/badge/style/index.css';
import 'ant-design-vue/lib/tooltip/style/index.css';
import 'ant-design-vue/lib/list/style/index.css';
import 'ant-design-vue/lib/table/style/index.css';
import 'ant-design-vue/lib/pagination/style/index.css';
import 'ant-design-vue/lib/divider/style/index.css';
import 'ant-design-vue/lib/input-number/style/index.css';
import 'ant-design-vue/lib/steps/style/index.css';
import 'ant-design-vue/lib/radio/style/index.css';
import 'ant-design-vue/lib/auto-complete/style/index.css';
import 'ant-design-vue/lib/select/style/index.css';
import 'ant-design-vue/lib/result/style/index.css';

import './index.css';

const app = createApp(App);

[Card, Form, Input, Button, Checkbox, Row, Col, Pagination, Avatar, Descriptions, Badge, Tooltip, List, Table, Divider,
  InputNumber, Steps, Radio, AutoComplete, Select, Result, router, store].forEach(el => app.use(el))

// 暴露 message
app.provide('message', message);
app.mount('#app')

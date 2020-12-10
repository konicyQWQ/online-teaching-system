import { createApp } from 'vue'
import routes from "./router";
import store from "./store";
import App from './App.vue'

// import antd from 'ant-design-vue'
 import 'ant-design-vue/dist/antd.css'

import {
    Button, Row, Col, Space, Pagination, Steps, AutoComplete, Checkbox,
    DatePicker, Form, Input, InputNumber, Radio, Select, TimePicker, Upload, Avatar, Card, Badge, Comment, Descriptions,
    Empty, List, Mentions, Statistic, Table, Tag, Tooltip, Alert, Popconfirm, Result, Skeleton, Spin, ConfigProvider, Divider,
    Progress, Carousel, Tabs
} from 'ant-design-vue';

import 'ant-design-vue/lib/progress/style/index.css';
import 'ant-design-vue/lib/mentions/style/index.css';
import 'ant-design-vue/lib/statistic/style/index.css';
import 'ant-design-vue/lib/table/style/index.css';
import 'ant-design-vue/lib/tag/style/index.css';
import 'ant-design-vue/lib/tooltip/style/index.css';
import 'ant-design-vue/lib/alert/style/index.css';
import 'ant-design-vue/lib/popover/style/index.css';
import 'ant-design-vue/lib/result/style/index.css';
import 'ant-design-vue/lib/skeleton/style/index.css';
import 'ant-design-vue/lib/spin/style/index.css';
import 'ant-design-vue/lib/config-provider/style/index.css';
import 'ant-design-vue/lib/divider/style/index.css';
import 'ant-design-vue/lib/style/index.css';
import 'ant-design-vue/lib/button/style/index.css';
import 'ant-design-vue/lib/grid/style/index.css';
import 'ant-design-vue/lib/space/style/index.css';
import 'ant-design-vue/lib/pagination/style/index.css';
import 'ant-design-vue/lib/steps/style/index.css';
import 'ant-design-vue/lib/auto-complete/style/index.css';
import 'ant-design-vue/lib/checkbox/style/index.css';
import 'ant-design-vue/lib/date-picker/style/index.css';
import 'ant-design-vue/lib/form/style/index.css';
import 'ant-design-vue/lib/input/style/index.css';
import 'ant-design-vue/lib/input-number/style/index.css';
import 'ant-design-vue/lib/radio/style/index.css';
import 'ant-design-vue/lib/select/style/index.css';
import 'ant-design-vue/lib/time-picker/style/index.css';
import 'ant-design-vue/lib/upload/style/index.css';
import 'ant-design-vue/lib/avatar/style/index.css';
import 'ant-design-vue/lib/card/style/index.css';
import 'ant-design-vue/lib/badge/style/index.css';
import 'ant-design-vue/lib/comment/style/index.css';
import 'ant-design-vue/lib/descriptions/style/index.css';
import 'ant-design-vue/lib/empty/style/index.css';
import 'ant-design-vue/lib/list/style/index.css';
import 'ant-design-vue/lib/message/style/index.css'
import 'ant-design-vue/lib/carousel/style/index.css'
import 'ant-design-vue/lib/tabs/style/index.css'

import './index.css';

const app = createApp(App);

[Progress,Button, Row, Col, Space, Pagination, Steps, AutoComplete, Checkbox, Carousel, Tabs,
    DatePicker, Form, Input, InputNumber, Radio, Select, TimePicker, Upload, Avatar, Card, Badge, Comment, Descriptions,
    Empty, List, Mentions, Statistic, Table, Tag, Tooltip, Alert, Popconfirm, Result, Skeleton, Spin, ConfigProvider, Divider, routes, store].forEach(el => app.use(el))

app.mount('#app')

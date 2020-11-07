import { createApp } from 'vue'
import routes from "./router";
import store from "./store";
import App from './App.vue'

import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './index.css'

createApp(App).use(antd).use(routes).use(store).mount('#app')

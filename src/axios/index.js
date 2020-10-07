import axios from 'axios'
import Qs from 'qs'
import store from '../store'
import { message } from 'ant-design-vue'

const request = axios.create({
    baseURL: 'https://localhost:5001/api',
    timeout: '5000'
})

request.defaults.crossDomain = true

request.interceptors.request.use(
    config => {
        // 表单化传递参数 (post)
        /*if (config.data) {
            config.data = Qs.stringify(config.data)
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }*/
        if(store.state.token)
            config.headers['Authentication'] = store.state.token
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        return response
    },
    error => {
        message.error('网络错误')
        return Promise.reject(error)
    }
)

export default request
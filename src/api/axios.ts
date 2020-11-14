import axios from 'axios'
import store from "../store";
import {APIUrl} from "../type/setting";
// @ts-ignore
import Qs from 'qs'

const request = axios.create({
    baseURL: APIUrl,
    timeout: 5000
})

request.interceptors.request.use(
    config => {
        // 表单化传递参数 (只有post才会有data属性)
        if (config.data) {
            config.data = Qs.stringify(config.data)
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        return config
    },
    error => Promise.reject(error.toString())
)

request.interceptors.response.use(
    response => {
        if (response.data.res === false) {
            if (response.data.error === 'Token is Invalid')
                store.commit('logout');
            return Promise.reject(response.data.error)
        }
        return response
    },
    error => Promise.reject(error.toString())
)

export default request
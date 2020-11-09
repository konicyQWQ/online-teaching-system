import request from './axios'
import { Role } from '../type'
import store from '../store'
import { md5 } from './md5'

interface Authentication {
    id: string,
    password: string,
    remember: boolean
}

/**
 * return whether the login is successful.
 * @param id 学号
 * @param password 密码
 * @param remember 是否记住登录状态
 */
async function login({ id, password, remember }:Authentication) : Promise<string> {
    const loginRes = await request.post('/user', {
        id,
        password: md5(password)
    });
    if(loginRes.data.role === Role.guest) {
        return Promise.reject('登录失败:' + loginRes.data.token)
    } else {
        await store.dispatch('loginByToken', {
            token: loginRes.data.token,
            remember
        })
        return Promise.resolve('登录成功')
    }
}

export {
    login
}
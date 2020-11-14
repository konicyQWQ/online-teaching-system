import request from './axios'
import store from '../store'
import {Role} from "../type/user";
import {md5} from './md5'

interface Authentication {
    id: string,
    password: string,
    remember: boolean
}

async function login({id, password, remember}: Authentication): Promise<string> {
    const loginRes = await request.post('/user', {
        id,
        password: md5(password)
    });
    if (loginRes.data.role === Role.guest) {
        return Promise.reject(loginRes.data.error)
    } else {
        await store.dispatch('loginByToken', {
            token: loginRes.data.token,
            remember
        })
        return Promise.resolve('')
    }
}

export {
    login
}
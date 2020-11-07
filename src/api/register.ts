import request from '../api/axios'
import { Gender } from "../type";
import { md5 } from './md5'

interface RegisterInfo {
    id: string,
    password: string,
    name: string,
    gender: Gender,
    grade: number,
    email: string,
    phone: string,
    avatarId: number
}

interface RegisterRes {
    res: boolean, // 成功是 true
    token: string // 登录成功会返回token，不成功会返回失败原因
}

async function register(infomation:RegisterInfo) : Promise<string> {
    infomation.password = md5(infomation.password)
    const res = await request.post('/authentication/regist', infomation)
    const data : RegisterRes = res.data
    if(data.res) {
        return Promise.resolve(data.token)
    } else {
        return Promise.reject('注册失败: ' + res.data.token);
    }
}

export {
    register
}
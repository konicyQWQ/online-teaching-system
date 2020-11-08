import request from "./axios"
import { Gender, Role } from "../type"

export declare interface User {
    id: string,
    name: string,
    gender: Gender,
    grade: number,
    phone: string,
    email: string,
    Role: Role,
    avatarId: string,
    introduction: string
}

/**
 * return the user information
 * @param token 需要登录后才能获取，传入token
 */
async function getUserInfo(token:string) : Promise<User> {
    const res = await request.get('/authentication/user', {
        params: {
            token
        }
    })
    return res.data
}

async function modifyUserInfo(user:User, token:string) : Promise<string> {
    const res = await request.post('/authentication/changeinfo', {
        ...user,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('修改成功')
}

export {
    getUserInfo,
    modifyUserInfo
}
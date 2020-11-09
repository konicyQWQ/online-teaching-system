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
    const res = await request.get('/user/user', {
        params: {
            token
        }
    })
    return res.data
}

async function modifyUserInfo(user:User, token:string) : Promise<string> {
    const res = await request.post('/user/changeinfo', {
        ...user,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('修改成功')
}

interface SearchUser {
    keyword: string, // 搜索关键字
    limit: number // 结果数量上限
    role: Role // 搜索身份
}

async function searchUser(search:SearchUser):Promise<Array<User>> {
    if(!search.limit) search.limit = 10;
    const res = await request.get('/user', {
        params: search
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error);
    return Promise.resolve(res.data.resList);
}

export {
    getUserInfo,
    modifyUserInfo,
    searchUser
}
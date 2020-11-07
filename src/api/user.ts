import request from "./axios"
import { Gender, Role } from "../type"

interface User {
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

export {
    getUserInfo
}
import request from "./axios"
import { Gender, Role } from "../type"
import store from "../store";
import {md5} from "./md5";

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

async function modifyUserInfo(user:User, token:string = null) : Promise<string> {
    token = token || store.state.token
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

async function resetPassword({ oldPassword, newPassword }) {
    const res = await request.post('/user/resetPassword',{
        token: store.state.token,
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('修改成功')
}

async function getAllUser({ start, limit, keyword, roles }) {
    const token = store.state.token
    const res = await request.post('/user/getall', {
        start,
        limit,
        keyword,
        roles,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve({
        total: res.data.totalCount,
        data: res.data.resList
    })
}

async function deleteUser({ userID }) {
    const token = store.state.token
    const res = await request.post('/user/remove', {
        userID,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('删除成功')
}

async function newGetUserInfo({ userID } : { userID?: string }) {
    const token = store.state.token
    const res = await request.get('/user/getInfo', {
        params: {
            token,
            userID
        }
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve({
        userInfo: res.data.userInfo,
        courseList: res.data.courseList
    })
}

async function addToCourses({ userID, courseID, role }) {
    const token = store.state.token
    const res = await request.post('/user/addToCourse', {
        userID,
        courseID,
        role,
        token
    })
    if(!res.data.res)
        return Promise.reject(res.data.error)
    return Promise.resolve('添加成功')
}

async function removeFromCourse({ userID, courseID }) {
    const token = store.state.token
    const res = await request.post('/user/removeFromCourse', {
        userID,
        courseID,
        token
    })
    if(!res.data.res)
        return Promise.reject(res.data.error)
    return Promise.resolve('移除成功')
}

export {
    getUserInfo,
    modifyUserInfo,
    searchUser,
    resetPassword,
    getAllUser,
    deleteUser,
    newGetUserInfo,
    addToCourses,
    removeFromCourse
}
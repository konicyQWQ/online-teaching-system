import request from "./axios"
import store from "../store";
import {User, Role} from "../type/user";
import {md5} from "./md5";
import {UserCourse} from "../type/course";

/**
 * 注册接口
 * @return 用户的token
 */
async function register(info: User): Promise<string> {
    const res = await request.post('/user/regist', {
        ...info,
        password: md5(info.password)
    })
    return res.data.token;
}

/**
 * 返回用户信息
 * @param token 需要登录后才能获取，传入token
 */
async function getUserInfo(token: string): Promise<User> {
    const res = await request.get('/user/user', {
        params: {
            token
        }
    })
    return res.data
}

/**
 * 修改用户信息
 * @param user
 */
async function modifyUserInfo(user: User): Promise<string> {
    const token = store.state.token
    const res = await request.post('/user/changeinfo', {
        ...user,
        token
    })
    return ''
}

interface SearchUser {
    keyword: string, // 搜索关键字
    limit: number // 结果数量上限
    role: Role // 搜索身份
}
/**
 * 搜索用户
 * @param search
 */
async function searchUser(search: SearchUser): Promise<Array<User>> {
    if (!search.limit) search.limit = 10;
    const res = await request.get('/user', {
        params: search
    })
    return res.data.resList;
}

/**
 * 重置密码
 * @param oldPassword
 * @param newPassword
 */
async function resetPassword({oldPassword, newPassword}) {
    const res = await request.post('/user/resetPassword', {
        token: store.state.token,
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)
    })
    return ''
}

interface AllUser {
    total: number,
    data: User[]
}
/**
 * 获得所有用户信息
 * @param start
 * @param limit
 * @param keyword
 * @param roles
 */
async function getAllUser({start, limit, keyword, roles}): Promise<AllUser> {
    const token = store.state.token
    const res = await request.post('/user/getall', {
        start,
        limit,
        keyword,
        roles,
        token
    })
    return {
        total: res.data.totalCount,
        data: res.data.resList
    }
}

/**
 * 删除用户
 * @param userID
 */
async function deleteUser({userID}) {
    const token = store.state.token
    const res = await request.post('/user/remove', {
        userID,
        token
    })
    return ''
}

/**
 * 获得用户信息，包括他的课程
 * @param userID
 */
async function newGetUserInfo({userID}: { userID?: string }): Promise<{ userInfo: User, courseList: UserCourse }> {
    const token = store.state.token
    const res = await request.get('/user/getInfo', {
        params: {
            token,
            userID
        }
    })
    return {
        userInfo: res.data.userInfo,
        courseList: res.data.courseList
    }
}

async function addToCourses({userID, courseID, role}) {
    const token = store.state.token
    const res = await request.post('/user/addToCourse', {
        userID,
        courseID,
        role,
        token
    })
    return ''
}

async function removeFromCourse({userID, courseID}) {
    const token = store.state.token
    const res = await request.post('/user/removeFromCourse', {
        userID,
        courseID,
        token
    })
    return ''
}

export {
    register,
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
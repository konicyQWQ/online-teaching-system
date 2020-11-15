import request from "./axios";
import store from '../store/index'
import {Course, CourseWithTeachers} from "../type/course";
import {Role, User} from "../type/user";

export declare interface SearchCourseParams {
    keyword?: string,
    start?: number,
    limit?: number
}

/**
 * 搜索所有的课程
 * @param keyword 关键字
 * @param start 从第几条开始
 * @param limit 限制返回数量
 */
export async function getAllCourses({keyword = '', start = 0, limit = 10}: SearchCourseParams)
    : Promise<{ totalCount: number, resList: Array<CourseWithTeachers> }> {
    const res = await request.get('/course/get', {
        params: {
            keyword, start, limit
        }
    })
    return res.data
}

/**
 * 获取单个课程信息
 * @param id
 */
export async function getCourses({id}): Promise<CourseWithTeachers> {
    const res = await request.get('/course', {
        params: {id}
    })
    return res.data
}

/**
 * 添加新课程
 * @param courses
 * @param teachers
 */
export async function newCourses(courses: Course, teachers: Array<string>): Promise<number> {
    const token = store.state.token;
    const res = await request.post('/course', {
        token,
        course: {
            ...courses,
            startTime: courses.startTime.toJSON()
        },
        teachers
    })
    return res.data.courseId
}

/**
 * 修改课程
 * @param courses
 * @param teachers
 */
export async function modifyCourses(courses: Course, teachers: Array<string>): Promise<number> {
    const token = store.state.token;
    const res = await request.post('/course/update', {
        token,
        course: {
            ...courses,
            startTime: typeof courses.startTime == 'string' ? courses.startTime : courses.startTime.toJSON()
        },
        teachers
    })
    return res.data.courseId
}

/**
 * 获得token这个人在id这个课程里面是什么身份
 * @param id
 */
export async function getRole({id}): Promise<Role> {
    const token = store.state.token || '';
    const res = await request.get('/course/getrole', {
        params: {
            token,
            courseID: id
        }
    })
    return res.data.role
}

/**
 * 获得课程的所有用户
 * @param courseID
 */
export async function getCourseUser({courseID}): Promise<User[]> {
    const token = store.state.token
    const res = await request.get('/course/getUsers', {
        params: {
            courseID,
            token
        }
    })
    return res.data.userList
}
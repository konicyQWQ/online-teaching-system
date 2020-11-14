import request from "./axios";
import store from '../store/index'
import {Course, CourseWithTeachers} from "../type/course";

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

export async function getCourses({id}) {
    const res = await request.get('/course', {
        params: {id}
    })
    return res.data
}

export async function newCourses(courses: Course, teachers: Array<string>) {
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

export async function modifyCourses(courses: Course, teachers: Array<string>) {
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

// 返回登录的用户在这个课程里面是什么身份
export async function getRole({id}) {
    const token = store.state.token || '';
    const res = await request.get('/course/getrole', {
        params: {
            token,
            courseID: id
        }
    })
    return res.data
}

export async function getCourseUser({courseID}) {
    const token = store.state.token
    const res = await request.get('/course/getUsers', {
        params: {
            courseID,
            token
        }
    })
    return res.data.userList
}
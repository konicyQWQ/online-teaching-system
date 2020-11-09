import request from "./axios";
import store from '../store/index'

export declare interface Courses {
    id?: number, // 课程名
    name?: string, // 课程名
    institute?: string, //开课学院
    status?: number, //开课状态
    year?: number, //开课学年
    startTime?: Date, //开课时间
    description?: string, //简介
    scoringMethod?: string, //评分方式
    textbook?: string, // 教科书
}

export async function getAllCourses({ keyword='', start=0, limit=10 }) {
    const res = await request.get('/course/get', {
        params: {
            keyword, start, limit
        }
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error);
    return Promise.resolve(res.data)
}

export async function newCourses(courses:Courses, teachers:Array<string>) {
    const token = store.state.token;
    const res = await request.post('/course', {
        token,
        course: {
            ...courses,
            startTime: courses.startTime.toJSON()
        },
        teachers
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve(res.data.courseId)
}

export async function modifyCourses(courses:Courses, teachers:Array<string>) {
    const token = store.state.token;
    const res = await request.post('/course/update', {
        token,
        course: {
            ...courses,
            startTime: typeof courses.startTime == 'string' ? courses.startTime : courses.startTime.toJSON()
        },
        teachers
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve(res.data.courseId)
}
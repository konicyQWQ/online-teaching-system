import request from "./axios";
import store from "../store";
import { APIUrl } from "../type/setting";

interface CoursewareFile {
    id: number,
    name: string,
    size: string,
}

interface Courseware {
    id?: number,
    courseId: number,
    title: string,
    time: Date,
    description: string,
    privilege: number,
    fileList?: Array<number> | Array<CoursewareFile> // fileID的数组 增加，修改需要用, CoursewareFile的数组，get的时候需要用
}

// 上传课件使用
export const uploadCoursewareUrl = `${APIUrl}/upload/courseware`
export const uploadCoursewareName = 'formFiles'
export declare interface extraData {
    courseId: number,
    token: string
}

// 下载课件使用
export function downloadCoursewareUrl(coursewareId : number, fileId : number, mode:boolean = false) : string {
    const token = store.state.token
    return `${APIUrl}/upload/courseware?coursewareID=${coursewareId}&fileID=${fileId}&token=${token}&mode=${mode}`
}

// 课件的一套CRUD
export async function getAllCourseware({ courseId } : { courseId: number }) : Promise<Array<Courseware>> {
    const res = await request.get('/course/courseware/getall', {
        params: {
            courseId: courseId
        }
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve(res.data.coursewareList)
}

export async function addCourseware({ courseware } : { courseware: Courseware }) : Promise<string> {
    const token = store.state.token;
    if(typeof courseware.time === 'object')
        courseware.time = courseware.time.toJSON();
    const res = await request.post('/course/courseware', {
        courseware,
        fileList: courseware.fileList,
        token
    })
    if(!res.data.res)
        return Promise.reject(res.data.error)
    return Promise.resolve('上传成功')
}

export async function modifyCourseware({ courseware } : { courseware: Courseware }) : Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/courseware/update', {
        token,
        courseware,
        fileList: courseware.fileList
    })
    if(!res.data.res)
        return Promise.reject(res.data.error)
    return Promise.resolve('修改成功')
}

export async function deleteCourseware({ courseId, coursewareId } : { courseId:number , coursewareId: number }) : Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/courseware/delete', {
        token,
        coursewareId,
        courseId
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('删除成功')
}
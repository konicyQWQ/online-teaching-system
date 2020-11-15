import request from "./axios";
import store from "../store";
import {Courseware} from "../type/courseware";

// 课件的一套CRUD
export async function getAllCourseware({courseId}: { courseId: number }): Promise<Array<Courseware>> {
    const res = await request.get('/course/courseware/getall', {
        params: {
            courseId: courseId
        }
    })
    res.data.coursewareList = res.data.coursewareList.map(value => {
        return {
            ...value.courseware,
            fileList: value.files
        }
    })
    return res.data.coursewareList
}

export async function addCourseware({courseware}: { courseware: Courseware }): Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/courseware', {
        courseware,
        fileList: courseware.fileList,
        token
    })
    return ''
}

export async function modifyCourseware({courseware}: { courseware: Courseware }): Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/courseware/update', {
        token,
        courseware,
        fileList: courseware.fileList
    })
    return ''
}

export async function deleteCourseware({courseId, coursewareId}: { courseId: number, coursewareId: number }): Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/courseware/delete', {
        token,
        coursewareId,
        courseId
    })
    return ''
}
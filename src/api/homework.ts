import request from "./axios";
import store from "../store";

interface Homework {
    courseId: string,
    title: string,
    startTime: Date,
    endTime: Date,
    content: string,
    totalMark: number,
    percentage: number
}

export async function getHomework({ hwID }) {
    const token = store.state.token
    const res = await request.get('/homework', {
        params: {
            hwID,
            token
        }
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve(res.data.hWDetail)
}

export async function getAllHomework({ courseID }) {
    const token = store.state.token
    const res = await request.get('/homework/all', {
        params: {
            courseID,
            token
        }
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve(res.data.hWList)
}

export async function addNewHomework({ homework, files } : { homework: Homework, files: Array<number> } ) {
    const token = store.state.token
    const res = await request.post('/homework', {
        homework,
        files,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('新建成功')
}


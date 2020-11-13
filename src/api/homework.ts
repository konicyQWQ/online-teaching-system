import request from "./axios";
import store from "../store";

interface Homework {
    hwId: number,
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
    return Promise.resolve(res.data.hwDetail)
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
    return Promise.resolve(res.data.hwList)
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

export async function modifyHomework({ homework, files } : { homework: Homework, files: Array<number> } ) {
    const token = store.state.token
    const res = await request.post('/homework/update', {
        homework,
        files,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('修改成功')
}

export async function deleteHomework({ hwID } : { hwID:number} ) {
    const token = store.state.token
    const res = await request.post('/homework/remove', {
        hwID,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('删除成功')
}

interface userHomework {
    userId: number,
    hwId: number,
    description: string,
    mark: number,
    comment: string
}

export async function submitHomework({ userHomework, files } : { userHomework: userHomework, files: Array<number> } ) {
    const token = store.state.token
    const res = await request.post('/homework/submit', {
        homework : userHomework,
        files,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('提交成功')
}

export async function setScoreHomework({ stuID, hwID, score, comment }) {
    const token = store.state.token
    const res = await request.post('/homework/setScore', {
        stuID,
        hwID,
        score,
        comment,
        token
    })
    if(res.data.res === false)
        return Promise.reject(res.data.error)
    return Promise.resolve('批改成功')
}


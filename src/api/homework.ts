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
    return res.data.hwDetail
}

export async function getAllHomework({ courseID }) {
    const token = store.state.token
    const res = await request.get('/homework/all', {
        params: {
            courseID,
            token
        }
    })
    return res.data.hwList
}

export async function addNewHomework({ homework, files } : { homework: Homework, files: Array<number> } ) {
    const token = store.state.token
    const res = await request.post('/homework', {
        homework,
        files,
        token
    })
    return '新建成功'
}

export async function modifyHomework({ homework, files } : { homework: Homework, files: Array<number> } ) {
    const token = store.state.token
    const res = await request.post('/homework/update', {
        homework,
        files,
        token
    })
    return '修改成功'
}

export async function deleteHomework({ hwID } : { hwID:number} ) {
    const token = store.state.token
    const res = await request.post('/homework/remove', {
        hwID,
        token
    })
    return '删除成功'
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
    return '提交成功'
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
    return '批改成功'
}


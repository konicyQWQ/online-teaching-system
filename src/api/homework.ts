import request from "./axios";
import store from "../store";
import {Homework, HomeworkDetail, StudentHomeworkOverview, UserHomework} from "../type/homework";
import {APIUrl} from "../type/setting";
import {FileMode, FileModeToBool} from "../type/file";

/**
 * 获取hwID的作业详细信息
 * @param hwID
 */
export async function getHomework({hwID}): Promise<HomeworkDetail> {
    const token = store.state.token
    const res = await request.get('/homework', {
        params: {
            hwID,
            token
        }
    })
    return res.data.hwDetail
}

/**
 * 获得所有作业信息
 * @param courseID
 */
export async function getAllHomework({courseID}): Promise<Array<StudentHomeworkOverview>> {
    const token = store.state.token
    const res = await request.get('/homework/all', {
        params: {
            courseID,
            token
        }
    })
    return res.data.hwList
}

export async function addNewHomework({homework, files}: { homework: Homework, files: Array<number> }): Promise<string> {
    const token = store.state.token
    const res = await request.post('/homework', {
        homework,
        files,
        token
    })
    return ''
}

export async function modifyHomework({homework, files}: { homework: Homework, files: Array<number> }): Promise<string> {
    const token = store.state.token
    const res = await request.post('/homework/update', {
        homework,
        files,
        token
    })
    return ''
}

export async function deleteHomework({hwID}: { hwID: number }) : Promise<string> {
    const token = store.state.token
    const res = await request.post('/homework/remove', {
        hwID,
        token
    })
    return ''
}

export async function submitHomework({userHomework, files}: { userHomework: UserHomework, files: Array<number> }): Promise<string> {
    const token = store.state.token
    const res = await request.post('/homework/submit', {
        homework: userHomework,
        files,
        token
    })
    return ''
}

export async function setScoreHomework({stuID, hwID, score, comment}): Promise<string> {
    const token = store.state.token
    const res = await request.post('/homework/setScore', {
        stuID,
        hwID,
        score,
        comment,
        token
    })
    return ''
}

export function exportHomework({hwID}) {
    const token = store.state.token
    window.open(`${APIUrl}/homework/export?hwID=${hwID}&mode=${FileModeToBool(FileMode.download)}&token=${token}`);
}

export function exportAllHomework({courseID}) {
    const token = store.state.token
    window.open(`${APIUrl}/homework/exportAll?courseID=${courseID}&mode=${FileModeToBool(FileMode.download)}&token=${token}`);
}

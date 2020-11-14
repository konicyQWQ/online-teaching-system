import request from "./axios";
import store from "../store";

export declare interface Bulletin {
    bulletinId?: number,
    courseId: number,
    time: string,
    title: string,
    content: string
}

async function getBulletin({ courseID }):Promise<Array<Bulletin>> {
    const res = await request.get('/course/bulletin',{params: {courseID}});
    return res.data.list;
}

async function deleteBulletin({ bulletinID }):Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/bulletin/delete', { bulletinID, token });
    return '删除成功'
}

async function updateBulletin({ bulletin }):Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/bulletin/update', { bulletin, token });
    return '修改成功'
}

async function addBulletin({ bulletin }):Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/bulletin', { bulletin, token });
    return '增加成功'
}

export {
    getBulletin,
    addBulletin,
    updateBulletin,
    deleteBulletin
}
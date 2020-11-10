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
    if(res.data.res === false)
        return Promise.reject(res.data.error);
    return Promise.resolve(res.data.list);
}

async function deleteBulletin({ bulletinID }):Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/bulletin/delete', { bulletinID, token });
    if(res.data.res === false)
        return Promise.reject(res.data.error);
    return Promise.resolve('删除成功');
}

async function updateBulletin({ bulletin }):Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/bulletin/update', { bulletin, token });
    if(res.data.res === false)
        return Promise.reject(res.data.error);
    return Promise.resolve('修改成功');
}

async function addBulletin({ bulletin }):Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/bulletin', { bulletin, token });
    if(res.data.res === false)
        return Promise.reject(res.data.error);
    return Promise.resolve('增加成功');
}

export {
    getBulletin,
    addBulletin,
    updateBulletin,
    deleteBulletin
}
import request from "./axios";
import store from "../store";
import {Bulletin} from "../type/bulletin";

async function getBulletin({courseID}): Promise<Array<Bulletin>> {
    const res = await request.get('/course/bulletin', {params: {courseID}});
    return res.data.list;
}

async function deleteBulletin({bulletinID}): Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/bulletin/delete', {bulletinID, token});
    return ''
}

async function updateBulletin({bulletin}: { bulletin: Bulletin }): Promise<string> {
    const token = store.state.token;
    const res = await request.post('/course/bulletin/update', {bulletin, token});
    return ''
}

async function addBulletin({bulletin}: { bulletin: Bulletin }): Promise<string> {
    const token = store.state.token
    const res = await request.post('/course/bulletin', {bulletin, token});
    return ''
}

export {
    getBulletin,
    addBulletin,
    updateBulletin,
    deleteBulletin
}
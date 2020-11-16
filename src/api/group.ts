import store from "../store";
import request from "./axios";
import {GroupInfo} from "../type/group";

async function createGroup(courseID, groupCount, maxCount) {
    const token = store.state.token
    const res = await request.post('course/group', {
        courseID,
        groupCount,
        maxCount,
        token
    })
    return ''
}

async function addGroup(courseID, groupID) {
    const token = store.state.token
    const res = await request.post('course/group/join', {
        courseID,
        groupID,
        token
    })
    return ''
}

async function removeGroup(courseID) {
    const token = store.state.token
    const res = await request.post('course/group/remove', {
        courseID,
        token
    })
    return ''
}

async function leaveGroup(courseID, groupID) {
    const token = store.state.token
    const res = await request.post('course/group/exit', {
        courseID,
        groupID,
        token
    })
    return ''
}

async function getGroup(courseID) : Promise<GroupInfo[]> {
    const token = store.state.token
    const res = await request.get('/course/group', {
        params: {
            token,
            courseID
        }
    })
    return res.data.groupList
}

export {
    getGroup,
    addGroup,
    removeGroup,
    createGroup,
    leaveGroup
}

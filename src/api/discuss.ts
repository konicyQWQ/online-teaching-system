import request from "./axios";
import store from "../store";
import {User} from "../type/user";

interface Discuss {
    discussionId: number,
    courseId: number,
    title: string,
    creatorID: number,
    description: string,
    createTime: Date
}

interface UserDiscussion {
    discussionId: number,
    level: number, // 楼层
    userId: number,
    content: string,
    submitTime: Date
}

interface UserDiscussionWithUserInfo {
    userInfo: User,
    userDiscussion: UserDiscussion
}

interface DiscussDetail {
    discussion: {
        creatorInfo: User,
        discussion: Discuss
    },
    UserDiscussionList: UserDiscussionWithUserInfo[]
}

/**
 * 创建帖子，成功返回空字符串，失败会以error的形式被抛出
 * @param courseId 课程ID
 * @param title    帖子标题
 * @param creatorID 发帖人ID
 * @param description 帖子简介
 */
async function createDiscuss({ courseId, title, creatorID, description } : Discuss) {
    const token = store.state.token
    const res = await request.post('/course/discussion', {
        discuss: {
            courseId,
            title,
            creatorID,
            description,
        },
        token
    })
    return ''
}

/**
 * 传入课程ID，返回课程所有帖子的数组
 * @param courseID
 */
async function getDiscussion(courseID: number) : Promise<Discuss[]> {
    const res = await request.get('/course/discussion', {
        params: {
            courseID
        }
    })
    return res.data.discussionList;
}

/**
 * 传入帖子ID，返回帖子信息和所有回帖信息
 * @param disID
 */
async function getDiscussDetail(disID: number) : Promise<DiscussDetail> {
    const res = await request.get('/course/discussion', {
        params: {
            disID
        }
    })
    return res.data.discussionDetail;
}

/**
 * 回帖，成功返回空字符串
 * @param userId 回帖人ID
 * @param content 回帖人内容
 */
async function submitDiscuss({ userId, content }) {
    const token = store.state.token
    const res = await request.post('/course/discussion/submit', {
        token,
        userDiscussion: {
            userId,
            content
        }
    })
    return ''
}

/**
 * 更新帖子信息（不是更新楼层内容）, 成功返回空字符串
 * @param discussionId 帖子ID
 * @param title 新的标题
 * @param description 新的简介
 */
async function updateDiscuss({ discussionId, title, description } : Discuss) {
    const token = store.state.token
    const res = await request.post('/course/discussion/update', {
        token,
        discussion: {
            discussionId,
            title,
            description
        }
    })
    return ''
}

/**
 * 删除整个帖子, 成功返回空字符串
 * @param disID 帖子的ID
 */
async function removeDiscuss({ disID }) {
    const token = store.state.token
    const res = await request.post('/course/discussion/remove', {
        token,
        disID
    })
    return ''
}

/**
 * 删除帖子的某一楼, 成功返回空字符串
 * @param disID 帖子ID
 * @param level 第几楼
 */
async function withdrawDiscuss({ disID, level }) {
    const token = store.state.token
    const res = await request.post('/course/discussion/withdraw', {
        token,
        disID,
        level
    })
    return ''
}
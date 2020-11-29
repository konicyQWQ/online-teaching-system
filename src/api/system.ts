import request from "./axios";
import store from "../store";
import {User} from "../type/user";

export async function addSystemAnnouncement(title, content) {
    const res = await request.post('system', {
        token: store.state.token,
        title,
        content
    })
    return ''
}

export async function removeSystemAnnouncement(id) {
    const res = await request.post('system/remove', {
        token: store.state.token,
        id
    })
    return ''
}

export async function updateSystemAnnouncement(id, title, content) {
    const res = await request.post('system/update', {
        token: store.state.token,
        title,
        content,
        id
    })
    return ''
}

export enum EventType {
    SystemMessage = 0,
    CourseAnnouncement = 1,
    DiscussionCreated = 2,
    CoursewareUploaded = 3,
    HomeworkCreated = 4,
    HomeworkOpen = 5,
    HomeworkNearDDL = 6,
    ExamCreated = 7,
    ExamOpen = 8,
    HomeworkGraded = 9,
    ExamGraded = 10
}

interface Event {
    eventID: number,
    eventType: EventType,
    ///     0: SystemMessage-> content: { title, content } !with relatedUser!x
    ///     1: CourseAnnouncement-> content: { id, title } !with relatedUser!x
    ///     2: DiscussionCreated-> content: { id, title } !with relatedUser!x
    ///     3: CoursewareUploaded-> content: { id, title } !with relatedUser!x
    ///     4: HomeworkCreated-> content: { id, title } !with relatedUser!x
    ///     5: HomeworkOpen-> content: { id, title }x
    ///     6: HomeworkNearDDL-> content: { id, title }x
    ///     7: ExamCreated-> content: { id, title } !with relatedUser!x
    ///     8: ExamOpen-> content: { id, title }
    ///     9: HomeworkGraded-> content: { id, title, score } !with relatedUser!x
    ///     10: ExamGraded-> content: { id, title, score } !with relatedUser!
    content: '',
    courseID: number,
    courseName: string,
    relatedUser: string,
    time: Date
}

interface EventList {
    totalCount: number,
    eventList: Event[]
}

export async function getSystemAnnouncement(start, limit) : Promise<EventList> {
    const res = await request.get('system', {
        params: {
            start,
            limit
        }
    })
    return res.data.list;
}

export async function getAllEvent(start, limit) : Promise<EventList> {
    const res = await request.get('system/user', {
        params: {
            start,
            limit,
            token: store.state.token
        }
    })
    return {
        totalCount: res.data.eventList.totalCount,
        eventList: res.data.eventList.eventList.map((value) => {
            return {
                ...value,
                content: JSON.parse(value.content)
            }
        })
    }
}
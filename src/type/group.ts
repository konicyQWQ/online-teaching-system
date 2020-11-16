import {Field} from "./form";
import {User} from "./user";
import {reactive} from 'vue'
import {getGroup} from "../api/group";
import {message} from "ant-design-vue";

enum GroupIdentity { member, leader }

export declare interface UserGroup {
    courseId: number,
    groupId: number,
    userId: number,
    identity: GroupIdentity
}

export declare interface GroupMemberInfo {
    userInfo: User,
    userGroup: UserGroup
}

export declare interface CourseGroup {
    groupId: number,
    courseId: number,
    maxCount: number
}

export declare interface GroupInfo {
    courseGroup: CourseGroup,
    groupMemberCount: number,
    members: GroupMemberInfo[]
}

export declare interface AllGroup {
    groupID: number,
    leader: User,
    member: User[]
}

export const GroupCountField: Field = {
    label: '组数',
    type: "number",
    min: 0,
    max: 100,
    rule: {
        validator: async (rule, value) => {
            if (value == 0)
                return Promise.reject('组数不能为0')
            return Promise.resolve('')
        },
        trigger: "blur"
    }
}

export const MaxCountField: Field = {
    label: '每组人数上限',
    type: "number",
    min: 0,
    max: 25,
    rule: {
        validator: async (rule, value) => {
            if (value == 0)
                return Promise.reject('组数不能为0')
            return Promise.resolve('')
        },
        trigger: "blur"
    }
}

export function useGroup(courseID) {
    const state = reactive({
        data: [],
        loading: ''
    } as {
        data: AllGroup[],
        loading: boolean
    })

    function preload(groupInfo: GroupInfo[]) {
        let data = []
        groupInfo.forEach((value) => {
            let group: AllGroup = {}
            group.groupID = value.courseGroup.groupId;
            if(value.groupMemberCount !== 0) {
                group.leader = value.members.filter(value => value.userGroup.identity===GroupIdentity.leader)[0].userInfo
                group.member = value.members.filter(value => value.userGroup.identity===GroupIdentity.member).map(value => value.userInfo)
            } else {
                group.leader = {}
                group.member = []
            }
            data.push(group)
        })
        return data
    }

    function fetchData() {
        state.loading = true
        getGroup(courseID)
            .then(res => {
                state.data = preload(res)
                state.loading = false
            })
            .catch(e => {
                message.error(e)
            })
    }

    return {
        state,
        fetchData
    }
}
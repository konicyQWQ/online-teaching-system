import {reactive} from 'vue'
import {newGetUserInfo} from "../api/user";
import {message} from "ant-design-vue";
import {CourseWithTeachers} from "../type/course";
import {User} from "../type/user";

interface MyCoursesState {
    state: {
        data: {
            userInfo: User,
            courseList: Array<CourseWithTeachers>
        },
        loading: boolean
    },
    fetchData: () => Promise<string|void>
}

export function useUserWithCourses(userID?: string): MyCoursesState {
    const state = reactive({
        data: {
            userInfo: null,
            courseList: []
        },
        loading: true
    })

    async function fetchData() {
        state.loading = true
        try {
            const res = await newGetUserInfo({userID})
            state.data.userInfo = res.userInfo;
            state.data.courseList = res.courseList.teachList.concat(res.courseList.courseList).concat(res.courseList.assistList);
            state.loading = false
        } catch (e) {
            message.error(e)
        }
    }

    fetchData();

    return {
        state,
        fetchData
    }
}
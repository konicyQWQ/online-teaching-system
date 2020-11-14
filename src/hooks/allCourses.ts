import {reactive} from 'vue'
import {getAllCourses, SearchCourseParams} from "../api/courses";
import {message} from "ant-design-vue";
import {CourseWithTeachers} from "../type/course";

interface useAllCourses {
    state: {
        data: Array<CourseWithTeachers>,
        totalCount: number,
        loading: boolean
    },
    fetchData: (searchParams?:SearchCourseParams) => Promise<string|void>
}

export function useAllCoursesState(): useAllCourses {
    const state = reactive({
        data: [],
        totalCount: 0,
        loading: true
    })

    async function fetchData({keyword = '', start = 0, limit = 1000}:SearchCourseParams) {
        state.loading = true
        try {
            const res = await getAllCourses({ keyword, start, limit })
            state.data = res.resList
            state.totalCount = res.totalCount
            state.loading = false
        } catch (e) {
            message.error(e)
        }
    }

    fetchData({})

    return {
        state,
        fetchData
    }
}
import { getCourseUser } from "../api/courses";
import { reactive } from 'vue'
import {message} from "ant-design-vue";

export function useCourseUser(courseID) {
    const state = reactive({
        data: [],
        loading: false
    })

    function fetchData() {
        state.loading = true
        getCourseUser({ courseID })
            .then(res => {
                state.data = res
                state.loading = false
            })
            .catch(e => {
                message.error(e)
            })
    }

    fetchData()

    return {
        state,
        fetchData
    }
}
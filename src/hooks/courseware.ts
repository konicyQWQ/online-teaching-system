import { reactive } from 'vue'
import { getAllCourseware } from "../api/courseware";
import { message } from "ant-design-vue";

export function useCourseware(cid : number) {
    const state = reactive({
        loading: true,
        coursewares: []
    })

    function fetchCourseware() {
        state.loading = true
        getAllCourseware({ courseId: cid })
            .then(res => {
                state.coursewares = res
                state.loading = false
            })
            .catch(e => {
                message.error(e);
            })
    }

    fetchCourseware();

    return {
        state,
        fetchCourseware
    }
}
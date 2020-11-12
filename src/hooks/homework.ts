import { getAllHomework } from "../api/homework";
import { reactive } from 'vue'
import { message } from "ant-design-vue";

export function useHomework(courseID) {
    const state = reactive({
        data: [],
        loading: false
    })

    function fetchData() {
        state.loading = true
        getAllHomework({ courseID })
            .then(res => {
                state.loading = false
                state.data = res
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
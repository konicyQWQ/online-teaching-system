import {reactive} from 'vue'
import {message} from "ant-design-vue";
import {getAllUser} from "../api/user";

export function useAllUser() {
    const state = reactive({
        loading: false,
        data: [],
        total: 0
    })

    function fetchData({start, limit, keyword, roles}) {
        state.loading = true
        getAllUser({start, limit, keyword, roles})
            .then(res => {
                state.loading = false
                state.total = res.total
                state.data = res.data
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
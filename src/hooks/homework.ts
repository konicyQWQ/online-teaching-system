import {getAllHomework, getHomework} from "../api/homework";
import {reactive} from 'vue'
import {message} from "ant-design-vue";

const allHomeworkPool = {}

export function useAllHomework(courseID) {
    // 如果有缓存
    if (allHomeworkPool[courseID]) {
        allHomeworkPool[courseID].fetchData()
        return allHomeworkPool[courseID]
    }

    const state = reactive({
        data: [],
        loading: false
    })

    function fetchData() {
        state.loading = true
        getAllHomework({courseID})
            .then(res => {
                state.loading = false
                state.data = res
            })
            .catch(e => {
                message.error(e)
            })
    }

    fetchData()

    allHomeworkPool[courseID] = {
        state,
        fetchData
    }

    return {
        state,
        fetchData
    }
}

// 下面这个做缓存处理，同时也解决组件之间无法靠inject，provide同步修改的问题
const pool = {}


export function useHomework(hwID) {
    // 如果有缓存
    if (pool[hwID]) {
        pool[hwID].fetchData()
        return pool[hwID]
    }

    // 没有缓存，重新生成
    const state = reactive({
        data: {
            homework: {
                homework: {}
            },
            userHomework: {
                userInfo: {},
                userHomework: {},
                files: {}
            }
        },
        loading: false
    })

    function fetchData() {
        state.loading = true
        getHomework({hwID})
            .then(res => {
                state.loading = false
                state.data = res
            })
            .catch(e => {
                message.error(e)
            })
    }

    fetchData()

    pool[hwID] = {
        state,
        fetchData
    }

    return {
        state,
        fetchData
    }
}
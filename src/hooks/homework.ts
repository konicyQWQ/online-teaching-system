import {getAllHomework, getHomework} from "../api/homework";
import {reactive} from 'vue'
import {message} from "ant-design-vue";
import {HomeworkDetail, StudentHomeworkOverview} from "../type/homework";

// 下面这个做缓存处理，同时也解决组件之间无法靠inject，provide同步修改的问题
interface AllHomeworkState {
    state: {
        loading: boolean,
        data: StudentHomeworkOverview[]
    },
    fetchData: () => void
}

const allHomeworkPool = {}
export function useAllHomework(courseID): AllHomeworkState {
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

interface HomeworkState {
    state: HomeworkState_State
    fetchData: ()=>void
}

export declare interface HomeworkState_State {
    data: HomeworkDetail,
    loading: false
}

const pool = {}
export function useHomework(hwID):HomeworkState {
    // 如果有缓存
    if (pool[hwID]) {
        pool[hwID].fetchData()
        return pool[hwID]
    }

    // 没有缓存，重新生成
    const state = reactive({
        data: {
            homework: {
                homework: {},
                files: {}
            },
            userHomework: {

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
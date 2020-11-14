import {getUserInfo} from "../api/user";
import store from "../store";
import {reactive} from 'vue'
import {message} from "ant-design-vue";
import {User} from "../type/user";

/**
 * 本文件有一些缺陷，只能获得自己的用户信息数据
 * 但由于开发原因，仍然保留。请使用新的hook，userWithCourses.ts
 */

interface UserInfoState {
    state: {
        data: User,
        loading: boolean
    },
    fetchData: () => Promise<string|void>
}

export function useUserInfo() : UserInfoState {
    const state = reactive({
        data: null,
        loading: true
    })

    async function fetchData() {
        state.loading = true
        try {
            state.data = await getUserInfo(store.state.token)
            state.loading = false
        } catch (e) {
            message.error(e)
        }
    }

    fetchData()

    return {
        state,
        fetchData
    }
}
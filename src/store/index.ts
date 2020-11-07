import { createStore } from "vuex";
import { Role } from "../type";
import { getUserInfo } from "../api/user";

interface loginInfo {
    token?: string | null,
    avatarId?: string | null,
    role?: Role,
    remember?: boolean
}

const store = createStore({
    state: {
        token: null,
        avatarId: null,
        role: Role.guest
    },
    mutations: {
        init(state) {
            state.token = localStorage.getItem('token')
            if(state.token === 'null')
                state.token = null
            state.role = parseInt(localStorage.getItem('role'))
        },
        saveLoginInfo(state, { token, role, avatarId, remember }:loginInfo) {
            state.token = token
            state.role = role
            state.avatarId = avatarId
            if(remember) {
                window.localStorage.setItem('token', token)
                window.localStorage.setItem('role', role.toString())
            }
        },
        logout(state) {
            state.token = null
            state.role = Role.guest
            state.avatarId = null
            window.localStorage.setItem('token', '')
            window.localStorage.setItem('role', Role.guest.toString())
        }
    },
    actions: {
        async loginByToken(context, { token = null, remember }) {
            token = token || context.state.token
            if(token) {
                try {
                    const userInfo = await getUserInfo(token)
                    context.commit('saveLoginInfo', {
                        token,
                        remember,
                        ...userInfo
                    })
                    return Promise.resolve()
                } catch (e) {
                    return Promise.reject(e)
                }
            } else {
                context.commit('logout')
                return Promise.reject('')
            }
        }
    }
})

export default store;
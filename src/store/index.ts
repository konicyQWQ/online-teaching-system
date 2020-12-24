import { createStore } from "vuex";
import { getUserInfo } from "../api/user";
import { Role } from "../type/user";

interface loginInfo {
    token?: string | null,
    avatarId?: string | null,
    name: string | null,
    role?: Role,
    remember?: boolean,
    id?: string
}

const store = createStore({
    state: {
        token: null,
        avatarId: null,
        name: null,
        role: Role.guest,
        id: null
    },
    mutations: {
        init(state) {
            state.token = localStorage.getItem('token')
            if(state.token === 'null')
                state.token = null
            state.role = parseInt(localStorage.getItem('role'))
        },
        saveLoginInfo(state, { token, role, avatarId, name, remember, id }:loginInfo) {
            state.token = token
            state.role = role
            state.avatarId = avatarId
            state.name = name
            state.id = id
            if(remember) {
                window.localStorage.setItem('token', token)
                if(role)
                    window.localStorage.setItem('role', role.toString())
            }
        },
        logout(state) {
            state.token = null
            state.role = Role.guest
            state.avatarId = null
            state.name = null
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
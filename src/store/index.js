import { createStore } from 'vuex'

const store = createStore({
    state: {
        token: '',
        userName: '',
        userAvatar: '',
        userIdentity: ''
    },
    mutations: {
        loginStateChange(state, { token, userName, userAvatar, userIdentity }) {

        }
    }
})

export default store
import { createStore } from 'vuex'

const store = createStore({
    state: {
        token: '',
        username: '',
        userAvatar: '',
        userIdentity: ''
    },
    mutations: {
        loginStateChange(state, { token, username, userAvatar, userIdentity }) {

        }
    }
})

export default store
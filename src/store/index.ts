import { createStore } from 'vuex'
import request from '../axios/index.js'
import { User } from "../js/type";

const store = createStore({
  state: {
    token: '',
    user: {}
  },
  mutations: {
    saveToken: (state, { token, remember = false }) => {
      state.token = token
      if(remember)
        window.localStorage.setItem('token', token)
    },
    saveUser: (state, user:User) => state.user = user
  },
  actions: {
    getUserInfo: async ({ commit, state }) => {
      try {
        const res = await request.get('/authentication/user', {
          params: {
            token: state.token
          }
        })
        commit('saveUser', res.data);
      } catch (e) {

      }
    }
  }
})

export default store
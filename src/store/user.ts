/* eslint-disable */
import Config from '../config/config'

export default {
  state: {
    currentUser:
      localStorage.getItem(Config.localStorageKeys.userData) !== null ? JSON.parse(<string>localStorage.getItem(Config.localStorageKeys.userData)) : null,
    loginError: null,
    processing: false
  },
  mutations: {
    setUser (state: { currentUser: any; processing: boolean; loginError: null; }, payload: any) {
      console.log('test', state, payload);
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout (state: { currentUser: null; processing: boolean; loginError: null; }) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing (state: { processing: any; loginError: null; }, payload: any) {
      state.processing = payload
      state.loginError = null
    },
    setError (state: { loginError: any; currentUser: null; processing: boolean; }, payload: any) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    clearError (state: { loginError: null; }) {
      state.loginError = null
    }
  },
  actions: {
  },
  modules: {
  }
};

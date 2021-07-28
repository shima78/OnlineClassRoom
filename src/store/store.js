import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        server: null,
        userDataArray: [],
        questionArray: [],
        username: null,
        roomId: null,
        role: null,
        userID :null,
        currentAnswerArray:[],

    },mutations: {
        setQuestion(state,payload){
            state.questionArray = new Array(payload);
        },
        setServer(state,payload){
            state.server = payload;
        },
        setRoomID(state,payload){
            state.roomId = payload;
        },
        setRole(state,payload){
            state.role = payload;
        },
        setUsername(state,payload){
            state.username = payload;
        },
        setUserID(state,payload){
            state.userID = payload;
        },
        setUsersData(state,payload){
            state.userDataArray = new Array(payload);
        },
        pushQuestion(state,payload){
            state.questionArray.push(payload);
        },
        setCurrentAnswerArray(state,payload){
            state.currentAnswerArray = new Array(payload);
        }

    },
    getters:{
        getUserData: state => {
            return state.userDataArray;
        },
        getServer: state => {
            return state.server;
        },
        getRoomID: state => {
            return state.roomId;
        },
        getRole: state => {
            return state.role;
        },
        getUsername: state => {
            return state.username;
        },
        getUserID: state => {
            return state.userID;
        },
        getQuestionArray : state => {
            return state.questionArray;
        },
        getAnswerAllArray : state => {
            return state.currentAnswerArray;
        },
        getCurrentAnswerArray : state => {
            return state.currentAnswerArray;
        }


    },
    actions:{
        // eslint-disable-next-line no-unused-vars
        updateUsersData({ commit },payload){
           commit('setUsersData',payload);
           //console.log('action happening',payload)
        },
        updateQuestionData({ commit },payload){
            commit('setQuestion',payload);
        },


        addQuestion({commit} ,payload){
            commit('pushQuestion',payload);
        },
        // eslint-disable-next-line no-unused-vars
        updateCurrentAnswers({commit},payload){
            commit('setCurrentAnswerArray',payload);
        },
        updateRole({commit},payload){
            commit('setRole',payload)
        }


    }

})
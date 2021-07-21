import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import App from "@/App";
import vuescroll from 'vuescroll';
import VSwatches from 'vue-swatches';

// Import the styles too, typically in App.vue or main.js
import 'vue-swatches/dist/vue-swatches.css'
import Vuex from 'vuex'

Vue.use(Vuex);
Vue.use(VSwatches);
Vue.use(VueRouter);
Vue.use(vuescroll, {
  ops: {
    rail:{
      background: "rgba(0,0,0,0)",
      opacity:0,
      size:"0px",
      border:"0px solid #000"
    },
    bar:{
      background: "rgba(0,0,0,0)",
      size: "0px"
    },
    scrollPanel:{
      speed: 50
    }


  },

});



// eslint-disable-next-line no-unused-vars
export const store = new Vuex.Store({
  state: {
    server: null,
    userDataArray: new Array(),
    questionArray: new Array(),
    username: null,
    roomId: null,
    role: null,
    userID :null
  },
  mutations: {
    addQuestion(state,payload){
      state.questionArray.push(payload)
    },
    updateUsers(state,payload){
      state.userDataArray = payload;
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
    }


  }
})


Vue.component('loading',{ template: '<div><H6>Loading!</H6>></div>'})

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Meeting',
    name: 'Meeting',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Meeting.vue'),
    beforeEnter: (to,from,next) =>{
      if(to.params.isPush){
        next()
      }
      else{
        next(false)
        location.reload();
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  App.loading = true
  next()
})

router.afterEach(() => {
  setTimeout(() => App.loading = false, 1500) // timeout for demo purposes
})



export default router

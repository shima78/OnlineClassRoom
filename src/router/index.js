import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import App from "@/App";
import vuescroll from 'vuescroll';
import VSwatches from 'vue-swatches';

// Import the styles too, typically in App.vue or main.js
import 'vue-swatches/dist/vue-swatches.css'


import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

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

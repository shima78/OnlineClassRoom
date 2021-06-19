import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import App from "@/App";


Vue.use(VueRouter);
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
    component: () => import('../views/Meeting.vue')
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

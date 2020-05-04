import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/dashboard/dashboard.vue'
import SignUp from '../views/sign-up/sign-up.vue'
import Login from '../views/login/login.vue'
import NotFound from '../views/not-found/not-found.vue'
import UserVerification from '../views/verify-user/verify-user.vue'
import { UtilityService } from "@/services/utility.service";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      auth: true
    },
    children: [
      {
        path: '/',
        name: 'Chat',
        component: () => import('../views/chat/chat.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/user-profile/user-profile.vue')
      }
    ]
  },
  {
    path: '/verify-user',
    name: 'UserVerification',
    component: UserVerification
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    // will match everything
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !UtilityService.getUserData()) {
    router.push({path: '/'})
  } else {
    next();
  }
});

export default router

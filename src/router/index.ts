import Vue from 'vue'
import VueRouter from 'vue-router'
import { UtilityService } from "@/services/utility.service";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login/login.vue'),
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('../views/sign-up/sign-up.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/dashboard/dashboard.vue'),
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
    component: () => import('../views/verify-user/verify-user.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/about/about.vue')
  },
  {
    // will match everything
    path: '*',
    name: 'NotFound',
    component: () => import('../views/not-found/not-found.vue')
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

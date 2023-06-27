import { createRouter, createWebHistory } from 'vue-router'

// Composables
import ls from '@/core/LocalStorage';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },

      {
        path: '/terminals',
        name: 'Terminals',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Terminals.vue'),
      },

      {
        path: '/terminals/:id/logs',
        name: 'Logs',
        props: true,
        component: () => import(/* webpackChunkName: "home" */ '@/views/Logs.vue'),
      },

      {
        path: '/stadistics',
        name: 'Estadísticas',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Stadistics.vue'),
      },
    ],
  },


  {
    path: '/let-me-in',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})



router.beforeEach((to, from, next) => {
  const isAuthenticated = ls.get('auth');
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})

export default router

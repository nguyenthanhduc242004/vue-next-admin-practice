import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/system/menu',
      name: 'menu',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MenuView.vue'),
    },
    {
      path: '/system/system-2',
      name: 'system-2',
      component: HomeView,
    },
    {
      path: '/system/system-3',
      name: 'system-3',
      component: HomeView,
    },
  ],
});

export default router;

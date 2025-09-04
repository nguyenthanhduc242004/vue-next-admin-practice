import { createRouter, createWebHistory, useRouter } from 'vue-router';
import pages from '../layout/pages';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeIcons(pages: any[]) {
    return pages.map((page) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { icon, ...restOfPage } = page;

        const newPage = { ...restOfPage };

        if (page.children && Array.isArray(page.children)) {
            newPage.children = removeIcons(page.children);
        }

        return newPage;
    });
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    // routes: [
    //   {
    //     path: '/',
    //     name: 'home',
    //     component: HomeView,
    //   },
    //   {
    //     path: '/system/area',
    //     name: 'area',
    //     // route level code-splitting
    //     // this generates a separate chunk (About.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import('../views/AreaView.vue'),
    //   },
    //   {
    //     path: '/system/system-2',
    //     name: 'system-2',
    //     component: HomeView,
    //   },
    //   {
    //     path: '/system/system-3',
    //     name: 'system-3',
    //     component: HomeView,
    //   },
    // ],
    routes: [...removeIcons(pages)],
});

export default router;

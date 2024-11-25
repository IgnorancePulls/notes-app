import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import EditNotePage from '@/pages/EditNotePage.vue';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/note/:id',
        name: 'EditNotePage',
        component: EditNotePage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
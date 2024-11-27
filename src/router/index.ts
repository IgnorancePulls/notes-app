import { createRouter, createWebHistory } from 'vue-router';
import NotesList from '@/pages/NotesList.vue';
import EditNotePage from '@/pages/EditNotePage.vue';
import NotFound from "@/pages/NotFound.vue";

const routes = [
    {
        path: '/',
        name: 'NotesList',
        component: NotesList,
    },
    {
        path: '/note/:id',
        name: 'EditNotePage',
        component: EditNotePage,
    },
    {
        path: '/not-found',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
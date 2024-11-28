import { createRouter, createWebHistory } from 'vue-router';

import EditNotePage from '@/pages/EditNotePage.vue';
import NotesList from '@/pages/NotesList.vue';
import NotFound from '@/pages/NotFound.vue';

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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

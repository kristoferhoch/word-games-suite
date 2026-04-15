import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'scrabble', component: () => import('../games/scrabble/pages/IndexPage.vue') },
      { path: 'boggle', component: () => import('../games/boggle/pages/IndexPage.vue') },
      { path: 'wordle', component: () => import('../games/wordle/pages/IndexPage.vue') },
      { path: 'crossword', component: () => import('../games/crossword/pages/IndexPage.vue') },
      { path: 'word-connect', component: () => import('../games/word-connect/pages/IndexPage.vue') },
      { path: 'typing-race', component: () => import('../games/typing-race/pages/IndexPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

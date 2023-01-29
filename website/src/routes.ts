import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Landing.vue') },
  {
    path: '/docs',
    component: () => import('@/pages/Docs.vue'),
    children: [
      { path: 'why', component: () => import('@/pages/docs/vue/DocsWhy.vue') },
      { path: 'options', component: () => import('@/pages/docs/vue/DocsOptions.vue') },
      { path: 'install', component: () => import('@/pages/docs/vue/DocsInstall.vue') },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

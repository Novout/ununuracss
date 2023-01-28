import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Landing.vue') },
  {
    path: '/docs',
    component: () => import('@/pages/Docs.vue'),
    children: [
      { path: 'why', component: () => import('@/pages/docs/vue/DocsWhy.vue') },
      { path: 'atomic', component: () => import('@/pages/docs/vue/DocsAtomic.vue') },
      { path: 'scoped', component: () => import('@/pages/docs/vue/DocsScoped.vue') },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Landing.vue') },
  {
    path: '/docs',
    component: () => import('@/pages/Docs.vue'),
    children: [
      { path: 'why', component: () => import('@/pages/docs/vue/DocsWhy.vue') },
      { path: 'concepts', component: () => import('@/pages/docs/vue/DocsConcepts.vue') },
      { path: 'options', component: () => import('@/pages/docs/vue/DocsOptions.vue') },
      { path: 'install', component: () => import('@/pages/docs/vue/DocsInstall.vue') },
      { path: 'identifiers', component: () => import('@/pages/docs/vue/DocsIdentifiers.vue') },
      { path: 'supporters', component: () => import('@/pages/docs/vue/DocsSupporters.vue') },
      { path: 'globals', component: () => import('@/pages/docs/vue/DocsGlobals.vue') },
      { path: 'contexts', component: () => import('@/pages/docs/vue/DocsContexts.vue') },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

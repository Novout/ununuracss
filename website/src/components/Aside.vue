<template>
  <aside
    class="w:100% flex[col v-center gap-1.5rem] bg:rgba-0-0-0-0.1 filter[backdrop blur-16px] p:2rem shadow[v-5 h-0 blur-10 radius-1] lg(w:300px)"
  >
    <AsideLogo />
    <AsideCategory
      title="Ununura"
      :routes="[
        { to: '/docs/why', name: 'Why?' },
        { to: '/docs/atomic', name: 'Atomic CSS' },
        { to: '/docs/scoped', name: 'All-Scoped' },
      ]"
    />
    <AsideCategory
      title="Getting Started"
      :routes="[
        { to: '/docs/install', name: 'Installation' },
        { to: '/docs/options', name: 'Options' },
      ]"
    />
    <AsideCategory
      title="Contents"
      :routes="[
        { to: '/docs/identifiers', name: 'Identifiers', children: [{ to: '/docs/identifiers/text', name: 'Text' }] },
        { to: '/docs/resources', name: 'Resources' },
        { to: '/docs/contexts', name: 'Contexts' },
      ]"
    />
    <AsideCategory
      title="Adapters"
      :routes="[
        { to: '/docs/identifiers', name: 'Identifiers' },
        { to: '/docs/resources', name: 'Resources' },
      ]"
    />
  </aside>
</template>

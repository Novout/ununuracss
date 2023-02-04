<template>
  <aside
    class="w:100% flex[col v-center gap-1.5rem] z:9999 bg:rgba-0-0-0-0.1 filter[backdrop blur-16px] p:2rem shadow[v-5 h-0 blur-10 radius-1] lg(w:300px)">
    <AsideLogo />
    <AsideCategory title="Getting Started" :routes="[
      { to: '/docs/why', name: 'Why?' },
      { to: '/docs/concepts', name: 'Concepts' },
      { to: '/docs/install', name: 'Installation' },
      { to: '/docs/options', name: 'Options' },
    ]" />
    <AsideCategory title="Contents" :routes="[
      { to: '/docs/identifiers', name: 'Identifiers' },
      { to: '/docs/supporters', name: 'Supporters' },
      { to: '/docs/globals', name: 'Globals' },
      { to: '/docs/contexts', name: 'Contexts' },
    ]" />
  </aside>
</template>

<template>
  <aside
    class="w:100% flex[col v-center gap-1.5rem] bg:rgba-0-0-0-0.1 filter[backdrop blur-16px] p:2rem shadow[v-5 h-0 blur-10 radius-1] lg(w:300px)">
    <AsideLogo />
    <AsideCategory title="Getting Started" :routes="[
      { to: '/docs/why', name: 'Why?' },
      { to: '/docs/install', name: 'Installation' },
      { to: '/docs/options', name: 'Options' },
    ]" />
    <AsideCategory title="Contents" :routes="[
      { to: '/docs/identifiers', name: 'Identifiers', children: [{ to: '/docs/identifiers/text', name: 'Text' }] },
      { to: '/docs/contexts', name: 'Contexts' },
      { to: '/docs/supporters', name: 'Supporters' },
    ]" />
  </aside>
</template>

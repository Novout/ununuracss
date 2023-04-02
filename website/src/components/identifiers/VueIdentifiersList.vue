<template>
  <div class="flex[col gap-1rem] w:100% h[max 600px] scroll[y auto] text:#CCCCCC m[t 2rem]">
    <div
      @click="item.open = !item.open"
      class="flex[col gap-2rem wrap] style[cursor-pointer] w:100% rounded:0.5rem gradient[45deg rgba-255-255-255-0.025 0% rgba-255-255-255-0.1 100%] md(w:75%)"
      v-for="(item, lindex) in list"
      :key="lindex"
    >
      <h2 class="text[700 rubik white 1.15rem] p:1rem w:100%">
        <span
          v-for="(key, tindex) in item.keys"
          :key="tindex"
          class="text[700 rubik white 1rem] style[events-none select-none] m[l 1rem] bg:rgba-255-255-255-0.02 text:#CCCCCC p[0.5rem 1rem] rounded:0.5rem"
          >{{ key }}</span
        >
      </h2>
      <div v-if="item.open" class="flex[col gap-1rem wrap] w:90% md(w:100%)">
        <div
          class="text[quick 1.1rem 700] flex[row wrap v-center h-between gap-2rem] w:100% p:0.5rem"
          v-for="(resource, rindex) in item.resources"
          :key="rindex"
        >
          <p
            class="flex[? flex-1] p[0.5rem 1rem] typo:center text[! quick 1.1rem 700] gradient[45deg rgba-255-255-255-0.025 0% rgba-255-255-255-0.1 100%] rounded:0.25rem"
          >
            {{ resource.inCss }}:
          </p>
          <p class="flex[? flex-1] typo[start]">
            Supporter:
            <span class="text[! quick 1.1rem 700] p:0.25rem bg:rgba-255-255-255-0.05 rounded:0.25rem">{{
              Array.isArray(resource.supporter)
                ? resource.supporter.reduce((acc, sup) => (acc += ` ${sup}`), '')
                : resource.supporter
            }}</span>
          </p>
          <p class="flex[? flex-1] typo:start">
            Example:
            <span class="text[! quick 1.1rem 700] p:0.25rem bg:rgba-255-255-255-0.05 rounded:0.25rem">{{
              resource.example
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const list = ref([
  {
    open: false,
    keys: ['text', 'font'],
    resources: [
      { inCss: 'color', supporter: 'unique', example: 'text:red' },
      { inCss: 'font-family', supporter: 'fontFamily', example: 'text:arial' },
      { inCss: 'font-size', supporter: 'fontSize', example: 'text:2rem' },
      { inCss: 'font-weight', supporter: 'fontWeight', example: 'text:600' },
      { inCss: '-webkit-text-fill-color', supporter: 'color', example: 'text:fill-black' },
      { inCss: '-webkit-text-stroke-color', supporter: 'color', example: 'text:stroke-color-red' },
      { inCss: '-webkit-text-stroke-width', supporter: 'unit', example: 'text:stroke-width-2px' },
    ],
  },
  {
    open: false,
    keys: ['w', 'h', 'width', 'height'],
    resources: [
      { inCss: 'width|height', supporter: 'unit', example: 'w:100%' },
      { inCss: 'min-height|width', supporter: 'unique', example: 'h[min 100vh]' },
      { inCss: 'max-height|width', supporter: 'unique', example: 'w[max 500px]' },
    ],
  },
  {
    open: false,
    keys: ['p', 'm', 'padding', 'margin'],
    resources: [
      { inCss: 'padding|margin', supporter: 'spread', example: 'p[1rem 2rem 0.5rem 1rem]' },
      { inCss: 'left|bottom|top|right', supporter: 'direction', example: 'margin[left 2rem]' },
    ],
  },
  {
    open: false,
    keys: ['f', 'flex'],
    defaults: 'display: flex;',
    resources: [
      {
        inCss: 'flex-direction',
        supporter: ['row', 'col', 'row-reverse', 'col-reverse'],
        example: 'flex:row',
      },
      {
        inCss: 'flex-grow',
        supporter: ['grow', 'grow-none'],
        example: 'flex:grow',
      },
      {
        inCss: 'flex-wrap',
        supporter: ['wrap', 'nowrap', 'wrap-reverse'],
        example: 'flex[col wrap]',
      },
      {
        inCss: 'flex',
        supporter: ['1', '0'],
        example: 'flex[? flex-1]',
      },
      {
        inCss: 'gap',
        supporter: 'in-start',
        example: 'flex:gap-2rem',
      },
      {
        inCss: 'justify-content',
        supporter: ['start', 'end', 'center', 'between', 'around', 'evenly'],
        example: 'flex[jc-center]',
      },
      {
        inCss: 'justify-align',
        supporter: ['stretch', 'start', 'end', 'center'],
        example: 'flex[ja-center]',
      },
      {
        inCss: 'justify-self',
        supporter: ['auto', 'stretch', 'start', 'end', 'center'],
        example: 'flex[js-center]',
      },
      {
        inCss: 'align-items',
        supporter: ['start', 'end', 'center', 'stretch'],
        example: 'flex[ai-end]',
      },
      {
        inCss: 'align-content',
        supporter: ['start', 'end', 'center', 'between', 'around', 'evenly'],
        example: 'flex[ac-end]',
      },
      {
        inCss: 'align-self',
        supporter: ['auto', 'stretch', 'start', 'end', 'center'],
        example: 'flex[as-end]',
      },
      {
        inCss: 'flex-shrink',
        supporter: 'in-start',
        example: 'shrink-1',
      },
    ],
  },
  {
    open: false,
    keys: ['g', 'grid'],
    defaults: 'display: grid;',
    resources: [
      {
        inCss: 'grid-template-columns',
        supporter: 'in-start',
        example: 'grid[cols-3]',
      },
      {
        inCss: 'grid-template-rows',
        supporter: 'in-start',
        example: 'grid[rows-3]',
      },
      {
        inCss: 'grid-column',
        supporter: 'in-start',
        example: 'grid[c-span-3]',
      },
      {
        inCss: 'grid-row',
        supporter: 'in-start',
        example: 'grid[r-span-3]',
      },
      {
        inCss: 'grid-auto-flow',
        supporter: 'in-start',
        example: 'grid[flow-1]',
      },
      {
        inCss: 'grid-auto-column',
        supporter: 'in-start',
        example: 'grid[auto-flow-1]',
      },
      {
        inCss: 'gap',
        supporter: 'in-start',
        example: 'grid[gap-1rem]',
      },
      {
        inCss: 'justify-content',
        supporter: ['start', 'end', 'center', 'between', 'around', 'evenly'],
        example: 'grid[jc-center]',
      },
      {
        inCss: 'justify-align',
        supporter: ['stretch', 'start', 'end', 'center'],
        example: 'grid[ja-center]',
      },
      {
        inCss: 'justify-self',
        supporter: ['auto', 'stretch', 'start', 'end', 'center'],
        example: 'grid[js-center]',
      },
      {
        inCss: 'align-items',
        supporter: ['start', 'end', 'center', 'stretch'],
        example: 'grid[ai-end]',
      },
      {
        inCss: 'align-content',
        supporter: ['start', 'end', 'center', 'between', 'around', 'evenly'],
        example: 'grid[ac-end]',
      },
      {
        inCss: 'align-self',
        supporter: ['auto', 'stretch', 'start', 'end', 'center'],
        example: 'grid[as-end]',
      },
    ],
  },
  {
    open: false,
    keys: ['r', 'rounded'],
    resources: [{ inCss: 'border-radius', supporter: 'spread', example: 'r[1rem 2rem 0.5rem 1rem]' }],
  },
  {
    open: false,
    keys: ['pos', 'position'],
    resources: [
      { inCss: 'position', supporter: ['relative', 'fixed', 'sticky', 'absolute', 'static'], example: 'pos:absolute' },
      { inCss: 'left|bottom|top|right', supporter: 'direction', example: 'pos[fixed left-0 top-0]' },
    ],
  },
  {
    open: false,
    keys: ['b', 'border'],
    resources: [
      { inCss: 'border', supporter: 'unit', example: 'border:1' },
      { inCss: 'border-color', supporter: 'unique', example: 'border:red' },
      { inCss: 'border-style', supporter: ['solid', 'dotted', 'dashed'], example: 'border:solid' },
      { inCss: 'left|bottom|top|right', supporter: 'direction', example: 'b[l 1 red solid]' },
    ],
  },
  {
    open: false,
    keys: ['o', 'outline'],
    resources: [
      { inCss: 'outline', supporter: 'unit', example: 'outline:1' },
      { inCss: 'outline-color', supporter: 'unique', example: 'outline:red' },
      { inCss: 'outline-style', supporter: ['solid', 'dotted', 'dashed'], example: 'outline:solid' },
    ],
  },
  {
    open: false,
    keys: ['bg', 'background'],
    resources: [
      { inCss: 'background-color', supporter: 'color', example: 'bg:#CC0000' },
      { inCss: 'background-color', supporter: 'image', example: 'bg:/foo.png' },
      { inCss: 'background-size', supporter: ['auto', 'cover', 'contain'], example: 'bg[/foo.png cover]' },
      {
        inCss: 'background-repeat',
        supporter: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'repeat-round', 'repeat-space'],
        example: 'bg[/foo.png cover no-repeat]',
      },
    ],
  },
  {
    open: false,
    keys: ['sc', 'scroll'],
    resources: [
      { inCss: 'overflow', supporter: ['scroll', 'hidden', 'auto', 'clip', 'visible'], example: 'scroll:auto' },
      { inCss: 'overflow-direction', supporter: ['y', 'x'], example: 'scroll[y auto]' },
    ],
  },
  {
    open: false,
    keys: ['d', 'display'],
    resources: [
      {
        inCss: 'display',
        supporter: [
          'block',
          'inline-block',
          'inline',
          'inline-flex',
          'flex',
          'table',
          'inline-table',
          'grid',
          'none',
          'contents',
          'list-item',
          'flow-root',
          'table-row',
          'table-cell',
        ],
        example: 'display:none',
      },
    ],
  },
  {
    open: false,
    keys: ['z', 'zindex'],
    resources: [
      {
        inCss: 'z-index',
        supporter: 'number',
        example: 'z:9999',
      },
    ],
  },
  {
    open: false,
    keys: ['fl', 'float'],
    resources: [
      {
        inCss: 'float',
        supporter: ['right', 'left', 'none'],
        example: 'float:left',
      },
    ],
  },
  {
    open: false,
    keys: ['sh', 'shadow'],
    resources: [
      {
        inCss: 'shadow',
        supporter: 'color',
        example: 'shadow[red]',
      },
      {
        inCss: 'shadow',
        supporter: 'in-start',
        example: 'shadow[h-5]',
      },
      {
        inCss: 'shadow',
        supporter: 'in-start',
        example: 'shadow[v-5]',
      },
      {
        inCss: 'shadow',
        supporter: 'in-start',
        example: 'shadow[blur-20]',
      },
      {
        inCss: 'shadow',
        supporter: 'in-start',
        example: 'shadow[radius-20]',
      },
      {
        inCss: 'text-shadow',
        supporter: 'unique',
        example: 'shadow[text ...]',
      },
    ],
  },
  {
    open: false,
    keys: ['typo', 'typography'],
    resources: [
      {
        inCss: 'text-indent',
        supporter: 'in-start',
        example: 'typo[indent-2rem]',
      },
      {
        inCss: 'letter-spacing',
        supporter: 'in-start',
        example: 'typo[letter-0.1em]',
      },
      {
        inCss: 'word-spacing',
        supporter: 'in-start',
        example: 'typo[word-0.05em]',
      },
      {
        inCss: 'line-height',
        supporter: 'in-start',
        example: 'typo[line-0.05em]',
      },
      {
        inCss: 'text-decoration',
        supporter: 'in-start',
        example: 'typo[decoration-none]',
      },
      {
        inCss: 'text-overflow',
        supporter: ['clip', 'ellipsis'],
        example: 'typo[clip]',
      },
      {
        inCss: 'text-transform',
        supporter: ['uppercase', 'lowercase', 'capitalize'],
        example: 'typo[uppercase]',
      },
      {
        inCss: 'white-space',
        supporter: 'in-start',
        example: 'typo[space-0.1em]',
      },
      {
        inCss: 'word-break',
        supporter: 'in-start',
        example: 'typo[break-all]',
      },
      {
        inCss: 'text-align',
        supporter: ['left', 'right', 'center', 'justify', 'initial', 'inherit'],
        example: 'typo[justify]',
      },
      {
        inCss: '-webkit-line-clamp',
        supporter: 'in-start',
        example: 'typo[line-clamp-2]',
      },
    ],
  },
  {
    open: false,
    keys: ['tr', 'transition'],
    resources: [
      {
        inCss: 'transition-delay',
        supporter: 'in-start',
        example: 'tr[delay-200ms]',
      },
      {
        inCss: 'transition-duration',
        supporter: 'in-start',
        example: 'tr[duration-1s]',
      },
      {
        inCss: 'transition-property',
        supporter: ['all', 'none', 'background', 'color', 'transform'],
        example: 'tr:all',
      },
      {
        inCss: 'transition-timing-function',
        supporter: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'],
        example: 'tr[delay-200ms]',
      },
    ],
  },
  {
    open: false,
    keys: ['tf', 'transform'],
    resources: [
      {
        inCss: 'rotate',
        supporter: 'in-start',
        example: 'tr[rotate-30deg]',
      },
      {
        inCss: 'translate',
        supporter: 'in-start',
        example: 'tr[translate-5px]',
      },
      {
        inCss: 'rotate',
        supporter: 'in-start',
        example: 'tr[scale-0.5]',
      },
      {
        inCss: 'skew',
        supporter: 'in-start',
        example: 'tr[skewX-10]',
      },
      {
        inCss: 'perspective',
        supporter: 'in-start',
        example: 'tr[perspective-800px]',
      },
    ],
  },
  {
    open: false,
    keys: ['fi', 'filter'],
    resources: [
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[blur-16px]',
      },
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[contrast-1]',
      },
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[grayscale-50%]',
      },
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[hue-30deg]',
      },
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[invert-50%]',
      },
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[saturate-1]',
      },
      {
        inCss: 'filter',
        supporter: 'in-start',
        example: 'fi[sepia-50%]',
      },
      {
        inCss: 'backdrop-filter',
        supporter: 'unique',
        example: 'fi[backdrop ...]',
      },
    ],
  },
  {
    open: false,
    keys: ['st', 'style'],
    resources: [
      {
        inCss: 'accent-color',
        supporter: 'in-start',
        example: 'st[aaccent-#FF00FF]',
      },
      {
        inCss: 'appearance',
        supporter: 'unique',
        example: 'st[appearance]',
      },
      {
        inCss: 'cursor',
        supporter: 'in-start',
        example: 'st[cursor-pointer]',
      },
      {
        inCss: 'touch-action',
        supporter: 'in-start',
        example: 'st[touch-auto]',
      },
      {
        inCss: 'pointer-events',
        supporter: 'in-start',
        example: 'st[events-none]',
      },
      {
        inCss: 'resize',
        supporter: 'in-start',
        example: 'st[resize-none]',
      },
      {
        inCss: 'scroll-behavior',
        supporter: 'in-start',
        example: 'st[scroll-smooth]',
      },
      {
        inCss: 'user-select',
        supporter: 'in-start',
        example: 'st[select-text]',
      },
      {
        inCss: 'list-style-position',
        supporter: 'in-start',
        example: 'st[list-type-outside]',
      },
      {
        inCss: 'list-style-type',
        supporter: 'in-start',
        example: 'st[list-type-disc]',
      },
    ],
  },
  {
    open: false,
    keys: ['gr', 'gradient'],
    resources: [
      {
        inCss: 'background: linear-gradient',
        supporter: 'sequential',
        example: 'gr[0deg rgba-255-255-255-0.2 0% rgba-0-255-255-0.5 100%]',
      },
    ],
  },
  {
    open: false,
    keys: ['an', 'animation'],
    resources: [
      {
        inCss: 'animation-name',
        supporter: 'in-start',
        example: 'an[name-spin]',
      },
      {
        inCss: 'animation-duration',
        supporter: 'in-start',
        example: 'an[duration-2s]',
      },
      {
        inCss: 'animation-delay',
        supporter: 'in-start',
        example: 'an[delay-0.2s]',
      },
      {
        inCss: 'animation-iteration-count',
        supporter: 'in-start',
        example: 'an[iteration-infinite]',
      },
      {
        inCss: 'animation-direction',
        supporter: 'in-start',
        example: 'an[direction-alternate]',
      },
      {
        inCss: 'animation-timing-function',
        supporter: 'in-start',
        example: 'an[timing-linear]',
      },
      {
        inCss: 'animation-timing-fill-mode',
        supporter: 'in-start',
        example: 'an[fill-both]',
      },
    ],
  },
  {
    open: false,
    keys: ['cl', 'collection'],
    resources: [
      {
        inCss: 'overflow: hidden|text-overflow: ellipsis|white-space: nowrap',
        supporter: 'collection',
        example: 'cl[truncate]',
      },
      {
        inCss: 'min-height: 100vh|width: 100%|overflow-y: auto',
        supporter: 'collection',
        example: 'cl[screen]',
      },
    ],
  },
])
</script>

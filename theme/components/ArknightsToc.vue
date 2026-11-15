<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed } from 'vue'
import { useArknightsText } from '../composables/config'

// Keep live outline state here: updating the Markdown parent would retrigger
// ValaxyMd's content-updated hook and create an update loop.
const { headers: outline, handleClick } = useOutline()
type OutlineItem = ReturnType<typeof useOutline>['headers']['value'][number]
function flatten(entries: OutlineItem[]): OutlineItem[] {
  return entries.flatMap(entry => [entry, ...flatten(entry.children || [])])
}
const headers = computed(() => flatten(outline.value))
const text = useArknightsText()
</script>

<template>
  <aside v-if="headers.length" class="ark-toc">
    <nav :aria-label="text.outline">
      <p class="ark-eyebrow">
        {{ text.outline }}
      </p><ol>
        <li v-for="header in headers" :key="header.link" :class="{ 'ark-toc-sub': header.level > 2 }">
          <a :href="header.link" @click="handleClick">{{ header.title }}</a>
        </li>
      </ol>
    </nav>
  </aside>
</template>

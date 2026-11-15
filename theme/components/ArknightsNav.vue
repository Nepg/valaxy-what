<script setup lang="ts">
import { useSiteConfig, useValaxyDark } from 'valaxy'
import { computed } from 'vue'
import { useArknightsText, useArknightsTheme } from '../composables/config'

const site = useSiteConfig()
const theme = useArknightsTheme()
const text = useArknightsText()
const { toggleDark } = useValaxyDark()
const nav = computed(() => theme.value.nav.length
  ? theme.value.nav
  : [
      { text: text.value.home, link: '/' },
      { text: text.value.archive, link: '/archives/' },
    ])
</script>

<template>
  <header class="ark-nav">
    <RouterLink to="/" class="ark-brand">
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true"><path d="M4 29 18 4l14 25H4Z" fill="none" stroke="currentColor" stroke-width="2" /><path d="m10 26 8-14 8 14H10Z" fill="currentColor" /></svg>
      <span>{{ site.title }}<small>FIELD NOTES / PERSONAL BLOG</small></span>
    </RouterLink>
    <nav :aria-label="text.navigation" class="ark-nav-links">
      <template v-for="item in nav" :key="item.link">
        <a v-if="/^(?:https?:|mailto:)/.test(item.link)" :href="item.link">{{ item.text }}</a>
        <RouterLink v-else :to="item.link">
          {{ item.text }}
        </RouterLink>
      </template>
    </nav>
    <div class="ark-nav-actions">
      <button type="button" class="ark-appearance" :aria-label="text.appearance" :title="text.appearance" @click="toggleDark()">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" /></svg>
      </button>
      <ArknightsMobileNav :items="nav" />
    </div>
  </header>
</template>

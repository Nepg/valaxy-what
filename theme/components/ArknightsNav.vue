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
      <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">
        <path d="M7 9 L12 25 L18 15 L24 25 L29 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      </svg> -->
      <span>{{ site.title }}
        <small>MAN / MAMBA OUT</small>
      </span>
    </RouterLink>
    <!-- <nav :aria-label="text.navigation" class="ark-nav-links">
      <template v-for="item in nav" :key="item.link">
        <a v-if="/^(?:https?:|mailto:)/.test(item.link)" :href="item.link">{{ item.text }}</a>
        <RouterLink v-else :to="item.link">
          {{ item.text }}
        </RouterLink>
      </template>
    </nav> -->
    <div class="ark-nav-actions">
      <RouterLink
        to="/"
        class="ark-appearance"
        exact-active-class="ark-appearance-active"
        role="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path>
        </svg>
      </RouterLink>
      <button type="button" class="ark-appearance" :aria-label="text.appearance" :title="text.appearance" @click="toggleDark()">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" /></svg>
      </button>
      <ArknightsMobileNav :items="nav" />
    </div>
  </header>
</template>

<style scoped>
/* 首页激活状态 */
:deep(.ark-appearance-active) {
  background: var(--ak-surface-panel);
  border-color: var(--ak-signal-info);
}

/* 可选：hover状态保持原有交互 */
.ark-appearance {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
</style>

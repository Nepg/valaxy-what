<script setup lang="ts">
import type { Post } from 'valaxy'
import { useSiteConfig, useValaxyI18n } from 'valaxy'
import { useArknightsText, useArknightsTheme } from '../composables/config'
import { postDate } from '../composables/post'

defineProps<{ featured?: Post, count: number }>()
const site = useSiteConfig()
const theme = useArknightsTheme()
const text = useArknightsText()
const { $tO } = useValaxyI18n()
</script>

<template>
  <section class="ark-hero" :aria-label="site.title">
    <div class="ark-hero-copy">
      <p class="ark-eyebrow">
        <span aria-hidden="true" /> {{ theme.eyebrow }}
      </p>
      <h1>{{ site.title }}</h1>
      <p class="ark-hero-description">
        {{ site.description || site.subtitle }}
      </p>
      <RouterLink to="/archives/" class="ak-button ak-button--action ark-action">
        {{ text.archive }} <span aria-hidden="true">↗</span>
      </RouterLink>
      <div class="ark-hero-foot">
        <span>{{ theme.motto }}</span><span class="ark-mono">{{ String(count).padStart(2, '0') }} / {{ text.results }}</span>
      </div>
    </div>
    <div class="ark-featured">
      <div class="ark-featured-art" aria-hidden="true">
        <svg viewBox="0 0 560 240" fill="none"><path d="M100 240 240 0h118l-140 240H100Z" fill="currentColor" opacity=".12" /><path d="m265 240 140-240h40L305 240h-40Z" fill="currentColor" opacity=".55" /><path d="M-20 204 580 64M-20 224 580 84" stroke="currentColor" opacity=".2" /><circle cx="385" cy="112" r="69" stroke="currentColor" opacity=".65" /><path d="M305 112h160M385 32v160" stroke="currentColor" /><path d="m45 32 26 0M58 19v26" stroke="currentColor" opacity=".65" /></svg>
        <span class="ark-art-label">OBSERVE / RECORD / SHARE</span>
      </div>
      <div class="ark-featured-body">
        <p class="ark-eyebrow">
          {{ text.featured }} <time v-if="featured?.date">{{ postDate(featured.date) }}</time>
        </p>
        <h2>{{ featured ? $tO(featured.title) || text.untitled : text.noPosts }}</h2>
        <p>{{ featured?.description || (featured ? theme.motto : text.noPostsText) }}</p>
        <RouterLink v-if="featured?.path" :to="featured.path" class="ark-featured-link">
          {{ text.read }} <span aria-hidden="true">↗</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

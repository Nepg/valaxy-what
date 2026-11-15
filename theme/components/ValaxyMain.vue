<script setup lang="ts">
import type { PageData, Post } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useArknightsText, useArknightsTheme } from '../composables/config'
import { postDate } from '../composables/post'

const props = defineProps<{ frontmatter: Post, data?: PageData }>()
const { $tO } = useValaxyI18n()
const text = useArknightsText()
const theme = useArknightsTheme()
const outlineEnabled = computed(() => (props.frontmatter.outline ?? theme.value.outline) !== false)
</script>

<template>
  <main id="ark-main" class="ark-reading" tabindex="-1">
    <slot name="main">
      <header class="ark-article-header">
        <RouterLink to="/archives/" class="ark-back">
          ← {{ text.back }}
        </RouterLink>
        <p v-if="frontmatter.date" class="ark-eyebrow">
          {{ text.published }} / {{ postDate(frontmatter.date) }}
        </p>
        <h1>{{ $tO(frontmatter.title) }}</h1>
        <p v-if="frontmatter.description" class="ark-article-description">
          {{ frontmatter.description }}
        </p>
        <div v-if="frontmatter.tags?.length" class="ark-post-meta">
          <span v-for="tag in frontmatter.tags" :key="tag">{{ tag }}</span>
        </div>
        <slot name="main-header" /><slot name="main-header-after" />
      </header>
      <div class="ark-reading-grid" :class="{ 'ark-has-toc': outlineEnabled }">
        <div class="ark-article-content">
          <slot name="main-content">
            <ValaxyMd :frontmatter="frontmatter">
              <slot name="main-content-md" /><slot />
            </ValaxyMd>
          </slot>
          <slot name="main-content-after" /><slot name="comment" />
        </div>
        <slot name="aside">
          <ArknightsToc v-if="outlineEnabled" />
        </slot>
      </div>
      <slot name="footer" />
    </slot>
  </main>
</template>

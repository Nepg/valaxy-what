<script setup lang="ts">
import type { Post } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { useArknightsText } from '../composables/config'
import { postDate } from '../composables/post'

defineProps<{ post: Post, index: number }>()
const { $tO } = useValaxyI18n()
const text = useArknightsText()
</script>

<template>
  <article class="ark-post-row">
    <span class="ark-post-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
    <div class="ark-post-content">
      <div class="ark-post-meta">
        <time v-if="post.date">{{ postDate(post.date) }}</time><span v-for="tag in post.tags" :key="tag">{{ tag }}</span><span v-if="post.draft">DRAFT</span>
      </div>
      <h3>
        <RouterLink :to="post.path || '/'">
          {{ $tO(post.title) || text.untitled }}
        </RouterLink>
      </h3>
      <p v-if="post.description">
        {{ post.description }}
      </p>
    </div>
    <span class="ark-post-arrow" aria-hidden="true">↗</span>
  </article>
</template>

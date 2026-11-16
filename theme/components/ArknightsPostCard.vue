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
        <!-- 加 class -->
        <RouterLink :to="post.path || '/'" class="ark-post-link">
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
<style scoped>
/* 1. 给外层的卡片加上相对定位，作为热区的参考系 */
.ark-post-row {
  position: relative;
  /* 如果你原来这里没有 cursor: pointer，可以加上，让鼠标放上去变成小手 */
  cursor: pointer; 
}

/* 2. 利用伪元素铺满整个卡片 */
.ark-post-link::after {
  content: '';
  position: absolute;
  inset: 0; /* 上下左右全为0，等于铺满整个 .ark-post-row */
  z-index: 1; /* 确保在最上层，可以接收鼠标点击 */
}

/* 3. 箭头颜色*/
.ark-post-row:hover .ark-post-arrow {
  color: var(--ark-accent);
}

</style>
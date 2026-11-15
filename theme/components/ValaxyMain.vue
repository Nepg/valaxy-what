<script setup lang="ts">
import type { PageData, Post } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useArknightsText, useArknightsTheme } from '../composables/config'
import { postDate } from '../composables/post'
import FloatingToc from './FloatingToc.vue'

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
        <!-- <RouterLink to="/archives/" class="ark-back">
          ← {{ text.back }}
        </RouterLink> -->
        <h1>{{ $tO(frontmatter.title) }}</h1>
        <p v-if="frontmatter.description" class="ark-article-description">
          {{ frontmatter.description }}
        </p>
        <div v-if="frontmatter.tags?.length" class="ark-post-meta">
          <span v-for="tag in frontmatter.tags" :key="tag">{{ tag }}</span>
        </div>
        <slot name="main-header" /><slot name="main-header-after" />
      </header>

      <!-- 自定义双栏布局 -->
      <div class="my-custom-layout">
        <div class="my-content-area">
          <slot name="main-content">
            <ValaxyMd :frontmatter="frontmatter">
              <slot name="main-content-md" /><slot />
            </ValaxyMd>
          </slot>
          <slot name="main-content-after" /><slot name="comment" />
        </div>

        <!-- 关键：不要用多余的 div 包裹它，直接让 FloatingToc 自己控制显隐 -->
        <FloatingToc v-if="outlineEnabled" />
      </div>

      <slot name="footer" />
    </slot>
    <p v-if="frontmatter.date" class="ark-eyebrow">
      {{ text.published }} / {{ postDate(frontmatter.date) }}
    </p>
  </main>
</template>

<style scoped>
/* 桌面端：极宽的自适应网格 */
.my-custom-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 移动端：改为单列，绝不隐藏 FloatingToc */
@media (max-width: 1024px) {
  .my-custom-layout {
    display: block;
    max-width: 100%;
  }
}
</style>

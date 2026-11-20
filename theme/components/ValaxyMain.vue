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
      <!-- 只有当它不是不隐藏头部时，才显示大标题和时间戳 -->
      <header v-if="!frontmatter.hideHeader" class="ark-article-header">
        <h1>{{ $tO(frontmatter.title) }}</h1>
        
        <!-- 时间戳 -->
        <div v-if="frontmatter.date" class="ark-post-timestamps">
          <p class="ark-eyebrow">
            {{ text.published }} {{ postDate(frontmatter.date) }}
          </p>
          <p v-if="frontmatter.updated" class="ark-eyebrow">
            {{ text.updated }} {{ postDate(frontmatter.updated) }}
          </p>
        </div>

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

        <FloatingToc v-if="outlineEnabled" />
      </div>
<div class="page-footer"></div>
      <slot name="footer" />
    </slot>
  </main>
</template>

<style scoped>
/* 桌面端：极宽的自适应网格 */
.my-custom-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 200px;
  gap: 50px;
  max-width: 1400px;
  margin: 0 auto;
  /* 如果正文和顶部时间戳贴太近，可以在这里加点 margin-top */
  margin-top: 20px;
}

/* 调整时间戳样式*/
.ark-post-timestamps {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: -10px; /* 往上拉一点，靠近 H1 标题 */
  margin-bottom: 30px; /* 和下面的正文拉开距离 */
  
  font-family: var(--ak-font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--ark-muted);
  opacity: 0.8;
}

.ark-post-timestamps p {
  margin: 0;
}

.ark-post-timestamps .ark-eyebrow::before {
  content: '>';
  color: var(--ark-accent);
  margin-right: 4px;
  font-weight: 700;
}
.page-footer{
  margin-top: 50px;
  border-top: 1px dashed var(--ark-line); /* 极细的虚线切割 */
}
/* 屏幕不够大时，自动收缩保护 */
@media (max-width: 1400px) {
  .my-custom-layout {
    max-width: 100%;
  }
}

/* 移动端：改为单列 */
@media (max-width: 1024px) {
  .my-custom-layout {
    display: block;
    max-width: 100%;
  }
}
</style>
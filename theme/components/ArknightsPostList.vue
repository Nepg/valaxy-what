<script setup lang="ts">
import type { Post } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed, shallowRef } from 'vue'
import { useArknightsText } from '../composables/config'

const props = defineProps<{ posts: Post[], title: string }>()
const query = shallowRef('')
const tag = shallowRef('')
const text = useArknightsText()
const { $tO } = useValaxyI18n()
// const tags = computed(() => [...new Set(props.posts.flatMap(post => post.tags || []))].sort())
const filtered = computed(() => props.posts.filter((post) => {
  return (!tag.value || post.tags?.includes(tag.value))
    && ($tO(post.title) || '').toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())
}))
function reset() {
  query.value = ''
  tag.value = ''
}
</script>

<template>
  <section class="ark-archive" aria-labelledby="ark-archive-title">
    <div class="ark-section-head">
      <h2 id="ark-archive-title">
        {{ title }}
        <!-- <span class="ark-mono"> / ARCHIVE</span> -->
      </h2>
      <span class="ark-result-count" role="status">{{ filtered.length }} {{ text.results }}</span>
    </div>
    <!-- <div class="ark-filters">
      <div class="ark-tags" role="group" :aria-label="text.tags">
        <button type="button" :aria-pressed="tag === ''" @click="tag = ''">
          {{ text.all }}
        </button>
        <button v-for="item in tags" :key="item" type="button" :aria-pressed="tag === item" @click="tag = item">
          {{ item }}
        </button>
      </div>
      <label class="ark-search"><span class="ark-sr-only">{{ text.search }}</span><input v-model="query" type="search" :placeholder="text.search"><span aria-hidden="true">⌕</span></label>
    </div> -->
    <div v-if="filtered.length" class="ark-posts">
      <ArknightsPostCard v-for="(post, index) in filtered" :key="post.path" :post="post" :index="index" />
    </div>
    <div v-else class="ark-empty">
      <p>{{ text.empty }}</p><button v-if="query || tag" type="button" class="ak-button ark-action" @click="reset">
        {{ text.reset }}
      </button>
    </div>
  </section>
</template>

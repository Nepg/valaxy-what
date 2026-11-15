<script setup lang="ts">
import { usePostList } from 'valaxy'
import { useArknightsText } from '../../composables/config'

const posts = usePostList()
const text = useArknightsText()
</script>

<template>
  <main id="ark-main" class="ark-archive-page" tabindex="-1">
    <header>
      <p class="ark-eyebrow">
        THE COMPLETE FIELD NOTES
      </p><h1>{{ text.archive }}</h1>
    </header><ArknightsPostList :posts="posts" :title="text.all" />
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
import { usePostList } from 'valaxy'
import { useArknightsText } from '../composables/config'

const posts = usePostList()
const text = useArknightsText()
</script>

<template>
  <main id="ark-main" tabindex="-1">
    <ArknightsHero :featured="posts[0]" :count="posts.length" /><ArknightsPostList :posts="posts" :title="text.latest" />
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

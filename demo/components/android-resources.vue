<!-- demo/components/AndroidResources.vue -->
<script setup lang="ts">
import categories from '../data/resources-android.json'
import ResourcePage from './resource-page.vue'
</script>

<template>
  <ResourcePage :categories="categories" />
</template>
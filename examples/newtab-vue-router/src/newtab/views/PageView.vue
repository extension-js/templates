<script lang="ts" setup>
import {useRoute} from 'vue-router'
import iconUrl from '../../images/icon.png'

defineProps<{heading: string}>()

const route = useRoute()
</script>
<template>
  <main>
    <h1>
      <img class="vue" :src="iconUrl" alt="The Vue logo" width="120px" />
      <br />
      {{ heading }}
    </h1>
    <pre><code>{{ route.fullPath }}</code></pre>
  </main>
</template>

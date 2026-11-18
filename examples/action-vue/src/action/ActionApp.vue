<script lang="ts" setup>
import {ref} from 'vue'
import iconUrl from '../images/icon.png'

const message = 'Welcome to your Vue Action Extension'
const count = ref(0)
</script>
<template>
  <header>
    <h1>
      <img class="vue" :src="iconUrl" alt="The Vue logo" width="72px" />
      <br />
      {{ message }}
    </h1>
    <p>
      Learn more in the
      <a
        href="https://extension.js.org"
        target="_blank"
        rel="noopener noreferrer"
        >Extension.js docs</a
      >.
    </p>
    <button class="counter" type="button" @click="count++">
      Clicked {{ count }} {{ count === 1 ? 'time' : 'times' }}
    </button>
    <p class="edit-hint">
      Edit <code>src/action/ActionApp.vue</code> and save to see your changes.
    </p>
  </header>
</template>

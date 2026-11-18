<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'
</script>
<template>
  <div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/users">Users</RouterLink>
    </nav>

    <RouterView />

    <p class="edit-hint">
      Edit <code>src/newtab/router.ts</code> and save to see your changes.
    </p>
  </div>
</template>

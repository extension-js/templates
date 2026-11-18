<script lang="ts">
import {router} from 'svelte-spa-router'
import logo from '../images/icon.png'

let {heading}: {heading: string} = $props()

const url = $derived(new URL(`#${router.location}`, window.location.href).href)
</script>

<main>
  <h1>
    <img class="svelte" src={logo} alt="The Svelte logo" width="120px" />
    <br />
    {heading}
  </h1>
  <pre><code>{url}</code></pre>
</main>

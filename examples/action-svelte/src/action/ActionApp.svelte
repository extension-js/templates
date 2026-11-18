<script lang="ts">
import {onMount} from 'svelte'
import logo from '../images/icon.png'

const badge = chrome.action ?? chrome.browserAction

let count = $state(0)

onMount(() => {
  badge.getBadgeText({}, (text) => {
    count = Number(text) || 0
  })
})

function addOne() {
  count += 1
  badge.setBadgeText({text: String(count)})
}
</script>

<header>
  <h1>
    <img class="svelte" src={logo} alt="The Svelte logo" width="72px" />
    <br />
    Welcome to your Svelte Extension
  </h1>
  <p>
    Learn more in the
    <a href="https://extension.js.org" target="_blank" rel="noopener noreferrer"
      >Extension.js docs</a
    >.
  </p>
  <p class="counter">
    <button type="button" onclick={addOne}>Add one to the badge</button>
    <output class="count" aria-live="polite">{count}</output>
  </p>
  <p class="edit-hint">
    Edit <code>src/action/ActionApp.svelte</code> and save to see your changes.
  </p>
</header>

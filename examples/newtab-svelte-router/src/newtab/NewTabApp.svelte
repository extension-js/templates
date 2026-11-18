<script lang="ts">
import Router, {link} from 'svelte-spa-router'
import active from 'svelte-spa-router/active'
import Home from './routes/Home.svelte'
import About from './routes/About.svelte'
import Users from './routes/Users.svelte'

const routes = {
  '/': Home,
  '/about': About,
  '/users': Users,
  '*': Home
}
</script>

<div>
  <nav>
    <a href="/" use:link use:active>Home</a>
    <a href="/about" use:link use:active>About</a>
    <a href="/users" use:link use:active>Users</a>
  </nav>

  <Router {routes} />

  <p class="edit-hint">
    Edit <code>src/newtab/NewTabApp.svelte</code> and save to see your changes.
  </p>
</div>

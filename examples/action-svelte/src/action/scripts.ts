import {mount} from 'svelte'
import './styles.css'
import App from './ActionApp.svelte'

console.log('[From the action popup context] Hello from the action popup!')

const container = document.getElementById('app') as HTMLElement | null

if (container) {
  mount(App, {target: container})
}

export {}

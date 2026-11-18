import './styles.css'
import {createApp} from 'vue'
import NewTabApp from './NewTabApp.vue'
import {router} from './router'

console.log('[From the newtab override context] Hello from the new tab page!')

createApp(NewTabApp).use(router).mount('#app')

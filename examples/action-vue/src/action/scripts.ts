import './styles.css'
import {createApp} from 'vue'
import ActionApp from './ActionApp.vue'

console.log('[From the action popup context] Hello from the action popup!')

createApp(ActionApp).mount('#app')

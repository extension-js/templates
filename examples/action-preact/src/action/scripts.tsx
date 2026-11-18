import {render} from 'preact'
import ActionApp from './ActionApp'
import './styles.css'

console.log('[From the action popup context] Hello from the action popup!')

render(<ActionApp />, document.getElementById('root')!)

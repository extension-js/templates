import {signal} from '@preact/signals'
import {useEffect} from 'preact/hooks'
import './styles.css'
import preactLogo from '../images/icon.png'

const tabCount = signal<number | null>(null)

function readTabCount() {
  chrome.tabs.query({currentWindow: true}, (tabs) => {
    tabCount.value = tabs.length
  })
}

function openNewTab() {
  chrome.tabs.create({})
}

export default function ActionApp() {
  useEffect(() => {
    readTabCount()
    chrome.tabs.onCreated.addListener(readTabCount)
    chrome.tabs.onRemoved.addListener(readTabCount)

    return () => {
      chrome.tabs.onCreated.removeListener(readTabCount)
      chrome.tabs.onRemoved.removeListener(readTabCount)
    }
  }, [])

  const count = tabCount.value

  return (
    <header>
      <h1>
        <img
          className="preact"
          src={preactLogo}
          alt="The Preact logo"
          width="72px"
        />
        <br />
        Welcome to your Preact Action Extension.
      </h1>
      <p className="tabs">
        <span className="tab-count">
          {count === null
            ? 'Counting the tabs in this window.'
            : `${count} ${count === 1 ? 'tab' : 'tabs'} open in this window.`}
        </span>
        <button type="button" onClick={openNewTab}>
          New tab
        </button>
      </p>
      <p>
        Learn more in the{' '}
        <a
          href="https://extension.js.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Extension.js docs
        </a>
        .
      </p>
      <p className="edit-hint">
        Edit <code>src/action/ActionApp.tsx</code> and save to see your changes.
      </p>
    </header>
  )
}

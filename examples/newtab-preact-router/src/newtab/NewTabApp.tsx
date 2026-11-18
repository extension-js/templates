import {Link, Route, Router, Switch} from 'wouter-preact'
import {useHashLocation} from 'wouter-preact/use-hash-location'
import './styles.css'
import preactLogo from '../images/icon.png'

const activeClass = (isActive: boolean) => (isActive ? 'active' : undefined)

function Page({heading}: {heading: string}) {
  return (
    <main>
      <h1>
        <img
          className="preact"
          src={preactLogo}
          alt="The Preact logo"
          width="120px"
        />
        <br />
        {heading}
      </h1>
      <pre>
        <code>{window.location.href}</code>
      </pre>
    </main>
  )
}

export default function NewTabApp() {
  return (
    <Router hook={useHashLocation}>
      <div>
        <nav>
          <Link href="/" className={activeClass}>
            Home
          </Link>{' '}
          <Link href="/about" className={activeClass}>
            About
          </Link>{' '}
          <Link href="/users" className={activeClass}>
            Users
          </Link>
        </nav>

        <Switch>
          <Route path="/about">
            <Page heading="Learn more about your Preact Router Extension." />
          </Route>
          <Route path="/users">
            <Page heading="List of users of your Preact Router Extension." />
          </Route>
          <Route path="/">
            <Page heading="Welcome to your Preact Router Extension." />
          </Route>
          <Route>
            <Page heading="No route matches this address." />
          </Route>
        </Switch>

        <p className="edit-hint">
          Edit <code>src/newtab/NewTabApp.tsx</code> and save to see your
          changes.
        </p>
      </div>
    </Router>
  )
}

import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

// A gate run tests a CLI version other than the pinned one: it rewrites the
// pin in the root package.json, and refuses node_modules that hold another.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const version = (process.env.CLI_VERSION || '').trim()
const before = process.argv.includes('--before-install')

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(
    `pin-cli-under-test: "${version}" is not an exact version such as 4.1.40 or 4.1.40-canary.12.abc1234.`
  )

  process.exit(1)
}

const packagePath = join(root, 'package.json')
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const field = pkg.devDependencies?.extension
  ? 'devDependencies'
  : pkg.dependencies?.extension
    ? 'dependencies'
    : ''

if (!field) {
  console.error('pin-cli-under-test: package.json does not pin extension.')
  process.exit(1)
}

const pinned = pkg[field].extension

pkg[field].extension = version
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
console.log(`pin-cli-under-test: extension ${pinned} -> ${version}`)

const installedPath = join(root, 'node_modules', 'extension', 'package.json')

if (before) {
  console.log('pin-cli-under-test: the install runs next.')
} else if (existsSync(installedPath)) {
  const installed = JSON.parse(readFileSync(installedPath, 'utf8')).version

  if (installed !== version) {
    console.error(
      `pin-cli-under-test: node_modules holds extension ${installed}, not ${version}. The run would test the wrong CLI.`
    )

    process.exit(1)
  }

  console.log(`pin-cli-under-test: node_modules holds extension ${installed}`)
} else if (process.argv.includes('--installed')) {
  console.error(
    'pin-cli-under-test: node_modules/extension is missing after the install.'
  )

  process.exit(1)
}

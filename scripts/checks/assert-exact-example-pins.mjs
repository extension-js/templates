#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname)
const EXAMPLES = path.join(ROOT, 'examples')

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.extension'])
const FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

// Template tests install each example fresh, so a range lets any release reach
// CI the day it ships. Every dependency moves only through a pull request.
const EXACT = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/

// Local protocols point at sibling packages, not at a registry release.
const LOCAL = /^(workspace|file|link):/

// Monorepo templates keep more package.json files under packages/<name>.
function findManifests(dir, found = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (SKIP_DIRS.has(entry.name)) continue

    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) findManifests(full, found)
    else if (entry.name === 'package.json') found.push(full)
  }

  return found
}

const manifests = findManifests(EXAMPLES)
const ranged = []

// A walk that matches nothing would report every template as clean.
if (manifests.length < 40) {
  console.error(
    `assert-exact-example-pins: found only ${manifests.length} package.json files, ` +
      'expected at least 40. The scan stopped matching.'
  )

  process.exit(1)
}

for (const file of manifests) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))

  for (const field of FIELDS) {
    for (const [name, spec] of Object.entries(pkg[field] || {})) {
      if (EXACT.test(spec) || LOCAL.test(spec)) continue

      ranged.push(`  ${path.relative(ROOT, file)} ${field}.${name}: ${spec}`)
    }
  }
}

if (ranged.length) {
  console.error(
    `assert-exact-example-pins: ${ranged.length} example dependencies are not pinned exactly:\n` +
      ranged.join('\n') +
      '\nPin each one to the exact version the lockfile resolves, so a release reaches the templates only through a pull request.'
  )

  process.exit(1)
}

console.log(
  `assert-exact-example-pins: ${manifests.length} package.json files pin every dependency exactly`
)

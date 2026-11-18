#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {spawn} from 'node:child_process'

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname)
const EXAMPLES = path.join(ROOT, 'examples')
const TSC = path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc')
const ENV_FILE = 'extension-env.d.ts'

// What the CLI writes on dev and build for a project with no @types/chrome.
// The build strips types, so without this file tsc would see no chrome global.
const ENV_SOURCE =
  '/// <reference types="extension/types" />\n' +
  '/// <reference types="extension/types/polyfill" />\n'

// The bundler makes every entry its own module. A file with no import must be
// one to tsc as well, or a top-level name like status collides with the DOM.
const PROBE_FILE = 'module-scope-probe.ts'
const PROBE_SOURCE = 'const status = 1\n'

const only = (
  process.argv.find((arg) => arg.startsWith('--only=')) || ''
).slice('--only='.length)
const wanted = new Set(only.split(',').filter(Boolean))

const templates = fs
  .readdirSync(EXAMPLES, {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(EXAMPLES, name, 'tsconfig.json')))
  .filter((name) => wanted.size === 0 || wanted.has(name))
  .sort()

// A scan that matches nothing would report every template as clean.
if (wanted.size === 0 && templates.length < 30) {
  console.error(
    `assert-template-types: found only ${templates.length} templates with a tsconfig.json, ` +
      'expected at least 30. The scan stopped matching.'
  )

  process.exit(1)
}

if (templates.length === 0) {
  console.error(`assert-template-types: no template matches --only=${only}`)

  process.exit(1)
}

function check(name) {
  const cwd = path.join(EXAMPLES, name)
  const envPath = path.join(cwd, ENV_FILE)
  const wroteEnv = !fs.existsSync(envPath)
  const probePath = path.join(cwd, PROBE_FILE)

  if (wroteEnv) fs.writeFileSync(envPath, ENV_SOURCE)

  fs.writeFileSync(probePath, PROBE_SOURCE)

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [TSC, '--noEmit', '-p', '.'], {cwd})
    let output = ''

    child.stdout.on('data', (chunk) => (output += chunk))
    child.stderr.on('data', (chunk) => (output += chunk))
    child.on('error', (error) => (output += String(error)))
    child.on('close', (code) => {
      // Leave a checkout as it was: the file is the CLI's to write.
      if (wroteEnv) fs.rmSync(envPath, {force: true})

      fs.rmSync(probePath, {force: true})

      resolve({name, ok: code === 0, output: output.trim()})
    })
  })
}

const queue = [...templates]
const results = []
const workers = Math.max(1, Math.min(4, os.availableParallelism()))

await Promise.all(
  Array.from({length: workers}, async () => {
    while (queue.length) results.push(await check(queue.shift()))
  })
)

const failed = results
  .filter((result) => !result.ok)
  .sort((a, b) => a.name.localeCompare(b.name))

if (failed.length) {
  for (const result of failed) {
    console.error(`\nexamples/${result.name}\n${result.output}`)
  }

  console.error(
    `\nassert-template-types: ${failed.length} of ${templates.length} templates fail tsc --noEmit: ` +
      failed.map((result) => result.name).join(', ')
  )

  process.exit(1)
}

console.log(
  `assert-template-types: ${templates.length} templates pass tsc --noEmit`
)

/** @type {import('extension').FileConfig} */
// Extension.js uses a fresh profile on every run.
// Prefer that default? Remove the profile config below.
const profile = (name) => `./dist/extension-profile-${name}`

const withSvelte = (names) =>
  Array.isArray(names) && !names.includes('svelte')
    ? ['svelte', ...names]
    : names

export default {
  config(config) {
    config.resolve ??= {}
    config.resolve.conditionNames = withSvelte(config.resolve.conditionNames)

    for (const rule of Object.values(config.resolve.byDependency ?? {})) {
      rule.conditionNames = withSvelte(rule.conditionNames)
    }

    return config
  },
  browser: {
    chrome: {profile: profile('chrome')},
    chromium: {profile: profile('chromium')},
    edge: {profile: profile('edge')},
    firefox: {profile: profile('firefox')},
    'chromium-based': {profile: profile('chromium-based')},
    'gecko-based': {profile: profile('gecko-based')}
  }
}

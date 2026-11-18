import {
  extensionFixtures,
  resolveBuiltExtensionPath
} from '../extension-fixtures.js'
import {getDirname} from '../dirname.js'

const __dirname = getDirname(import.meta.url)
const pathToExtension = resolveBuiltExtensionPath(__dirname)
const test = extensionFixtures(pathToExtension)

const newTabUrl = (extensionId: string, route = '') =>
  `chrome-extension://${extensionId}/chrome_url_overrides/newtab.html${route}`

const ROUTES = [
  {link: 'About', hash: '#/about', heading: /Learn more about your/},
  {link: 'Users', hash: '#/users', heading: /List of users of your/},
  {link: 'Home', hash: '#/', heading: /Welcome to your/}
]

test('should exist an element with the welcome message text', async ({
  page,
  extensionId
}) => {
  await page.goto(newTabUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const h1 = page.locator('h1')

  await test.expect(h1).toBeVisible({timeout: 60000})
  await test.expect(h1).toHaveText(/Welcome to your Svelte Router/)
  await test.expect(page.getByAltText('The Svelte logo')).toBeVisible()
})

test('should exist a default color value', async ({page, extensionId}) => {
  await page.goto(newTabUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  await test
    .expect(page.locator('h1'))
    .toHaveCSS('color', 'rgb(201, 201, 201)', {timeout: 60000})
})

test('links move between the routes', async ({page, extensionId}) => {
  await page.goto(newTabUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  for (const route of ROUTES) {
    const link = page.getByRole('link', {name: route.link, exact: true})

    await link.click()
    await test.expect(page.locator('h1')).toHaveText(route.heading)
    await test.expect(page.locator('pre code')).toHaveText(page.url())
    await test.expect(link).toHaveClass(/active/)
    test.expect(new URL(page.url()).hash).toBe(route.hash)
  }

  await page.goBack()
  await test.expect(page.locator('h1')).toHaveText(/List of users of your/)
})

test('every route renders from its own URL and survives a reload', async ({
  page,
  extensionId
}) => {
  for (const route of ROUTES) {
    await page.goto(newTabUrl(extensionId, route.hash), {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    })

    await test.expect(page.locator('h1')).toHaveText(route.heading)

    await page.reload({waitUntil: 'domcontentloaded'})
    await test.expect(page.locator('h1')).toHaveText(route.heading)
    test.expect(new URL(page.url()).hash).toBe(route.hash)
  }
})

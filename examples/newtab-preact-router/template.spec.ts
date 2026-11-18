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

const HOME = 'Welcome to your Preact Router Extension.'
const ABOUT = 'Learn more about your Preact Router Extension.'
const USERS = 'List of users of your Preact Router Extension.'
const NO_MATCH = 'No route matches this address.'

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
  await test.expect(h1).toContainText(HOME)
  await test.expect(page.locator('img.preact')).toBeVisible()

  const color = await h1.evaluate((element) =>
    window.getComputedStyle(element).getPropertyValue('color')
  )

  test.expect(color).toEqual('rgb(201, 201, 201)')
})

test('links move between the routes', async ({page, extensionId}) => {
  await page.goto(newTabUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const h1 = page.locator('h1')
  const nav = page.locator('nav')

  await test.expect(h1).toContainText(HOME)
  await test.expect(nav.locator('a.active')).toHaveText('Home')

  await nav.getByRole('link', {name: 'About'}).click()
  await test.expect(h1).toContainText(ABOUT)
  await test.expect(page).toHaveURL(/newtab\.html#\/about$/)
  await test.expect(nav.locator('a.active')).toHaveText('About')
  await test.expect(page.locator('pre code')).toContainText('#/about')

  await nav.getByRole('link', {name: 'Users'}).click()
  await test.expect(h1).toContainText(USERS)
  await test.expect(page).toHaveURL(/newtab\.html#\/users$/)

  await page.goBack()
  await test.expect(h1).toContainText(ABOUT)

  await nav.getByRole('link', {name: 'Home'}).click()
  await test.expect(h1).toContainText(HOME)
  await test.expect(page).toHaveURL(/newtab\.html#\/$/)
})

test('a route still renders after a reload and from a direct address', async ({
  page,
  extensionId
}) => {
  await page.goto(newTabUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const h1 = page.locator('h1')

  await page.locator('nav').getByRole('link', {name: 'Users'}).click()
  await test.expect(h1).toContainText(USERS)

  await page.reload({waitUntil: 'domcontentloaded'})
  await test.expect(h1).toContainText(USERS)
  await test.expect(page).toHaveURL(/newtab\.html#\/users$/)

  await page.goto('about:blank')
  await page.goto(newTabUrl(extensionId, '#/about'), {
    waitUntil: 'domcontentloaded'
  })

  await test.expect(h1).toContainText(ABOUT)

  await page.goto('about:blank')
  await page.goto(newTabUrl(extensionId, '#/missing'), {
    waitUntil: 'domcontentloaded'
  })

  await test.expect(h1).toContainText(NO_MATCH)
})

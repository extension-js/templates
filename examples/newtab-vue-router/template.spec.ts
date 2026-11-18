import {
  extensionFixtures,
  resolveBuiltExtensionPath
} from '../extension-fixtures.js'
import {getDirname} from '../dirname.js'

const __dirname = getDirname(import.meta.url)
const pathToExtension = resolveBuiltExtensionPath(__dirname)
const test = extensionFixtures(pathToExtension)

const newTabUrl = (extensionId: string) =>
  `chrome-extension://${extensionId}/chrome_url_overrides/newtab.html`

const open = async (
  page: {goto(url: string, options: object): Promise<unknown>},
  url: string
) => {
  await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000})
}

test('should exist an element with the welcome message text', async ({
  page,
  extensionId
}) => {
  await open(page, newTabUrl(extensionId))

  const h1 = page.locator('h1')

  await test.expect(h1).toBeVisible({timeout: 60000})
  await test.expect(h1).toContainText('Welcome to your Vue Router Extension.')
  await test.expect(h1).toHaveCSS('color', 'rgb(201, 201, 201)')
  await test.expect(page.locator('pre code')).toHaveText('/')
})

test('links move between the three routes', async ({page, extensionId}) => {
  await open(page, newTabUrl(extensionId))

  const h1 = page.locator('h1')
  const path = page.locator('pre code')

  await page.getByRole('link', {name: 'About'}).click()
  await test.expect(h1).toContainText('Learn more about your Vue Router')
  await test.expect(path).toHaveText('/about')
  await test.expect(page).toHaveURL(/#\/about$/)

  await page.getByRole('link', {name: 'Users'}).click()
  await test.expect(h1).toContainText('List of users of your Vue Router')
  await test.expect(path).toHaveText('/users')
  await test.expect(page).toHaveURL(/#\/users$/)

  await page.goBack()
  await test.expect(path).toHaveText('/about')

  await page.getByRole('link', {name: 'Home'}).click()
  await test.expect(h1).toContainText('Welcome to your Vue Router Extension.')
  await test.expect(page).toHaveURL(/#\/$/)
})

test('a reload on a route other than home renders the same route', async ({
  page,
  extensionId
}) => {
  await open(page, newTabUrl(extensionId))
  await page.getByRole('link', {name: 'Users'}).click()
  await test.expect(page.locator('pre code')).toHaveText('/users')

  await page.reload({waitUntil: 'domcontentloaded'})
  await test
    .expect(page.locator('h1'))
    .toContainText('List of users of your Vue Router')

  await test.expect(page).toHaveURL(/#\/users$/)

  await open(page, `${newTabUrl(extensionId)}#/about`)
  await page.reload({waitUntil: 'domcontentloaded'})
  await test
    .expect(page.locator('h1'))
    .toContainText('Learn more about your Vue Router')
})

test('an unknown route falls back to home', async ({page, extensionId}) => {
  await open(page, `${newTabUrl(extensionId)}#/nowhere`)

  await test
    .expect(page.locator('h1'))
    .toContainText('Welcome to your Vue Router Extension.')

  await test.expect(page).toHaveURL(/#\/$/)
})

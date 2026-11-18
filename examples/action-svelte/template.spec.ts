import {
  extensionFixtures,
  resolveBuiltExtensionPath
} from '../extension-fixtures.js'
import {getDirname} from '../dirname.js'

const __dirname = getDirname(import.meta.url)
const pathToExtension = resolveBuiltExtensionPath(__dirname)
const test = extensionFixtures(pathToExtension)

const popupUrl = (extensionId: string) =>
  `chrome-extension://${extensionId}/action/index.html`

const badgeText = (page: {evaluate<T>(fn: () => Promise<T>): Promise<T>}) =>
  page.evaluate(() => chrome.action.getBadgeText({}))

test('action popup page renders', async ({page, extensionId}) => {
  await page.goto(popupUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const h1 = page.locator('h1').first()

  await test.expect(h1).toBeVisible({timeout: 60000})
  await test.expect(h1).toContainText('Welcome to your Svelte Extension')
  await test.expect(page.getByAltText('The Svelte logo')).toBeVisible()
  await test
    .expect(page.getByRole('link', {name: 'Extension.js docs'}))
    .toHaveAttribute('href', 'https://extension.js.org')
})

test('the button counts on the toolbar badge', async ({page, extensionId}) => {
  await page.goto(popupUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const button = page.getByRole('button', {name: 'Add one to the badge'})
  const count = page.locator('.count')

  await test.expect(count).toHaveText('0')
  test.expect(await badgeText(page)).toBe('')

  await button.click()
  await test.expect(count).toHaveText('1')
  await test.expect.poll(() => badgeText(page)).toBe('1')

  await button.click()
  await test.expect(count).toHaveText('2')
  await test.expect.poll(() => badgeText(page)).toBe('2')

  await page.reload({waitUntil: 'domcontentloaded'})
  await test.expect(page.locator('.count')).toHaveText('2')
})

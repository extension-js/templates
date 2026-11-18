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

test('action popup page renders the Preact app', async ({
  page,
  extensionId
}) => {
  await page.goto(popupUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const h1 = page.locator('h1')

  await test.expect(h1).toBeVisible({timeout: 60000})
  await test
    .expect(h1)
    .toContainText('Welcome to your Preact Action Extension.')

  await test.expect(page.locator('img.preact')).toBeVisible()

  const color = await h1.evaluate((element) =>
    window.getComputedStyle(element).getPropertyValue('color')
  )

  test.expect(color).toEqual('rgb(201, 201, 201)')
})

test('action popup counts the tabs and opens a new one', async ({
  page,
  context,
  extensionId
}) => {
  await page.goto(popupUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const count = page.locator('.tab-count')
  const before = context.pages().length
  const label = (tabs: number) =>
    `${tabs} ${tabs === 1 ? 'tab' : 'tabs'} open in this window.`

  await test.expect(count).toHaveText(label(before))

  const opened = context.waitForEvent('page')

  await page.getByRole('button', {name: 'New tab'}).click()

  const tab = await opened

  await test.expect(count).toHaveText(label(before + 1))
  await tab.close()
  await test.expect(count).toHaveText(label(before))
})

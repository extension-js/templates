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

test('action popup page renders the Vue app', async ({page, extensionId}) => {
  await page.goto(popupUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const h1 = page.locator('h1').first()

  await test.expect(h1).toBeVisible({timeout: 60000})
  await test.expect(h1).toContainText('Welcome to your Vue Action Extension')
  await test.expect(h1).toHaveCSS('color', 'rgb(201, 201, 201)')

  const logo = page.getByRole('img', {name: 'The Vue logo'})

  await test.expect(logo).toBeVisible()
  test
    .expect(await logo.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0)
})

test('the counter button updates on every click', async ({
  page,
  extensionId
}) => {
  await page.goto(popupUrl(extensionId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  })

  const counter = page.getByRole('button', {name: /Clicked/})

  await test.expect(counter).toHaveText('Clicked 0 times', {timeout: 60000})
  await counter.click()
  await test.expect(counter).toHaveText('Clicked 1 time')
  await counter.click()
  await test.expect(counter).toHaveText('Clicked 2 times')
})

test('the manifest points the toolbar popup at the Vue page', async ({
  context,
  extensionId
}) => {
  const [worker] = context.serviceWorkers()
  const popup = await worker.evaluate(() => chrome.action.getPopup({}))

  test.expect(popup).toEqual(popupUrl(extensionId))
})

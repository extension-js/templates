[powered-image]: https://img.shields.io/badge/Powered%20by-Extension.js-0065e6
[powered-url]: https://extension.js.org

![Powered by Extension.js][powered-image]

# Preact Router New Tab Example

> Replaces your new tab page with a small Preact app you can navigate across routes.

![screenshot](./screenshot.png)

**What you'll see**: A custom new-tab page replacing the browser default, with links that move between three routes.

**How it works**: The manifest overrides the new-tab page and loads a Preact + TypeScript entry bundled from `src/newtab/`.

A new-tab page driven by [wouter](https://github.com/molefrog/wouter) through its `wouter-preact` package. An extension page has no server, so the routes live in the URL hash: every route loads from the same HTML file and still renders after a reload. Useful for extension UIs that span multiple in-app routes.

## Try it locally

```bash
npx extension@latest create my-newtab-preact-router --template newtab-preact-router
cd my-newtab-preact-router
npm install
npm run dev
```

A fresh browser window opens with the extension already loaded.

## Project layout

```
src/
├── images/
│   ├── icon-128.png
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   ├── icon-64.png
│   └── icon.png
├── newtab/
│   ├── index.html
│   ├── NewTabApp.tsx
│   ├── scripts.tsx
│   └── styles.css
├── background.ts
└── manifest.json
```

## Commands

Cloned this repo instead? The examples ship without npm scripts, so run Extension.js directly from the example directory. Run `npm install` first when the example declares dependencies.

### dev

Run the extension in development mode. Target a browser with `--browser`:

```bash
npx extension@latest dev .                  # Chromium (default)
npx extension@latest dev . --browser=chrome
npx extension@latest dev . --browser=edge
npx extension@latest dev . --browser=firefox
```

### build

Build for production:

```bash
npx extension@latest build .                # Chromium (default)
npx extension@latest build . --browser=firefox
npx extension@latest build . --browser=edge
```

### preview

Preview the production build with the bundled browser:

```bash
npx extension@latest preview .
```

## Tests

This template ships an end-to-end check (`template.spec.ts`) validated by the examples-repo CI on every commit.

## Learn more

- [Extension.js docs](https://extension.js.org)
- [Templates index](https://extension.js.org/docs/getting-started/templates)
- [GitHub: extension-js/extension.js](https://github.com/extension-js/extension.js)

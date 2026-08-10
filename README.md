# Nuvex UI

Nuvex UI is a Vue 3 component framework focused on building consistent, reusable interfaces with a practical theming system, form controls, layout primitives, and scheduling components.

- Package: `nuvex-ui`
- Framework: Vue 3
- Distribution: ESM + UMD + TypeScript declarations

## Documentation

- Live docs: https://nuvex-ui-doc.vercel.app/
- Local docs index: [docs/index.md](./docs/index.md)
- Getting started: [docs/getting-started.md](./docs/getting-started.md)
- Theming: [docs/theming.md](./docs/theming.md)
- Components: [docs/components/README.md](./docs/components/README.md)

## Requirements

- Vue 3
- Node.js 18+
- ESM-compatible bundler (Vite recommended)

## Installation

```bash
npm install nuvex-ui
```

## Quick Start (Vue)

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'
import 'nuvex-ui/styles.css'

const app = createApp(App)
app.use(NuvexUI)
app.mount('#app')
```

Import individual components when needed:

```ts
import { EButton, ECard } from 'nuvex-ui'
```

## Nuxt 3 Setup

```ts
// plugins/nuvex-ui.ts
import { NuvexUI } from 'nuvex-ui'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(NuvexUI)
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['nuvex-ui/styles.css', 'nuvex-ui/framework.scss'],
})
```

## Theming

Nuvex UI includes `light` and `dark` themes by default. You can:

- Customize at build-time with Sass variables
- Register additional themes at runtime
- Toggle themes using the theme API

Framework styles import:

```scss
@import 'nuvex-ui/framework.scss';
```

Example custom token file:

```scss
// assets/styles/variables.scss
$border-radius-root: 6px;
$root-font-size: 16px;

$semantic-color-tokens-light: (
  'primary': #42b883,
  'secondary': #35495e,
  'error': #e74c3c,
);

$semantic-color-tokens-dark: (
  'primary': #58d78d,
  'secondary': #8ca0b8,
  'error': #f58a8a,
);

@import 'nuvex-ui/setting.scss';
```

Runtime theme config:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'

const app = createApp(App)

app.use(NuvexUI, {
  theme: {
    defaultTheme: 'light',
    storage: { enabled: true, key: 'my-app-theme' },
    system: { enabled: true },
    themes: {
      ocean: {
        name: 'ocean',
        isDark: false,
        tokens: {
          brand: '#0ea5e9',
          'surface-base': '#ecfeff',
        },
      },
    },
    applyTokensAsCssVars: true,
  },
})
```

## Locale Support

Set a global locale through plugin options:

```ts
app.use(NuvexUI, {
  locale: 'es',
})
```

Change locale at runtime:

```ts
import { setDefaultLocaleCode, getDefaultLocaleCode } from 'nuvex-ui'

setDefaultLocaleCode('fr')
console.log(getDefaultLocaleCode())
```

## Component Coverage

Current exports include:

- Base UI: `EAvatar`, `EButton`, `ECard`, `EChip`, `EDatePicker`, `EDialog`, `EIcon`, `EList`, `EProgressLinear`, `ESchedule`, `ETab`
- Forms: `ECheckbox`, `EForm`, `ERadio`, `ERadioGroup`, `ESelect`, `ESwitch`, `ETextfield`, `ETimePicker`
- Layout and utilities through framework styles and composables

See complete component docs in [docs/components/README.md](./docs/components/README.md).

## Local Development

Run the component playground:

```bash
npm run playground:dev
```

Build and preview playground:

```bash
npm run playground:build
npm run playground:preview
```

Run docs locally:

```bash
npm run docs:dev
```

## Quality and Build

```bash
npm test
npm run typecheck
npm run build
```

## Local Package Validation

Before publishing, validate the generated tarball:

```bash
npm run pack:local
# or
npm pack --dry-run
```

Then install the generated `.tgz` in a consumer app:

```bash
npm install ../<path-to-repo>/nuvex-ui-<version>.tgz
```

## Contributing

Contributions are welcome.

1. Fork this repository.
2. Create a feature branch.
3. Add tests/docs when applicable.
4. Open a pull request.

Issues and suggestions: https://github.com/everleandro/nuvex-ui/issues

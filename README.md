# Nuvex UI

Modern Vue 3 UI foundations for product teams building fast, polished, and consistent digital experiences.

Nuvex UI brings together reusable interface primitives, token-based theming, form controls, layout patterns, and dashboard-ready components in a single framework designed for real product work.

- Package: `nuvex-ui`
- Framework: Vue 3
- Distribution: ESM + UMD + TypeScript declarations
- Focus: scalable UI architecture, design consistency, fast delivery

## Why Teams Choose Nuvex UI

- Built for modern Vue 3 applications
- Flexible light and dark theming out of the box
- Token-driven styling for consistent design systems
- Components designed for SaaS, dashboards, admin tools, and internal products
- A practical balance between flexibility and implementation speed

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

## Product Highlights

### Design system foundation
A token-based architecture helps you define and evolve visual identity without scattering styles across the app.

### Seamless integration
Works naturally in Vue 3 and Nuxt 3 projects with a straightforward setup and predictable component APIs.

### Built for real product workflows
From forms and layout patterns to scheduling and dashboard interfaces, Nuvex UI is shaped around the needs of real applications, not just isolated demo components.

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

Build and preview the playground:

```bash
npm run playground:build
npm run playground:preview
```

Run the docs locally:

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

Then install the generated `.tgz` in a consumer application:

```bash
npm install ../<path-to-repo>/nuvex-ui-<version>.tgz
```

## Contributing

Contributions are welcome.

1. Fork this repository.
2. Create a feature branch.
3. Add tests and documentation where relevant.
4. Open a pull request.

Issues and suggestions: https://github.com/everleandro/nuvex-ui/issues

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

# Nuvex UI Vue Components Library

A comprehensive collection of reusable Vue.js UI components to streamline your development process. It contains frequently used components, adaptable to your needs. You can use each of the proposed components or just use the one you need.

## You can read the full documentation [here](https://nuvex-ui-doc.vercel.app/).

## Local documentation

You can also browse and maintain local markdown docs in this repository:

- [Docs index](./docs/index.md)
- [Getting started](./docs/getting-started.md)
- [Theming](./docs/theming.md)
- [Components](./docs/components/README.md)

## Local playground

Para probar cambios de componentes y tema en runtime:

```bash
npm run playground:dev
```

Build y preview del playground:

```bash
npm run playground:build
npm run playground:preview
```

- [Get Started](https://nuvex-ui-doc.vercel.app/)
- Forms & Inputs
  - [form](https://nuvex-ui-doc.vercel.app/form)
  - [Text Fields](https://nuvex-ui-doc.vercel.app/form/text-fields)
  - [Selects](https://nuvex-ui-doc.vercel.app/form/selects)
  - [Checkboxes](https://nuvex-ui-doc.vercel.app/form/checkboxes)
  - [Switches](https://nuvex-ui-doc.vercel.app/form/switches)
  - [Radio Buttons](https://nuvex-ui-doc.vercel.app/form/radio-buttons)
- Containment
  - [Buttons](https://nuvex-ui-doc.vercel.app/containment/buttons)
  - [schedule](https://nuvex-ui-doc.vercel.app/containment/schedule)
  - [Icons](https://nuvex-ui-doc.vercel.app/containment/icons)
  - [Date Pickers](https://nuvex-ui-doc.vercel.app/containment/date-picker)
  - [Expansion Panel](https://nuvex-ui-doc.vercel.app/containment/expansion-panel)
  - [Menu](https://nuvex-ui-doc.vercel.app/containment/menu)
  - [Chips](https://nuvex-ui-doc.vercel.app/containment/chips)
  - [Dialog](https://nuvex-ui-doc.vercel.app/containment/dialog)
  - [Tabs](https://nuvex-ui-doc.vercel.app/containment/tabs)
  - [Lists](https://nuvex-ui-doc.vercel.app/containment/lists)
- Layout
  - [Drawer](https://nuvex-ui-doc.vercel.app/layout/drawer)
  - [Bar](https://nuvex-ui-doc.vercel.app/layout/bar)

# Instalation and basic setup

## Installation

```bash
npm install nuvex-ui
```

```javascript
import { EButton, EForm, ECheckbox, EDIalog, ESelect,...rest } from "nuvex-ui";
```

# Setup

### vue app

```javascript
// src/main.ts

import { createApp } from "vue";
import "nuvex-ui/styles.css";
import App from "./App.vue";
import { NuvexUI } from "nuvex-ui";

const app = createApp(App);
// this line auto imports all components and directives
app.use(NuvexUI);
app.mount("#app");
```

```javascript
// vite.config.ts

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // This is the path to your variables
        additionalData: `          
        @import "assets/styles/variables.scss";";
        `,
      },
    },
  },
});
```

```scss
// src/style.scss
@import "nuvex-ui/framework.scss";
```

### nuxt app

```javascript
// plugins/nuvex-ui.ts

import { NuvexUI } from "nuvex-ui";
export default defineNuxtPlugin((nuxtApp) => {
  // this line auto imports all components and directives
  nuxtApp.vueApp.use(NuvexUI);
});
```

```javascript
// nuxt.config.ts

export default defineNuxtConfig({
  css: ["nuvex-ui/styles.css", "nuvex-ui/framework.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // This is the path to your variables
          additionalData: '@import "assets/styles/variables.scss";',
        },
      },
    },
  },
});
```

# Example variable file

```scss
// assets/styles/variables.scss

// Globals
$border-radius-root: 4px;
$root-font-size: 2rem;

// Colors
$colors: (
  "primary": #f19933,
  "secondary": #2c373c,
  "white": white,
  "black": black,
  "disabled": rgba(0, 0, 0, 0.38),
  "success": #66bb6a,
  "red": #f44336,
  "error": #f44336,
);

// This is mandatory
@import "nuvex-ui/setting.scss";
```

# Contribute

We welcome and encourage contributions from the community! If you'd like to contribute to the Vue UI Components library, here's how you can get started:

## Fork the Repository

Fork the repository on GitHub and clone it to your local machine.

```bash
git clone https://github.com/your-username/nuvex-ui-contributions.git
```

## Create a Branch

Create a new branch for your contributions.

```bash
git checkout -b feature-branch
```

## Make Changes

Make your changes to the code using your preferred code editor.

## Commit Changes

Stage and commit your changes.

```bash
git add .
git commit -m "Add feature or fix issue"
```

## Push Changes

Push your changes to your forked repository.

```bash
git push origin feature-branch
```

## Open a Pull Request

Visit your forked repository on GitHub, and open a pull request to the main repository.

## Report Issues

If you encounter any issues or have suggestions for improvements, please report them on our [Issues](https://github.com/everleandro/nuvex-ui/issues) page. Before creating a new issue, check if a similar one already exists.

# Thank You!

We appreciate your contributions and feedback. Together, let's make Nuvex UI even better!

## Package naming convention

- Main package: `nuvex-ui`
- Future scoped packages: `@nuvex-ui/<package>`
- Suggested next modules:
  - `@nuvex-ui/icons`
  - `@nuvex-ui/themes`

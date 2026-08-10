# Getting Started

## Requisitos

- Vue 3
- Node 18+
- Bundler compatible con ESM (Vite recomendado)

## Instalacion

```bash
npm install nuvex-ui
```

## Uso en Vue (global)

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'
import 'nuvex-ui/styles.css'

const app = createApp(App)
app.use(NuvexUI)
app.mount('#app')
```

## Theme global (opcional)

`theme` no es requerido. Nuvex UI ya trae `light` y `dark` por defecto.

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'

const app = createApp(App)

app.use(NuvexUI, {
  theme: {
    defaultTheme: 'light',
    storage: { key: 'my-app-theme' },
    themes: {
      ocean: {
        name: 'ocean',
        tokens: {
          brand: '#0ea5e9',
        },
      },
    },
    applyTokensAsCssVars: true,
  },
})
```

## Locale global y locales custom

Puedes definir un locale global para la libreria desde el plugin. Este locale se usa por defecto en helpers de fecha (`DateBuilder`) y en componentes como `EDatePicker` cuando no se pasa `lng` explicitamente.

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'

const app = createApp(App)

app.use(NuvexUI, {
  locale: 'es',
  locales: {
    'es-mx': {
      months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthsShort: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
      weekdays: ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
      weekdaysShort: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
      weekdaysMin: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sa'],
      start: 1,
      schedule: {
        toolbar: {
          view: 'Vista',
          day: 'Dia',
          week: 'Semana',
          resource: 'Recurso',
          space: 'Espacio',
          today: 'Hoy',
          previousPeriod: 'Periodo anterior',
          nextPeriod: 'Periodo siguiente',
          previousResourcePage: 'Pagina anterior de recursos',
          nextResourcePage: 'Pagina siguiente de recursos',
          backToWeek: 'Volver a semana',
          resourcePage: 'Pagina de recursos',
        },
      },
    },
  },
})

app.mount('#app')
```

Tambien puedes cambiar el locale por defecto en runtime:

```ts
import { setDefaultLocaleCode } from 'nuvex-ui'

setDefaultLocaleCode('fr')
```

Y consultarlo:

```ts
import { getDefaultLocaleCode } from 'nuvex-ui'

console.log(getDefaultLocaleCode())
```

## Uso por componente

```ts
import { EButton, ECard } from 'nuvex-ui'
```

## Importar estilos de framework

```scss
@import 'nuvex-ui/framework.scss';
```

## Nuxt 3 (plugin)

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
  css: ['nuvex-ui/styles.css', 'nuvex-ui/framework.scss']
})
```

## Probar local antes de publicar

1. En esta libreria, genera paquete local:

```bash
npm run pack:local
```

2. En tu proyecto Nuxt nuevo, instala el `.tgz` generado:

```bash
npm install ../<repo>/nuvex-ui-1.0.0.tgz
```

3. Luego consume igual que npm remoto:

```ts
import { NuvexUI } from 'nuvex-ui'
```

## Desarrollo local

Para probar cambios de componentes y estilos en un entorno aislado:

```bash
npm run playground:dev
```

Para generar build del playground:

```bash
npm run playground:build
```

Para previsualizar el build del playground:

```bash
npm run playground:preview
```

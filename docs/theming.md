# Theming

Nuvex UI expone variables Sass y CSS custom properties para personalizar tema en build-time y runtime, con soporte para Light/Dark mode dinamico via CSS variables.

## Resumen rapido

- `theme` en `app.use(NuvexUI, { theme })` es opcional.
- La libreria siempre incluye `light` y `dark` por defecto.
- `light` y `dark` se personalizan principalmente via Sass/CSS variables.
- El runtime API (`useTheme`) sirve para cambiar tema y registrar temas adicionales.

## Contrato oficial de surfaces

La libreria usa `surface-0..surface-3` como jerarquia visual comun. Esta jerarquia aplica tanto para `light` como para `dark`.

- `surface-0`: fondo base de app y viewport.
- `surface-1`: contenedores y paneles de contenido por defecto.
- `surface-2`: chrome persistente o capas elevadas frecuentes.
- `surface-3`: enfasis puntual (estados destacados), no como fondo general.

### Mapeo por componente de layout

- `App` (`.e-app`): `surface-0` (via `--e-app-background`).
- `Main` (`.e-main`) y `Container` (`.e-container`): heredan fondo del contexto, no definen surface propio.
- `Bar` (`.e-bar`): `surface-2`.
- `Drawer` (`.e-drawer`): `surface-1` base, `surface-2` en modo floating.
- `Card`, `Dialog`, `Menu`: `surface-1`.

### Regla de composicion

Si un layout mezcla varios bloques visibles al mismo tiempo, prioriza esta progresion:

`surface-0` -> `surface-1` -> `surface-2` -> `surface-3`

Evita saltar directamente de `surface-0` a `surface-3` para fondos estructurales.

## Configuración inicial

### Step 1: Prepara tu archivo de variables

Crea un archivo centralizado para todas las customizaciones de tema:

```scss
// assets/styles/variables.scss

// Tamaños y espaciado
$border-radius-root: 6px;
$root-font-size: 16px;

// Colores temáticos para modo Light
$semantic-color-tokens-light: (
  'primary': #42b883,
  'secondary': #35495e,
  'tertiary': #6c5ce7,
  'error': #e74c3c,
  'warning': #f39c12,
  'success': #27ae60,
  'info': #3498db
);

// Colores temáticos para modo Dark
$semantic-color-tokens-dark: (
  'primary': #58d78d,
  'secondary': #8ca0b8,
  'tertiary': #a29bfe,
  'error': #f58a8a,
  'warning': #f8b739,
  'success': #55efc4,
  'info': #74b9ff
);

// Importar después de tus customizaciones
@import 'nuvex-ui/setting.scss';
```

### Step 2: Importa las variables en tu main.scss

```scss
// styles/main.scss
@import 'variables.scss';
```

## Uso en Vue

```vue
<script setup>
import { useTheme } from 'nuvex-ui'

const { currentTheme, setTheme, toggleTheme, getThemes } = useTheme()

const useDark = () => setTheme('dark')
</script>

<template>
  <button @click="toggleTheme">Toggle theme</button>
  <button @click="useDark">Dark</button>
  <p>Theme actual: {{ currentTheme }}</p>
  <p>Disponibles: {{ getThemes().map(t => t.name).join(', ') }}</p>
</template>
```

## Configuracion del plugin de tema

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'

const app = createApp(App)

app.use(NuvexUI, {
  theme: {
    // Opcional: si no se define, fallback a light
    defaultTheme: 'light',
    storage: {
      enabled: true,
      key: 'my-app-theme',
    },
    system: {
      enabled: true,
    },
    // Solo para agregar temas nuevos, no para sobrescribir light/dark
    themes: {
      ocean: {
        name: 'ocean',
        isDark: false,
        tokens: {
          brand: '#0ea5e9',
          'surface-1': '#ecfeff',
        },
      },
    },
    applyTokensAsCssVars: true,
  },
})
```

## SSR

- El sistema de tema es SSR-safe: no accede a `window`, `document` o `localStorage` durante la creacion del store en servidor.
- La aplicacion de `data-theme` al DOM ocurre solo en cliente.
- Si hay tema persistido en cliente, se reconcilia durante hidratacion sin romper render.

## Buenas prácticas

- **Centraliza variables:** Mantén todas las variaciones de tema en un único archivo de configuración
- **Respeta la jerarquía:** No sobrescribas valores internos de componentes; usa las variables Sass documentadas
- **Documenta customizaciones:** Si añades nuevas variables, actualiza este archivo con comentarios
- **Separa concerns:** Usa variables para temas, no para sobrescrituras CSS puntuales
- **No sobrescribas `light`/`dark` via plugin:** Para esos temas base, usa tokens Sass/CSS.

## Sistema de Colores Avanzado

### Paleta Primitiva vs. Colores Semánticos

Nuvex UI diferencia entre dos sistemas de color:

**Tokens Semánticos** (`--e-color-*`): Significado intencional
- `primary`, `secondary`, `error`, `success`, etc.
- Cambian con el tema Light/Dark
- Usados internamente por componentes

**Paleta Primitiva** (`--e-palette-*`): Colores reutilizables sin carga semántica
- `--e-palette-red-500`, `--e-palette-blue-700`, etc.
- Escala fija de 10 tonos (50-900) por color
- Ideal para ilustraciones, gráficos y aplicaciones del usuario

### Personalizar Seeds (Colores Base)

Define el color raíz de cada familia antes de importar `setting.scss`:

```scss
// assets/styles/variables.scss
$primitive-color-seeds: (
  red: #dc2626,      // Rojo más oscuro
  blue: #2563eb,     // Azul más vibrante
  green: #16a34a,    // Verde más saturado
  amber: #d97706,
  neutral: #4b5563,
  purple: #7c3aed,   // Agregar nuevo color
) !default;

@import 'nuvex-ui/setting.scss';
```

Nuvex UI genera automaticamente la escala completa para cada color.

### Corregir Tonos Específicos

Si necesitas controlar tonos puntuales sin regenerar toda la escala:

```scss
$primitive-color-overrides: (
  red: (
    50: #fee2e2,
    500: #dc2626,  // Seed override
    900: #7f1d1d,
  ),
  blue: (
    700: #1d4ed8,
  ),
) !default;

@import 'nuvex-ui/setting.scss';
```

Luego úsalos en tu CSS:

```scss
.danger-banner {
  background: var(--e-palette-red-50);
  border-left: 4px solid var(--e-palette-red-600);
  color: var(--e-palette-red-900);
}

.info-box {
  background: var(--e-palette-blue-100);
  color: var(--e-palette-blue-900);
}
```

## Utility Classes

Nuvex UI genera automaticamente clases de utilidad para espaciado, flexbox, posicionamiento y mas. Estan optimizadas para reducir la cantidad de CSS custom que escribes.

### Sistema de Espaciado

Genera clases usando `$space-base` (default: 4px) y `$space-scale` (0-16).

```scss
// En assets/styles/variables.scss si quieres custom:
$space-base: 4px;
$space-scale: 16;
```

Esto genera clases como `.m-0` a `.m-16`, `.p-0` a `.p-16`:

```vue
<template>
  <!-- Margin/Padding -->
  <div class="p-4">Padding: 16px</div>
  <div class="m-8">Margin: 32px</div>
  <div class="mt-2">Margin-top: 8px</div>
  <div class="px-6">Padding left/right: 24px</div>
  
  <!-- Margin negativo (solo margin) -->
  <div class="m-n4">Margin: -16px</div>
  <div class="ml-n2">Margin-left: -8px</div>
</template>
```

**Direcciones disponibles:**
- `-X` (left+right), `-Y` (top+bottom), `-T`, `-R`, `-B`, `-L` (individual)
- Ejemplo: `.px-4` = `padding-left: 16px; padding-right: 16px;`

### Flexbox & Gap

```vue
<template>
  <!-- Dirección y distribución -->
  <div class="flex-row gap-4">Fila con espaciado</div>
  <div class="flex-col gap-2">Columna con espaciado</div>
  <div class="flex-wrap gap-x-6 gap-y-4">Wrappeable con gap custom por eje</div>
  
  <!-- Control de flex grow/shrink -->
  <div class="flex-1">Ocupa espacio disponible</div>
  <div class="flex-auto">Flexible con contenido natural</div>
  <div class="flex-none">Tamaño fijo</div>
  
  <!-- Alineación -->
  <div class="flex-row justify-center items-center">Centrado completo</div>
  <div class="flex-row justify-between items-start">Distribuido + alineado arriba</div>
</template>
```

### Posicionamiento Absoluto

```vue
<template>
  <!-- Posición -->
  <div class="absolute top-0 left-0">Arriba-izquierda</div>
  <div class="absolute inset-0">Llena todo el contenedor</div>
  <div class="fixed top-4 right-4">Fixed en arriba-derecha</div>
  <div class="relative">Baseline para absolutas internas</div>
</template>
```

### Overflow

```vue
<template>
  <!-- Comportamiento de desborde -->
  <div class="overflow-auto">Scroll si es necesario</div>
  <div class="overflow-hidden">Recorta contenido</div>
  <div class="overflow-x-auto overflow-y-hidden">Scroll horizontal apenas</div>
</template>
```

### Texto

```vue
<template>
  <!-- Truncamiento -->
  <p class="truncate">El texto se corta en una línea con ellipsis...</p>
  <p class="line-clamp-2">El texto no excede 2 líneas</p>
  <p class="line-clamp-3">El texto no excede 3 líneas</p>
  
  <!-- Whitespace -->
  <pre class="whitespace-pre">Respeta    espacios y
saltos de línea</pre>
  <p class="break-words">Unhyphenatedlongwordcanwrap</p>
</template>
```

### Border Radius

```vue
<template>
  <!-- Esquinas -->
  <div class="rounded">Redondeado estándar (6px)</div>
  <div class="rounded-lg">Redondeado grande</div>
  <div class="rounded-full">Completamente redondo</div>
  <div class="rounded-none">Sin redondeo</div>
  
  <!-- Lados específicos -->
  <div class="rounded-t">Solo arriba</div>
  <div class="rounded-b">Solo abajo</div>
  <div class="rounded-l">Solo izquierda</div>
  <div class="rounded-r">Solo derecha</div>
</template>
```

### Display & Responsive

```vue
<template>
  <!-- Display base -->
  <div class="d-block">Block por default</div>
  <div class="d-flex">Flex por default</div>
  <div class="d-none">Oculto</div>
  
  <!-- Responsive (cambia con breakpoints) -->
  <div class="d-none d-sm-block">Oculto < 600px, block >= 600px</div>
  <div class="d-flex d-lg-none">Flex por default, oculto >= 1264px</div>
</template>
```

**Breakpoints:** `xs` (0px), `sm` (600px), `md` (960px), `lg` (1264px), `xl` (1904px)

### Colores con Utilidades

Ahora puedes aplicar colores directamente con clases generadas:

```vue
<template>
  <!-- Colores semánticos -->
  <div class="primary">Fondo + contraste automático</div>
  <div class="primary--text">Solo color de texto</div>
  
  <!-- Colores primitivos -->
  <div class="red">Fondo red + contraste</div>
  <div class="blue-500">Fondo blue-500 + contraste</div>
  <div class="green-700--text">Texto green-700</div>
  
  <!-- Combinadas -->
  <button class="blue-600 p-4 rounded gap-2 flex-row items-center">
    Click me
  </button>
</template>
```

## Theming Runtime con CSS Variables

El runtime manager aplica `data-theme` en `documentElement` y permite activar temas base (`light`/`dark`) o temas agregados.

```ts
import { useTheme } from 'nuvex-ui'

const { setTheme } = useTheme()

setTheme('light')
setTheme('dark')
setTheme('ocean')
```

Cuando `applyTokensAsCssVars` esta habilitado, los tokens del tema activo se escriben como CSS variables con prefijo configurable (`--e-theme-` por defecto).

## API Sass

### Variables Disponibles

La libreria expone una escala tipografica semantica en CSS variables, por ejemplo `--e-typography-family-base`, `--e-typography-body-font-size-md` y `--e-typography-label-font-weight-md`. Los componentes base ya consumen estas variables para mantener la consistencia entre labels, inputs y texto de soporte.

```scss
// Globales
$border-radius-root: 6px;
$root-font-size: 16px;
$root-font-family: 'Segoe UI', Roboto, sans-serif;

// Espaciado
$space-base: 4px;
$space-scale: 16;

// Grid
$grid-breakpoints: (
  0: 0,
  sm: 600px,
  md: 960px,
  lg: 1264px,
  xl: 1904px,
);

// Elevación (sombras)
$elevation: (
  xs: 0px 2px 4px rgba(0, 0, 0, 0.1),
  sm: 0px 4px 6px rgba(0, 0, 0, 0.1),
  // ... más niveles
);

--e-btn-height-default: 3rem;
/* + todas las variantes */

/* Otras variables globales */
--e-root-font-family: "Roboto", sans-serif;
--e-border-radius-root: 4px;
--e-space-base: 4px;
--e-bar-height: 64px;
--e-schedule-borderwidth: thin;
--e-schedule-bg: white;
--e-schedule-border-color: rgb(218, 220, 224);

/* Paleta primitiva */
--e-palette-red: #ef4444;
--e-palette-red-500: #ef4444;
--e-palette-blue-500: #3b82f6;
--e-palette-neutral-300: ...;
```

### Agregar nuevos tokens

#### Token simple

Si agregas una variable simple en `public/styles/override/tokens/index.scss`, no hace falta registrarla en otro lado.

```scss
$field-label-gap: 6px !default;
```

Genera automaticamente:

```css
--e-field-label-gap: 6px;
```

#### Grupo de tokens

Si agregas un map y quieres una CSS var por item, debes incluirlo en `$theme-base-css-var-groups`.

```scss
$badge-sizes: (
  small: 16px,
  large: 24px,
) !default;

$theme-base-css-var-groups: (
  "e-grid-breakpoint": $grid-breakpoints,
  "e-badge-size": $badge-sizes,
) !default;
```

Genera:

```css
--e-badge-size-small: 16px;
--e-badge-size-large: 24px;
```

### Crear temas

Puedes sobreescribir variables CSS en tu app:

```scss
// src/styles/theme.css

// Light theme (default)
:root {
  --e-color-primary: #42b883;
  --e-color-secondary: #35495e;
  --e-schedule-bg: white;
}

// Dark theme
[data-theme='dark'] {
  --e-color-primary: #58d78d;
  --e-color-secondary: #8ca0b8;
  --e-schedule-bg: #1e1e1e;
  --e-schedule-border-color: #424242;
}
```

### Alternar temas en runtime

```javascript
// Cambiar tema
document.documentElement.setAttribute('data-theme', 'dark');

// O directamente con setProperty
document.documentElement.style.setProperty('--e-color-primary', '#58d78d');
document.documentElement.style.setProperty('--e-schedule-bg', '#1e1e1e');
```

Tambien puedes persistir el tema con `localStorage` y restaurarlo al montar la app.

### Colores personalizados

Los componentes usan un sistema genérico de colores. Puedes agregar colores completamente nuevos sin recompilar:

```scss
// En tu CSS
:root {
  --e-color-brand: #ff6b35;
  --e-contrast-brand: white;
  
  --e-color-custom-blue: #1e90ff;
  --e-contrast-custom-blue: #000;
}
```

```vue
<!-- Usa el color inmediatamente -->
<EButton color="brand">Mi marca</EButton>
<EButton color="custom-blue">Azul personalizado</EButton>
<EBar color="brand">Barra con color nuevo</EBar>
```

**Regla:** Cualquier color usado en el prop `color` intenta buscar:
1. `--e-color-{nombreColor}` para el fondo/color principal
2. `--e-contrast-{nombreColor}` para el texto (fallback: `white`)

Si no existen, se usa el color primario por defecto.

## Compatibilidad de variables legacy

En `public/styles/main.scss` tambien existen variables `--dr-*` para clases utilitarias de color y breakpoints.
Para nuevos componentes y theming dinamico, usa `--e-*` como fuente principal.

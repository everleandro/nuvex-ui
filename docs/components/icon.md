# EIcon

## Objetivo

`EIcon` renderiza iconos por clase CSS o por paths SVG, con soporte para color, tamano y estado deshabilitado.

## Importacion

```ts
import { EIcon } from 'nuvex-ui'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `icon` | `string \| IconPath \| IconPath[]` | `undefined` | Nombre de clase del icono o definicion SVG. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text`. |
| `disabled` | `boolean` | `false` | Desactiva interaccion sobre el icono. |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `'default'` | Agrega la clase `e-icon--size-{size}`. |
| `prefix` | `string` | valor de `iconFont.prefix` o `icon-` | Prefijo usado cuando `icon` se resuelve como clase CSS. |
| `preffix` | `string` | `undefined` | Alias legado de `prefix`. Se mantiene por compatibilidad. |
| `viewBox` | `string` | `'0 0 24 24'` | ViewBox usado al renderizar SVG paths. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Reemplaza por completo el contenido interno del icono. |

## Modos de uso

### Icono por clase CSS

Si `icon` es string, `EIcon` agrega la clase final usando:

- `prefix` si se envia por prop.
- `preffix` como alias legado.
- `iconFont.resolveClass(name)` si se configuro globalmente.
- `iconFont.prefix` si se configuro globalmente.
- `icon-` como fallback.

Tambien agrega una clase base configurable por `iconFont.baseClass` o `icon` como fallback.

### Configuracion global de icon fonts

Puedes configurar la estrategia de icon fonts al instalar la libreria:

```ts
import { NuvexUI } from 'nuvex-ui'

app.use(NuvexUI, {
  iconFont: {
    baseClass: 'fa',
    resolveClass: (name) => ['fa-solid', `fa-${name}`],
  },
})
```

Opciones disponibles:

- `baseClass`: clase base que `EIcon` agrega siempre para iconos por fuente.
- `prefix`: prefijo por defecto cuando `icon` es string y no se usa `resolveClass`.
- `resolveClass`: callback opcional para convertir el nombre del icono en una o varias clases finales.

Esta configuracion evita depender de CSS variables o del DOM para resolver clases, por lo que funciona mejor en SSR.

### Icono por SVG path

Si `icon` es `IconPath` o `IconPath[]`, `EIcon` renderiza un `<svg>` con uno o varios `<path>`.

Este modo es el mas apropiado cuando la libreria consumidora define su propio conjunto de iconos.

Tipo `IconPath`:

```ts
type IconPath = {
  d: string
  fill?: string
  class?: string
}
```

Cuando `fill` existe, el componente genera la clase `{fill}--text` para ese path.

## Ejemplos

### Basico con clase

```vue
<template>
  <EIcon icon="home" />
</template>
```

### Con color y tamano

```vue
<template>
  <EIcon icon="settings" color="primary" size="large" />
</template>
```

### SVG path inline

```vue
<template>
  <EIcon :icon="checkIcon" color="success" />
</template>

<script setup lang="ts">
const checkIcon = {
  d: 'M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z',
}
</script>
```

### Multiples paths

```vue
<template>
  <EIcon :icon="logoPaths" view-box="0 0 24 24" />
</template>

<script setup lang="ts">
const logoPaths = [
  { d: 'M12 2L2 22h20L12 2z', fill: 'primary' },
  { d: 'M12 8l4 8H8l4-8z', fill: 'white' },
]
</script>
```

## Accesibilidad

- El componente marca el icono como decorativo con `aria-hidden="true"`.
- Si el icono comunica significado por si solo, acompanalo con texto visible o usa una etiqueta accesible en el control contenedor.
- Si usas el slot `default`, mantén el mismo criterio: decorativo o con etiqueta accesible externa.
- En botones icon-only, coloca `aria-label` en el boton, no en `EIcon`.

## Errores comunes

- Usar `preffix` en codigo nuevo: sigue funcionando, pero `prefix` es el nombre correcto.
- Esperar que `icon="arrowLeft"` resuelva automaticamente un SVG: los strings solo generan clases CSS.
- Olvidar configurar `iconFont` o `prefix` cuando la libreria de iconos usa otra convención de clases.
- Pasar `viewBox` esperando que afecte iconos por clase CSS: solo aplica a SVG paths.
- Pasar paths SVG con `fill` fijo y luego esperar que `color` del componente los sobrescriba automaticamente.
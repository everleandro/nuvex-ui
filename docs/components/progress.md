# EProgressLinear

## Objetivo

`EProgressLinear` comunica progreso lineal dentro de flujos de carga, sincronizacion o procesamiento. Soporta modo `determinate` para representar porcentaje real y modo `indeterminate` para operaciones cuyo avance exacto no esta disponible.

## Importacion

```ts
import { EProgressLinear } from 'nuvex-ui'
```

## Navegacion Rapida

- [Props](#props)
- [Eventos](#eventos)
- [Slots](#slots)
- [Ejemplos](#ejemplos)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `indeterminate` | `boolean` | `false` | Activa la animacion continua cuando no existe un porcentaje real de avance. |
| `value` | `number` | `0` | Valor de progreso usado en modo determinate. El componente lo limita al rango `0..100`. |
| `height` | `string \| number` | `4` | Altura visual de la barra. Acepta numero o valor CSS valido. |
| `color` | `string` | `'primary'` | Color resuelto mediante el sistema compartido de CSS variables. |
| `useContrastColor` | `boolean` | `false` | Usa el color de contraste asociado a `color` en lugar del color base resuelto. |

## Eventos

`EProgressLinear` no emite eventos como parte de su API publica actual.

## Slots

`EProgressLinear` no expone slots publicos.

## Ejemplos

### Determinate basico

```vue
<template>
  <EProgressLinear :value="72" />
</template>
```

### Indeterminate explicito

```vue
<template>
  <EProgressLinear indeterminate color="teal-900" :height="6" />
</template>
```

### Con color y grosor personalizado

```vue
<template>
  <EProgressLinear
    :value="48"
    color="secondary"
    :height="10"
  />
</template>
```

### Usando el color de contraste

```vue
<template>
  <EProgressLinear
    indeterminate
    color="primary"
    use-contrast-color
    :height="6"
  />
</template>
```

## Accesibilidad

- Renderiza un contenedor con `role="progressbar"`.
- Expone `aria-valuemin="0"` y `aria-valuemax="100"` de forma constante.
- En modo determinate publica `aria-valuenow` con el valor normalizado entre `0` y `100`.
- En modo `indeterminate` omite `aria-valuenow`, porque no existe un progreso exacto que anunciar.

## Errores comunes

- Esperar animacion continua sin pasar `indeterminate`: ahora el default es `false`, por lo que el componente arranca en modo determinate.
- Pasar `value` fuera de rango: el componente lo limita internamente a `0..100`, pero conviene enviar datos ya normalizados desde la capa de negocio.
- Usar utilidades legacy como `primary--text` para el color: `EProgressLinear` ya consume el sistema nuevo de color resuelto por CSS variables.
- Activar `use-contrast-color` sin pasar `color`: sin un color base no existe un token de contraste asociado que resolver.
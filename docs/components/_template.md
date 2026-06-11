# Nombre Del Componente

## Objetivo

Describe que problema resuelve y cuando usarlo.

## Importacion

```ts
import { EComponente } from 'nuvex-ui'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `example` | `string` | `''` | Descripcion de la prop. |

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitido al cambiar valor. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal. |

## Ejemplos

### Basico

```vue
<template>
  <EComponente>Contenido</EComponente>
</template>
```

### Variante avanzada

```vue
<template>
  <EComponente example="valor">Contenido</EComponente>
</template>
```

## Accesibilidad

- Indica consideraciones A11y especificas del componente.

## Errores comunes

- Documenta problemas recurrentes y como resolverlos.

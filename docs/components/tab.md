# Tabs (`ETab`, `ETabGroup`)

## Objetivo

`ETabGroup` organiza una coleccion de tabs con indicador activo y navegacion por teclado.
`ETab` representa cada opcion dentro del grupo.

## Importacion

```ts
import { ETab, ETabGroup } from 'nuvex-ui'
```

## Props de `ETabGroup`

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | Valor activo del grupo (para `v-model`). |
| `color` | `string` | `'primary'` | Color del tab activo y del indicador. |
| `inactiveColor` | `string` | `'secondary'` | Color de tabs inactivos. |
| `track` | `boolean` | `false` | Dibuja una linea base opcional donde se desplaza el indicador. Usa `--e-color-border`. |
| `vertical` | `boolean` | `false` | Activa orientacion vertical. |
| `grow` | `boolean` | `false` | Hace que cada tab ocupe espacio disponible. |
| `tabAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Alineacion de tabs dentro del contenedor. |
| `name` | `string` | `undefined` | Prefijo para IDs accesibles (`tab`/`tabpanel`). |

## Props clave de `ETab`

`ETab` extiende `EButton`, por lo que hereda sus props visuales. Las props de uso principal en tabs son:

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `value` | `string \| number` | `-` | Valor unico del tab dentro del grupo. |
| `to` | `any` | `undefined` | Prop de compatibilidad para routing cuando aplica. |
| `icon` | `string \| IconPath \| IconPath[]` | `undefined` | Muestra icono en el tab. |

## Eventos

### `ETabGroup`

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `string \| number` | Se emite cuando cambia el tab activo. |

### `ETab`

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `click` | `Event` | Se emite al activar un tab. |

## Slots

### `ETabGroup`

| Slot | Descripcion |
| --- | --- |
| `default` | Lista de `ETab`. |

### `ETab`

| Slot | Descripcion |
| --- | --- |
| `default` | Label del tab. |
| `activator` | Permite reemplazar el activador con render personalizado. |

## Ejemplos

### Basico con track opcional

```vue
<template>
  <ETabGroup v-model="tab" color="primary" track name="profile-tabs">
    <ETab value="overview" :to="''">Overview</ETab>
    <ETab value="activity" :to="''">Activity</ETab>
    <ETab value="settings" :to="''">Settings</ETab>
  </ETabGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('overview')
</script>
```

La linea base del `track` toma el color desde el token global `--e-color-border`.

`ETab` usa `--e-tab-text-transform` y, por defecto, hereda `--e-btn-text-transform`.

```css
:root {
  --e-btn-text-transform: none;
  --e-tab-text-transform: var(--e-btn-text-transform);
}
```

### Vertical con teclado

```vue
<template>
  <ETabGroup v-model="tab" vertical track>
    <ETab value="one" :to="''">One</ETab>
    <ETab value="two" :to="''">Two</ETab>
    <ETab value="three" :to="''">Three</ETab>
  </ETabGroup>
</template>
```

Navegacion:
- Horizontal: `ArrowLeft`, `ArrowRight`, `Home`, `End`.
- Vertical: `ArrowUp`, `ArrowDown`, `Home`, `End`.

## Accesibilidad

- El grupo expone `role="tablist"` y orientacion con `aria-orientation`.
- Cada tab usa `role="tab"`, `aria-selected`, `aria-controls` y roving `tabindex`.
- Usa `name` en `ETabGroup` para IDs consistentes entre tabs y paneles.

## Errores comunes

- Repetir `value` entre tabs del mismo grupo.
- No sincronizar el estado con `v-model` en `ETabGroup`.
- Esperar que `track` se vea sin contraste cuando `--e-color-border` esta muy cercano al fondo.

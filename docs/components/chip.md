# EChip

## Objetivo

`EChip` renderiza etiquetas compactas con soporte para iconos, avatar, cierre opcional y modo interactivo.

## Importacion

```ts
import { EChip } from 'nuvex-ui'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `'default'` | Define el tamano visual del chip. |
| `tag` | `string` | `undefined` | Elemento raiz a renderizar. Si no se define, el componente resuelve el tag segun `clickable` y `closable`. |
| `type` | `string` | `'button'` cuando aplica | Tipo del root cuando el chip renderiza como `button`. |
| `ariaLabel` | `string` | `undefined` | Etiqueta accesible del chip cuando no hay texto suficiente o el contexto lo requiere. |
| `clickable` | `boolean` | `false` | Activa semantica interactiva y emision de `click`. |
| `disabled` | `boolean` | `false` | Bloquea interaccion y aplica estado visual deshabilitado. |
| `ripple` | `boolean` | `false` | Activa el efecto ripple en el root cuando el chip es clickable. |
| `selected` | `boolean` | `undefined` | Marca el chip como seleccionado. Si se define, expone `aria-pressed`. |
| `closable` | `boolean` | `false` | Muestra el boton de cierre y habilita `click:close`. |
| `closeLabel` | `string` | `'Close'` | `aria-label` del boton de cierre. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text`. |
| `text` | `boolean` | `false` | Variante sin underlay. |
| `prependAvatar` | `string` | `undefined` | URL del avatar al inicio. |
| `appendAvatar` | `string` | `undefined` | URL del avatar al final. |
| `prependIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al inicio. |
| `appendIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al final. |

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `click` | `MouseEvent \| KeyboardEvent` | Emitido cuando el chip es interactivo y el usuario lo activa. |
| `click:close` | `Event` | Emitido al presionar el boton de cierre. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal del chip. |
| `prepend` | Reemplaza la zona inicial. |
| `append` | Reemplaza la zona final. |

## Ejemplos

### Basico

```vue
<template>
  <EChip color="primary">Vue 3</EChip>
</template>
```

### Con avatar y cierre

```vue
<template>
  <EChip
    prepend-avatar="https://i.pravatar.cc/40?img=12"
    closable
    @click:close="handleRemove"
  >
    Usuario asignado
  </EChip>
</template>

<script setup lang="ts">
const handleRemove = () => {
  console.log('remove chip')
}
</script>
```

### Seleccionable

```vue
<template>
  <EChip
    clickable
    :selected="selected"
    color="primary"
    @click="selected = !selected"
  >
    Filtro activo
  </EChip>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(false)
</script>
```

### Con ripple

```vue
<template>
  <EChip clickable ripple color="primary" @click="handleClick">
    Action chip
  </EChip>
</template>
```

### En una lista o autocomplete

```vue
<template>
  <li>
    <EChip tag="div" closable clickable @click="handleOpen" @click:close="handleRemove">
      TypeScript
    </EChip>
  </li>
</template>
```

## Accesibilidad

- Si el chip dispara una accion, usa `clickable` en lugar de manejar clicks externos sin semantica.
- Si quieres feedback tactil/visual en chips interactivos, activa `ripple` explicitamente.
- Si el chip es toggle, pasa `selected` para exponer `aria-pressed`; no lo uses en chips de accion simple.
- Si `closable` esta activo, provee un `closeLabel` claro cuando el contexto no sea obvio.
- Evita texto ambiguo o demasiado largo sin contexto visible.

## Errores comunes

- Usar `selected` en cualquier chip clickable aunque no represente estado toggle.
- Esperar que `color` cambie el fondo: hoy aplica clase de color de texto y el underlay usa `currentColor`.
- Esperar ripple automatico en chips interactivos: hoy solo se activa si pasas `ripple`.
- Pasar `tag="button"` junto con `closable`: el componente evita roots interactivos nativos en ese caso para no anidar botones.
- Esperar controlar el tamano del avatar desde un prop dedicado: el avatar interno sigue el size del chip y sus variables CSS.
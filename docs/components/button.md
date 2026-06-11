# EButton

## Objetivo

`EButton` renderiza botones de accion con variantes visuales, estado de carga, iconos y soporte de link.

## Importacion

```ts
import { EButton } from 'nuvex-ui'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Desactiva interaccion. |
| `link` | `boolean` | `false` | Fuerza render como `<a>`. |
| `appendIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al final del contenido. |
| `prependIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al inicio del contenido. |
| `ripple` | `boolean` | `true` | Habilita o deshabilita el efecto ripple. |
| `loading` | `boolean` | `false` | Muestra loader y bloquea interaccion. |
| `color` | `string` | `undefined` | Color base. Resuelve `--e-color-{color}` y `--e-contrast-{color}`. |
| `hoverColor` | `string` | `undefined` | Color al hover. Si existe, reemplaza `color` mientras hover esta activo. |
| `fab` | `boolean` | `false` | Variante circular flotante. |
| `elevation` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'none'` | `undefined` | Define la elevacion explicita. Usa `none` para forzar un boton plano. |
| `text` | `boolean` | `false` | Variante texto (fondo transparente). |
| `useContrastColor` | `boolean` | `false` | En variantes transparentes como `text` y `outlined`, usa el color de contraste resuelto para `color`. |
| `outlined` | `boolean` | `false` | Variante outlined. |
| `block` | `boolean` | `false` | Ocupa todo el ancho disponible. |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `'default'` | Define el tamano visual del boton e iconos internos. |
| `rounded` | `boolean` | `false` | Bordes redondeados. |
| `stacked` | `boolean` | `false` | Acomoda icono/contenido en columna. |
| `icon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono principal cuando no hay slot default; en ese caso entra en modo icon-only. |
| `height` | `string \| number` | `undefined` | Alto del boton. Los numeros se convierten a px; strings conservan su unidad CSS. |
| `width` | `string \| number` | `undefined` | Ancho del boton. Los numeros se convierten a px; strings conservan su unidad CSS. |
| `type` | `string` | `'button'` | Tipo de boton HTML. |

## Atributos heredados

`EButton` usa `useAttrs()`, por lo que acepta atributos nativos y de routing:

- `to="/ruta"` renderiza `router-link`.
- `to="https://..."` renderiza `<a href="...">`.
- `href="https://..."` con `link` tambien renderiza `<a>`.
- con `link`, siempre renderiza `<a>`.

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal del boton. |
| `loading` | Loader personalizado cuando `loading=true`. |

## Ejemplos

### Elevacion por variable CSS

```css
:root {
  --e-btn-elevation: var(--e-elevation-md);
}
```

Sin pasar `elevation`, el boton contenido usa `--e-btn-elevation` como sombra base. Si necesitas quitarla por completo, usa `elevation="none"`.

### Basico

```vue
<template>
  <EButton color="primary">Guardar</EButton>
</template>
```

### Con iconos y estado loading

```vue
<template>
  <EButton
    color="secondary"
    prepend-icon="mdiContentSave"
    :loading="saving"
  >
    Guardar cambios
  </EButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const saving = ref(false)
</script>
```

### Como enlace externo

```vue
<template>
  <EButton href="https://example.com" link text>
    Ver sitio
  </EButton>
</template>
```

### Icon-only accesible

```vue
<template>
  <EButton icon="menu" aria-label="Abrir menu" text />
</template>
```

### Text sin inversion de color

```vue
<template>
  <EButton text color="surface-1" use-contrast-color>
    Accion secundaria
  </EButton>
</template>
```

### Color personalizado sin recompilar

```vue
<template>
  <EButton color="brand">Marca</EButton>
</template>

<style>
:root {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}
</style>
```

## Accesibilidad

- Usa texto visible y especifico en el slot `default`.
- Si el boton solo tiene icono, agrega `aria-label`.
- Si no quieres pasar `aria-label`, al menos usa `title` en botones icon-only para exponer una etiqueta minima.
- Evita deshabilitar botones sin una explicacion visible para el usuario.

## Errores comunes

- Pasar `icon` junto con contenido esperando modo icon-only: ese modo solo se aplica cuando no hay slot `default`.
- Usar `height`/`width` sin unidad en string cuando esperabas CSS libre: si pasas un numero o string numerico se convierte a px; usa valores como `100%`, `2.5rem` o `calc(...)` si necesitas otra unidad.
- Definir `to` sin Vue Router para rutas internas: en ese caso usa `link` + `href` externo o instala Router.
- Definir `color="brand"` sin crear `--e-color-brand`: el prop `color` debe apuntar a un color definido en el sistema (`--e-color-*` o `--e-palette-*`), no a valores hex directos.
- Pasar `color="#000"` o cualquier literal CSS: esa API no forma parte del contrato del componente; define primero el token en el sistema de color y luego usa su nombre.

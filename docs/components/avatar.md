# EAvatar

## Objetivo

`EAvatar` renderiza una imagen, un icono o un fallback visual compacto para representar personas, entidades o estados.

## Importacion

```ts
import { EAvatar } from 'drocket'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `'default'` | Tamano preset del avatar. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text`. |
| `elevation` | `string \| number` | `undefined` | Agrega la clase `e-elevation--{valor}`. |
| `icon` | `string \| IconPath \| IconPath[]` | `undefined` | Icono a renderizar cuando no hay `src`. |
| `src` | `string` | `undefined` | URL de imagen del avatar. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Reemplaza por completo el contenido interno del avatar. |

## Comportamiento

- Si `src` contiene una URL valida, se renderiza la imagen.
- Si no hay `src`, el componente usa `icon`.
- Si tampoco hay `icon`, usa `iconFactory.person` como fallback.
- Los sizes se resuelven mediante clases CSS compartidas con el contrato global de `SizeProps`.

## Ejemplos

### Basico

```vue
<template>
  <EAvatar />
</template>
```

### Con imagen

```vue
<template>
  <EAvatar src="https://i.pravatar.cc/64?img=12" />
</template>
```

### Con icono y color

```vue
<template>
  <EAvatar :icon="iconFactory.clear" color="error" size="large" />
</template>

<script setup lang="ts">
import iconFactory from '@/utils/icons'
</script>
```

### Tamano preset

```vue
<template>
  <EAvatar size="small" color="brand" />
  <EAvatar size="x-large" elevation="lg" />
</template>
```

## Accesibilidad

- Si el avatar es decorativo, mantenlo como apoyo visual y no lo uses como unica fuente de informacion.
- Si representa una persona o entidad importante, acompanal con nombre visible o con una etiqueta textual cercana.
- El `alt` interno actual de la imagen es generico (`avatar`), por lo que no reemplaza una descripcion semantica real.
- Si el avatar funciona como accion (por ejemplo, abrir perfil), envuelvelo en un control accesible (`button` o `a`) con `aria-label` explicito.

## Errores comunes

- Esperar iniciales automaticas: hoy el fallback es iconografico, no texto.
- Pasar un valor fuera del conjunto de sizes soportados esperando un tamano custom: `EAvatar` ahora usa solo los presets compartidos.
- Esperar que `color` afecte la imagen: solo afecta el modo icon/fallback y clases de texto.
- Usar `src` vacio esperando fallback transparente: string vacio se trata como ausencia de imagen y cae al icono.
- Usar el avatar como unico identificador de usuario en listas densas: en casos reales agrega nombre y, si aplica, rol o correo.
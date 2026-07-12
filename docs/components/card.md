# ECard

## Objetivo

`ECard` provee un contenedor visual para agrupar contenido, con espaciado interno nativo, soporte de color, altura fija, elevacion y un encabezado opcional.

## Importacion

```ts
import { ECard } from 'nuvex-ui'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `depressed` | `boolean` | `false` | Quita la sombra del card. |
| `color` | `string` | `undefined` | Resuelve fondo y contraste del card a partir de los tokens del tema. |
| `height` | `string` | `undefined` | Altura fija en px. |
| `elevation` | `string \| number` | `undefined` | Agrega la clase `e-elevation--{valor}`. |
| `title` | `string` | `undefined` | Titulo opcional para el encabezado del card. |
| `subtitle` | `string` | `undefined` | Subtitulo opcional para el encabezado del card. |
| `description` | `string` | `undefined` | Descripcion opcional para el cuerpo del card. |
| `prependVerticalAlign` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'start'` | Alinea verticalmente la media del lado inicial dentro del cuerpo del card. |
| `prependAvatar` | `string` | `undefined` | URL opcional para renderizar un avatar al inicio del cuerpo del card. |
| `prependAvatarProps` | `Partial<Omit<AvatarProps, 'src'>>` | `undefined` | Props opcionales que se pasan directo a `EAvatar`. |
| `prependIcon` | `string \| IconPath \| IconPath[]` | `undefined` | Icono opcional al inicio del cuerpo del card. |
| `prependIconProps` | `Partial<Omit<IconProps, 'icon'>>` | `undefined` | Props opcionales que se pasan directo a `EIcon`. |
| `appendVerticalAlign` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'start'` | Alinea verticalmente la media del lado final dentro del cuerpo del card. |
| `appendAvatar` | `string` | `undefined` | URL opcional para renderizar un avatar al final del cuerpo del card. |
| `appendAvatarProps` | `Partial<Omit<AvatarProps, 'src'>>` | `undefined` | Props opcionales que se pasan directo a `EAvatar`. |
| `appendIcon` | `string \| IconPath \| IconPath[]` | `undefined` | Icono opcional al final del cuerpo del card. |
| `appendIconProps` | `Partial<Omit<IconProps, 'icon'>>` | `undefined` | Props opcionales que se pasan directo a `EIcon`. |
| `prependHeaderAvatar` | `string` | `undefined` | URL opcional para renderizar un avatar al inicio del encabezado. |
| `prependHeaderAvatarProps` | `Partial<Omit<AvatarProps, 'src'>>` | `undefined` | Props opcionales que se pasan directo a `EAvatar`. |
| `prependHeaderIcon` | `string \| IconPath \| IconPath[]` | `undefined` | Icono opcional al inicio del encabezado. |
| `prependHeaderIconProps` | `Partial<Omit<IconProps, 'icon'>>` | `undefined` | Props opcionales que se pasan directo a `EIcon`. |
| `appendHeaderAvatar` | `string` | `undefined` | URL opcional para renderizar un avatar al final del encabezado. |
| `appendHeaderAvatarProps` | `Partial<Omit<AvatarProps, 'src'>>` | `undefined` | Props opcionales que se pasan directo a `EAvatar`. |
| `appendHeaderIcon` | `string \| IconPath \| IconPath[]` | `undefined` | Icono opcional al final del encabezado. |
| `appendHeaderIconProps` | `Partial<Omit<IconProps, 'icon'>>` | `undefined` | Props opcionales que se pasan directo a `EIcon`. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal del card. |
| `footer` | Contenido adicional al final del card. |

## Ejemplos

### Basico

```vue
<template>
  <ECard>
    <h3>Titulo</h3>
    <p>Contenido principal del card.</p>
  </ECard>
</template>
```

### Con media en el cuerpo

```vue
<template>
  <ECard
    title="Titulo del card"
    subtitle="Subtitulo opcional"
    description="Texto adicional para ampliar el contexto del card."
    :prepend-icon="iconFactory.calendar"
    :append-icon="iconFactory.heart"
    prepend-vertical-align="center"
    append-vertical-align="end"
  >
    <p>Contenido principal del card.</p>
  </ECard>
</template>
```

### Con media en el encabezado

```vue
<template>
  <ECard
    title="Titulo del card"
    subtitle="Subtitulo opcional"
    description="Texto adicional para ampliar el contexto del card."
    :prepend-header-icon="iconFactory.calendar"
    :append-header-icon="iconFactory.heart"
  >
    <p>Contenido principal del card.</p>
  </ECard>
</template>
```

### Con prependIconProps

```vue
<template>
  <ECard
    title="Actividad"
    subtitle="Resumen semanal"
    :prepend-icon="iconFactory.calendar"
    :prepend-icon-props="{ size: 'small', stateLayer: true }"
  >
    <p>Contenido principal del card.</p>
  </ECard>
</template>
```

### Con prependAvatar

```vue
<template>
  <ECard
    title="Jane Doe"
    subtitle="Product Designer"
    prepend-avatar="https://example.com/avatar.jpg"
    :prepend-avatar-props="{ size: 'small', elevation: 'sm' }"
  >
    <p>Contenido principal del card.</p>
  </ECard>
</template>
```

### Con prependHeaderAvatar

```vue
<template>
  <ECard
    title="Jane Doe"
    subtitle="Product Designer"
    prepend-header-avatar="https://example.com/avatar.jpg"
    :prepend-header-avatar-props="{ size: 'small', elevation: 'sm' }"
  >
    <p>Contenido principal del card.</p>
  </ECard>
</template>
```

### Sin sombra

```vue
<template>
  <ECard depressed>
    Card sin elevacion visual.
  </ECard>
</template>
```

### Con footer

```vue
<template>
  <ECard elevation="lg">
    <h3>Resumen</h3>
    <p>Informacion principal.</p>

    <template #footer>
      <EButton text>Cancelar</EButton>
      <EButton color="primary">Aceptar</EButton>
    </template>
  </ECard>
</template>
```

## Accesibilidad

- `ECard` es un contenedor visual y no aporta semantica interactiva por si solo.
- Si el card representa una region importante, agrega semantica desde fuera con `section`, `article`, `aria-labelledby` o encabezados visibles.
- Si el card contiene acciones, mantenlas en botones o links reales dentro del contenido.
- No conviertas el card completo en area clickeable sin exponer foco, etiqueta y rol adecuados.

## Errores comunes

- Esperar que `color` solo afecte texto: `ECard` ahora resuelve fondo y contraste desde tokens.
- Pasar `height` esperando unidades CSS libres: el componente agrega `px`, por lo que espera un valor numerico o string numerico.
- Asumir que `title`, `subtitle` y `description` siempre renderizan: el header solo aparece cuando `title`, `subtitle` o alguna prop `*Header*` tiene valor, mientras `description` se renderiza en el cuerpo.
- Usar `prepend*` o `append*` esperando media en el encabezado: esas props ahora pertenecen al cuerpo; para el header usa `prependHeader*` y `appendHeader*`.
- Pasar un valor arbitrario a `prependVerticalAlign` o `appendVerticalAlign`: los valores soportados son `start`, `center`, `end` y `stretch`.
- Pasar `prependAvatar` y `prependIcon` al mismo tiempo esperando ambos: `prependAvatar` tiene prioridad sobre `prependIcon`. La misma prioridad aplica a `prependHeaderAvatar` sobre `prependHeaderIcon`, y a los pares equivalentes de `append`.
# EDatePicker

## Objetivo

`EDatePicker` permite seleccionar fecha, mes o anio con navegacion por teclado, soporte de fechas deshabilitadas y resaltadas, y control por `v-model`.

## Importacion

```ts
import { EDatePicker } from 'nuvex-ui'
```

## Navegacion Rapida

- [Props](#props)
- [Eventos](#eventos)
- [Slots](#slots)
- [Ejemplos](#ejemplos)
- [Playground Interactivo](#playground-interactivo)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `Date \| string` | `undefined` | Valor seleccionado actual. |
| `view` | `datePickerViewType` | `undefined` | Vista controlada externamente (`day`, `month`, `year`). |
| `weekStart` | `number` | `1` | Dia inicial de semana (`0` domingo, `1` lunes, etc.). |
| `format` | `string` | `undefined` | Formato de texto usado para la fecha del encabezado. |
| `lng` | `suportedLng` | `locale global` | Idioma usado por nombres de meses y dias. Si no se pasa, usa el locale configurado en `app.use(NuvexUI, { locale })`. |
| `color` | `string` | `'primary'` | Color base para estados visuales. |
| `elevation` | `ElevationLevel` | `undefined` | Aplica sombra al contenedor del picker. |
| `gridButtonElevation` | `ElevationLevel` | `undefined` | Aplica sombra a los botones seleccionados de dias, meses y anios. |
| `landscape` | `boolean` | `false` | Activa layout horizontal (`e-picker--landscape`). |
| `noTitle` | `boolean` | `false` | Oculta el bloque superior con anio y fecha. |
| `onlyYear` | `boolean` | `false` | Limita la seleccion a anio. |
| `onlyMonth` | `boolean` | `false` | Limita la seleccion a mes. |
| `closeOnChange` | `boolean` | `false` | Cierra menu/dialog al seleccionar un valor. |
| `iconPrev` | `string \| IconPath \| IconPath[]` | `undefined` | Icono personalizado para el boton anterior. |
| `iconNext` | `string \| IconPath \| IconPath[]` | `undefined` | Icono personalizado para el boton siguiente. |
| `disabled` | `DatesConfiguration` | `undefined` | Fechas, rangos o reglas para bloquear seleccion. |
| `highlighted` | `DatesConfiguration` | `undefined` | Fechas, rangos o reglas para resaltar. |

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `Date \| string` | Emitido al seleccionar una fecha/mes/anio valido. |
| `update:view` | `datePickerViewType` | Emitido cuando cambia la vista activa. |
| `click:day` | `Day` | Emitido al hacer click en un dia (incluye deshabilitados). |

## Slots

| Slot | Descripcion |
| --- | --- |
| `title` | Reemplaza el bloque superior del picker. |
| `header` | Reemplaza navegacion superior (prev/subheader/next). |

## Ejemplos

### Basico

```vue
<template>
  <EDatePicker v-model="value" />
</template>
```

### Locale por defecto desde plugin

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NuvexUI } from 'nuvex-ui'

const app = createApp(App)

app.use(NuvexUI, {
  locale: 'fr',
})

app.mount('#app')
```

Con esa configuracion, `EDatePicker` usara `fr` por defecto sin necesidad de pasar `lng` en cada instancia.

### Override por instancia

```vue
<template>
  <EDatePicker v-model="value" lng="es" />
</template>
```

## DateBuilder y formato

`DateBuilder` (internamente `UtilDate`) comparte el mismo locale por defecto de la libreria.

```ts
import { DateBuilder } from 'nuvex-ui'

const date = new DateBuilder(new Date())
console.log(date.format('week-dddd month-mmmm year-YYYY'))
```

Notas:

- `format` mantiene el contrato de tokens actual (`week-*`, `month-*`, `year-*`, `hour-*`, `minutes-*`, `nth-su`).
- La funcion ahora reemplaza todas las ocurrencias del token en la cadena (no solo la primera).
- Si pasas locale regional como `es-MX`, el sistema intenta resolver primero `es-mx` y luego `es`.

### Con fechas deshabilitadas y resaltadas

```vue
<template>
  <EDatePicker
    v-model="value"
    :disabled="disabledConfig"
    :highlighted="highlightedConfig"
    color="secondary"
    elevation="md"
    grid-button-elevation="sm"
  />
</template>
```

### Layout horizontal completo

```vue
<template>
  <EDatePicker
    v-model="value"
    landscape
    color="secondary"
  />
</template>
```

### Solo mes en layout horizontal

```vue
<template>
  <EDatePicker
    v-model="value"
    only-month
    landscape
    :week-start="1"
  />
</template>
```

## Playground Interactivo

<DatePickerDocsDemo />

## Accesibilidad

- Usa estructura ARIA tipo grid para dias, meses y anios.
- Expone `aria-selected`, `aria-disabled` y `aria-current="date"` en dias cuando aplica.
- Soporta navegacion por flechas en grids y salta celdas deshabilitadas.
- Incluye region `aria-live="polite"` para anunciar cambios de periodo al navegar.

## Errores comunes

- Usar `closeOnChange` fuera de `EDialog`/`EMenu`: no hay nada que cerrar y no veras efecto.
- Esperar que `view` sea solo interno: si pasas `view`, escucha `update:view` para mantener controlado el estado.
- Configurar `disabled` con objetos sin fechas validas (`Date`): la regla no se aplicara como esperas.

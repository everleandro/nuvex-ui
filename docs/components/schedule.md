# ESchedule

## Objetivo

`ESchedule` resuelve vistas de agenda con dos modelos de navegación distintos: calendario (`ScheduleView.Calendar` con escalas `CalendarScale.Day` y `CalendarScale.Week`) y recursos (`ScheduleView.Resource`). Permite renderizar eventos, slots vacíos interactivos, selección de espacio y personalización del header mediante el slot `toolbar`.

`EScheduleToolbar` es un componente auxiliar opcional para consumir ese slot con una barra ya integrada para cambiar vista, navegar periodos, abrir picker de fecha y paginar recursos.

## Importacion

```ts
import {
  CalendarScale,
  ESchedule,
  EScheduleToolbar,
  ScheduleView,
} from 'nuvex-ui'
```

Los props `view` y `scale` siguen aceptando los valores serializados (`"calendar"`, `"resource"`, `"day"`, `"week"`), pero la libreria ahora exporta `ScheduleView` y `CalendarScale` para reutilizarlos en estado, watchers, tests y componentes consumidores.

## Navegacion Rapida

- [Props](#props)
- [Eventos](#eventos)
- [Slots](#slots)
- [EScheduleToolbar](#escheduletoolbar)
- [Ejemplos](#ejemplos)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `Date` | requerida | Fecha base de la vista actual. |
| `view` | `ScheduleView` | `ScheduleView.Calendar` interno | Define el modo principal del schedule. |
| `scale` | `CalendarScale` | `CalendarScale.Day` interno | Escala activa cuando `view="calendar"`. |
| `spaces` | `ScheduleSpace[]` | `[]` | Espacios o recursos visibles en la agenda. |
| `selectedSpace` | `ScheduleSpace \| undefined` | `undefined` | Espacio seleccionado en vistas que lo requieren. Si falta en `CalendarScale.Day` o `CalendarScale.Week`, usa el primero disponible. |
| `events` | `ScheduleEvent[]` | `[]` | Eventos renderizados dentro de la grilla. `event.color` debe existir en la paleta o tokens del sistema para resolver fondo y contraste. |
| `resourceColumns` | `string \| number` | `undefined` | Cantidad de columnas visibles por página en vista `ScheduleView.Resource`. |
| `loading` | `boolean` | `false` | Desactiva interacción y muestra `EProgressLinear` en el header. |
| `color` | `string` | `'primary'` | Color base del componente y acciones internas. |
| `lng` | `suportedLng` | `locale global` | Idioma usado para labels del header y del toolbar. Si no se pasa, usa el locale configurado en `app.use(NuvexUI, { locale })`. |
| `rowHeight` | `string \| number` | `'97'` | Altura visual por bloque de tiempo. |
| `stickyTopHeader` | `string \| number` | `0` | Offset superior cuando el header se vuelve sticky. Para verlo en accion debe existir un contenedor scrollable sobre el que el header pueda fijarse. |
| `step` | `number` | `3600` | Duración de cada celda en segundos. |
| `start` | `number` | `0` | Inicio del rango visible en segundos desde `00:00`. |
| `end` | `number` | `86400` | Fin del rango visible en segundos desde `00:00`. |
| `elevation` | `ElevationLevel` | `undefined` | Sombra aplicada al contenedor principal, igual que en `ECard`. |
| `eventElevation` | `ElevationLevel \| 'none'` | `'md'` | Sombra aplicada al wrapper visual de cada evento, incluyendo eventos renderizados mediante el slot `event`. Usa `'none'` para quitarla explicitamente. |

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `Date` | Emitido cuando cambia la fecha base. |
| `update:view` | `ScheduleView` | Emitido cuando cambia entre `ScheduleView.Calendar` y `ScheduleView.Resource`. |
| `update:scale` | `CalendarScale` | Emitido cuando cambia entre `CalendarScale.Day` y `CalendarScale.Week`. |
| `update:selected-space` | `ScheduleSpace \| undefined` | Emitido al seleccionar un espacio desde header o toolbar. |
| `click:header` | `{ view, scale?, date, entityId? }` | Emitido al interactuar con encabezados de día o recurso. |
| `click:event` | `{ data, nativeEvent }` | Emitido al hacer click sobre un evento renderizado. |
| `click:empty-slot` | `{ data, nativeEvent }` | Emitido al hacer click sobre un bloque vacío. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `toolbar` | Permite inyectar una barra superior. Recibe `ScheduleToolbarSlotProps` con estado, labels localizadas y callbacks de navegación. |
| `event` | Personaliza el render de cada evento. Recibe `{ event }`. El wrapper visual sigue aplicando `eventElevation` y las variables CSS resueltas desde `event.color`. |
| `empty-slot` | Personaliza el render de cada bloque vacío. Recibe `{ data }`. |

### Contracto de `toolbar`

El slot `toolbar` recibe, entre otras, estas propiedades:

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `date` | `Date` | Fecha base actual. |
| `locale` | `string` | Idioma actual (`en`, `es`, `fr`). |
| `color` | `string` | Color heredado por la toolbar para selects, menu y acciones internas. |
| `labels` | `ScheduleToolbarLabels` | Labels ya resueltas para UI y accesibilidad. |
| `view` | `ScheduleView` | Vista activa. |
| `scale` | `CalendarScale` | Escala activa en vista calendario. |
| `selectedSpace` | `ScheduleSpace \| undefined` | Espacio seleccionado actual. |
| `spaces` | `ScheduleSpace[]` | Lista de espacios disponibles. |
| `canReturnToWeek` | `boolean` | Indica si debe mostrarse la acción de volver a semana. |
| `canPaginateResources` | `boolean` | Indica si la vista `ScheduleView.Resource` necesita paginación. |
| `resourcePage` | `number` | Página actual de recursos. |
| `resourcePageCount` | `number` | Cantidad total de páginas de recursos. |
| `setDate` | `(value) => void` | Cambia la fecha base. |
| `setView` | `(value) => void` | Cambia `view`. |
| `setScale` | `(value) => void` | Cambia `scale`. |
| `setSelectedSpace` | `(value) => void` | Cambia el espacio seleccionado. |
| `goToToday` | `() => void` | Va a hoy. |
| `goToPreviousPeriod` | `() => void` | Retrocede un día o una semana según la escala actual. |
| `goToNextPeriod` | `() => void` | Avanza un día o una semana según la escala actual. |
| `returnToWeekView` | `() => void` | Vuelve a `CalendarScale.Week` después de drill-down desde `CalendarScale.Week` a `CalendarScale.Day`. |
| `goToPreviousResourcePage` | `() => void` | Retrocede página de recursos. |
| `goToNextResourcePage` | `() => void` | Avanza página de recursos. |

## EScheduleToolbar

`EScheduleToolbar` es un consumidor por defecto del slot `toolbar`. No administra estado propio: espera exactamente las props entregadas por `ESchedule` en ese slot.

Comportamiento:

- Usa `EBar` como contenedor.
- Muestra selector de vista (`CalendarScale.Day`, `CalendarScale.Week`, `ScheduleView.Resource`).
- Muestra selector de espacio solo en vista calendario cuando hay espacios disponibles.
- Muestra paginación solo cuando la vista de recursos necesita más de una página.
- Abre `EDatePicker` desde un `EButton` con el periodo actual como label.
- Respeta `lng` mediante `labels` y `locale` entregados por `ESchedule`.

No renderiza por defecto acciones de `goToPreviousPeriod`, `goToNextPeriod`, `goToToday` ni `returnToWeekView`. Esas capacidades siguen estando disponibles en `ScheduleToolbarSlotProps` para toolbars custom.

Uso recomendado:

```vue
<template>
  <ESchedule v-model="date" :spaces="spaces" :events="events">
    <template #toolbar="toolbar">
      <EScheduleToolbar v-bind="toolbar" />
    </template>
  </ESchedule>
</template>
```

## Ejemplos

### Basico en calendario diario

```vue
<script setup lang="ts">
import { CalendarScale, ScheduleView } from 'nuvex-ui'
</script>

<template>
  <ESchedule
    v-model="date"
    :view="ScheduleView.Calendar"
    :scale="CalendarScale.Day"
    :spaces="spaces"
    :selected-space="selectedSpace"
    :events="events"
    :start="8 * 60 * 60"
    :end="18 * 60 * 60"
    :step="60 * 60"
  />
</template>
```

### Vista de recursos con toolbar integrada

```vue
<script setup lang="ts">
import { ScheduleView } from 'nuvex-ui'
</script>

<template>
  <ESchedule
    v-model="date"
    :view="ScheduleView.Resource"
    :spaces="spaces"
    :events="events"
    :resource-columns="3"
    lng="es"
  >
    <template #toolbar="toolbar">
      <EScheduleToolbar v-bind="toolbar" />
    </template>
  </ESchedule>
</template>
```

### Toolbar custom usando slot props

```vue
<template>
  <ESchedule v-model="date" :spaces="spaces" :events="events">
    <template #toolbar="toolbar">
      <div class="my-schedule-toolbar">
        <button type="button" @click="toolbar.goToPreviousPeriod()">
          {{ toolbar.labels.previousPeriod }}
        </button>
        <strong>{{ toolbar.date.toDateString() }}</strong>
        <button type="button" @click="toolbar.goToNextPeriod()">
          {{ toolbar.labels.nextPeriod }}
        </button>
      </div>
    </template>
  </ESchedule>
</template>
```

### Slots de evento y empty-slot

```vue
<template>
  <ESchedule v-model="date" :spaces="spaces" :selected-space="selectedSpace" :events="events">
    <template #event="{ event }">
      <article class="custom-event-card">
        <strong>{{ event.name }}</strong>
        <small>{{ event.subtitle }}</small>
      </article>
    </template>

    <template #empty-slot="{ data }">
      <button type="button" class="custom-empty-slot" @click="createEvent(data)">
        +
      </button>
    </template>
  </ESchedule>
</template>
```

## Accesibilidad

- El contenedor principal expone `role="region"` y `aria-busy` cuando `loading` es `true`.
- Los eventos y slots vacíos por defecto se renderizan como botones reales, no como celdas falsas con roles de grid.
- El toolbar recibe labels localizadas para mantener consistencia entre texto visible y atributos ARIA.
- El drill-down `CalendarScale.Week -> CalendarScale.Day` conserva una acción explícita para volver a semana.
- En `ScheduleView.Resource`, seleccionar un encabezado de recurso permite volver a la vista calendario con ese espacio seleccionado.
- Cuando `stickyTopHeader` se usa sin un contenedor con scroll observable, el header no mostrará un efecto sticky visible aunque el prop esté configurado.

## Errores comunes

- Pasar `scale` esperando efecto cuando `view="resource"`: en esa vista `scale` no controla el layout principal.
- No enviar `spaces` en `day` o `week`: el filtro por espacio necesita al menos un recurso disponible para resolver eventos y empty slots.
- Usar `resourceColumns` sin escuchar el toolbar o sin dejar acciones internas visibles: si sustituyes el `toolbar`, tu barra debe exponer navegación de páginas si hay más de una.
- Intentar usar `EScheduleToolbar` fuera del slot `toolbar` sin props equivalentes: el componente no crea estado interno y depende del contrato `ScheduleToolbarSlotProps`.
- Pasar colores hardcodeados en `event.color`: el schedule resuelve fondo y contraste desde la paleta del sistema, por lo que el color debe existir en los tokens o variables de la libreria.
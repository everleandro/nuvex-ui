# EDataList

## Objetivo

`EDataList` es una primitiva de layout para listas de registros tipo dashboard: cada fila se ve como un card,
pero todas comparten la misma definicion de columnas, asi que quedan perfectamente alineadas.

No es un `<table>` ni un data-grid: no incluye ordenamiento, filtrado, paginacion ni fetching. Esas
responsabilidades quedan del lado de la aplicacion.

Usalo cuando necesites contenido muy personalizado por celda (avatares, chips, botones, progreso) sin perder
la alineacion por columnas.

## Importacion

```ts
import { EDataList, EDataHeader, EDataRow, EDataCell } from 'nuvex-ui'
```

## Anatomia

```vue
<template>
  <EDataList :columns="4">
    <EDataHeader>
      <EDataCell>Cliente</EDataCell>
      <EDataCell>Estado</EDataCell>
      <EDataCell>Monto</EDataCell>
      <EDataCell>Actualizado</EDataCell>
    </EDataHeader>

    <EDataRow>
      <EDataCell>Acme Corp</EDataCell>
      <EDataCell>Activo</EDataCell>
      <EDataCell>$12,450</EDataCell>
      <EDataCell>20 ago 2026</EDataCell>
    </EDataRow>
  </EDataList>
</template>
```

## Props

### `EDataList`

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `columns` | `number \| string[]` | `undefined` | Numero de columnas iguales o lista explicita de tracks. Sin valor se usa `repeat(auto-fit, minmax(0, 1fr))`. |
| `outlined` | `boolean` | `false` | Convierte la lista en un panel con borde y fondo propios. |
| `elevation` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `undefined` | Eleva la caja de la lista aplicando `e-elevation--{valor}`. |
| `divided` | `boolean` | `false` | Elimina el gap y separa las filas con una linea. Aplana las filas salvo que definas `rowElevation`. |
| `rowElevation` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'none'` | `'sm'` | Elevacion heredada por las filas. |
| `rowOutlined` | `boolean` | `false` | Borde heredado por las filas. |
| `ariaLabel` | `string` | `undefined` | Etiqueta accesible de la lista. |

### `EDataHeader`

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `sticky` | `boolean` | `false` | Fija el encabezado al hacer scroll dentro de un contenedor con overflow. |

### `EDataRow`

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `elevation` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'none'` | heredado, si no `'sm'` | Elevacion de la fila. `none` la aplana. |
| `outlined` | `boolean` | heredado, si no `false` | Borde de la fila. |
| `clickable` | `boolean` | `false` | Activa cursor, hover, foco visible y teclado (Enter / Espacio). |
| `selected` | `boolean` | `false` | Marca la fila con el color de acento del tema. |
| `disabled` | `boolean` | `false` | Desactiva interaccion y atenua el contenido. |

`elevation` y `outlined` siguen el mismo contrato que `EExpansionPanels` -> `EExpansionPanel`: la prop de la fila
gana sobre lo que provee `EDataList`. Como los valores por defecto son `undefined` y no `false`, puedes apagar de
forma explicita lo heredado con `:outlined="false"` o `elevation="none"`.

### `EDataCell`

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alinea el contenido dentro de la celda. |

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `click:row` | `MouseEvent \| KeyboardEvent` | Emitido por `EDataRow` cuando es `clickable`. No se dispara si el evento nace de un control interactivo dentro de una celda. |

## Slots

| Slot | Componente | Descripcion |
| --- | --- | --- |
| `default` | `EDataList` | Encabezado y filas. |
| `default` | `EDataHeader` | Celdas de encabezado. |
| `default` | `EDataRow` | Celdas de la fila. |
| `default` | `EDataCell` | Contenido libre. |

## Ejemplos

### Basico

```vue
<template>
  <EDataList :columns="3" aria-label="Facturas">
    <EDataHeader>
      <EDataCell>Cliente</EDataCell>
      <EDataCell>Estado</EDataCell>
      <EDataCell align="end">Monto</EDataCell>
    </EDataHeader>

    <EDataRow v-for="invoice in invoices" :key="invoice.id">
      <EDataCell>{{ invoice.customer }}</EDataCell>
      <EDataCell>{{ invoice.status }}</EDataCell>
      <EDataCell align="end">{{ invoice.amount }}</EDataCell>
    </EDataRow>
  </EDataList>
</template>
```

### Columnas dinamicas iguales

Un numero genera `repeat(n, minmax(0, 1fr))`. No hay maximo de columnas.

```vue
<template>
  <EDataList :columns="6">
    <EDataRow>
      <EDataCell v-for="cell in 6" :key="cell">Col {{ cell }}</EDataCell>
    </EDataRow>
  </EDataList>
</template>
```

### Anchos personalizados

Un arreglo se une tal cual para formar `grid-template-columns`.

```vue
<template>
  <EDataList
    :columns="[
      'minmax(220px, 2fr)',
      'minmax(100px, 1fr)',
      '140px',
      '48px'
    ]"
  >
    <EDataRow>
      <EDataCell>Acme Corp</EDataCell>
      <EDataCell>Activo</EDataCell>
      <EDataCell align="end">$12,450</EDataCell>
      <EDataCell align="end">
        <EButton :icon="icons.dotsMenu" aria-label="Acciones" text />
      </EDataCell>
    </EDataRow>
  </EDataList>
</template>
```

### Contenido enriquecido

```vue
<template>
  <EDataRow>
    <EDataCell>
      <EAvatar :src="customer.avatar" />

      <div>
        <strong>{{ customer.name }}</strong>
        <small>{{ customer.email }}</small>
      </div>
    </EDataCell>

    <EDataCell>
      <EChip color="success">Activo</EChip>
    </EDataCell>

    <EDataCell align="end">$12,450</EDataCell>
  </EDataRow>
</template>
```

### Filas clickeables y seleccionadas

```vue
<template>
  <EDataList :columns="3">
    <EDataRow
      v-for="invoice in invoices"
      :key="invoice.id"
      clickable
      :selected="selectedId === invoice.id"
      @click:row="selectedId = invoice.id"
    >
      <EDataCell>{{ invoice.customer }}</EDataCell>
      <EDataCell>{{ invoice.status }}</EDataCell>
      <EDataCell align="end">
        <EButton text @click="openInvoice(invoice)">Ver</EButton>
      </EDataCell>
    </EDataRow>
  </EDataList>
</template>
```

El click sobre el `EButton` de la ultima celda no dispara `click:row`.

### Presets visuales

El default es **elevated**: filas con `e-elevation--sm` y sin borde.

```vue
<template>
  <!-- Cards con borde -->
  <EDataList :columns="3" row-outlined row-elevation="none">
    <EDataRow>...</EDataRow>
  </EDataList>

  <!-- Panel tipo tabla: contenedor con caja propia y filas planas separadas por lineas -->
  <EDataList :columns="3" outlined divided>
    <EDataHeader sticky>...</EDataHeader>
    <EDataRow>...</EDataRow>
  </EDataList>

  <!-- Una fila puede romper la herencia -->
  <EDataList :columns="3" row-elevation="none" row-outlined>
    <EDataRow elevation="md" :outlined="false">Destacada</EDataRow>
    <EDataRow>Normal</EDataRow>
  </EDataList>
</template>
```

## Tokens

Todos los valores visuales salen de tokens semanticos, por lo que el componente funciona igual en tema claro y
oscuro sin configuracion adicional.

| Token | Fallback | Descripcion |
| --- | --- | --- |
| `--e-data-list-columns` | `repeat(auto-fit, minmax(0, 1fr))` | Definicion de columnas, escrita por `EDataList` y heredada por header y filas. |
| `--e-data-list-gap` | `calc(var(--e-space-base) * 2)` | Separacion vertical entre filas. |
| `--e-data-list-column-gap` | `calc(var(--e-space-base) * 4)` | Separacion entre columnas. |
| `--e-data-list-background` | `var(--e-color-surface-base)` | Fondo de la caja de la lista en modo `outlined` o con `elevation`. |
| `--e-data-list-border-color` | `var(--e-color-border)` | Borde de la caja de la lista. |
| `--e-data-list-border-radius` | `var(--e-border-radius-root)` | Radio de la caja de la lista. |
| `--e-data-header-color` | `var(--e-text-muted)` | Color del encabezado. |
| `--e-data-header-background` | `var(--e-color-surface-canvas)` | Fondo del encabezado en modo `sticky`. |
| `--e-data-row-background` | `var(--e-color-surface-base)` | Fondo de la fila. |
| `--e-data-row-color` | `var(--e-contrast-surface-base)` | Texto de la fila. |
| `--e-data-row-border-color` | `var(--e-color-border)` | Borde de la fila. |
| `--e-data-row-border-radius` | `var(--e-border-radius-root)` | Radio de la fila. |
| `--e-data-row-padding-inline` | `calc(var(--e-space-base) * 4)` | Padding horizontal compartido por header y filas. |
| `--e-data-row-padding-block` | `calc(var(--e-space-base) * 3)` | Padding vertical de la fila. |
| `--e-data-row-selected-color` | `var(--e-color-primary)` | Color de acento para `selected` y foco. |
| `--e-data-cell-gap` | `calc(var(--e-space-base) * 2)` | Separacion entre elementos dentro de una celda. |

## Accesibilidad

- `EDataList` usa `role="list"` y `EDataRow` `role="listitem"`. Se modela como lista de registros y no como
  `role="table"` porque las celdas admiten contenido interactivo arbitrario (botones, links, campos), lo que
  invalida la semantica de tabla ARIA.
- `EDataHeader` es `role="presentation"`: sus etiquetas son una ayuda visual. Si una columna necesita ser
  entendible fuera de contexto, agrega texto accesible dentro de la celda de la fila (por ejemplo un
  `aria-label` en el control o texto visualmente oculto).
- Cuando `EDataRow` es `clickable` cambia a `role="button"`, recibe `tabindex="0"`, expone `aria-pressed` con
  el estado `selected` y responde a Enter y Espacio.
- Con `disabled` la fila expone `aria-disabled` y `tabindex="-1"`.
- Usa siempre `ariaLabel` en `EDataList` cuando haya mas de una lista en la pantalla.

## Errores comunes

- Definir `grid-template-columns` en la fila: rompe la alineacion entre filas. La definicion debe vivir solo en
  `EDataList`.
- Usar `:outlined="false"` esperando heredar el valor del contenedor: `false` es explicito y siempre gana. Para
  heredar, no declares la prop.
- Usar unidades fijas para todas las columnas provoca overflow horizontal. Prefiere `minmax(0, 1fr)` o
  `minmax(<min>, <fr>)`.
- Hacer todas las filas `clickable` cuando la fila no navega ni selecciona nada; deja la accion en un control
  dentro de una celda.

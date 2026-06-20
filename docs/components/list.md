# EList, EListItem y EListGroup

## Objetivo

`EList` provee una estructura de lista para navegacion, seleccion simple o multiple y grupos expandibles.

`EListItem` representa cada fila interactiva o informativa dentro de la lista.

`EListGroup` permite construir secciones colapsables y grupos anidados, utiles para sidebars, menus de documentacion y paneles de navegacion.

## Importacion

```ts
import { EList, EListItem, EListGroup } from 'nuvex-ui'
```

## Props

### EList

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Deshabilita interaccion de toda la lista. |
| `outlined` | `boolean` | `false` | Aplica la variante outlined cuando exista en estilos del contexto. |
| `dense` | `boolean` | `false` | Reduce alturas, paddings y tipografia secundaria. |
| `inset` | `boolean` | `false` | Agrega padding horizontal al contenedor y habilita el border radius visual de los `EListItem`. |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `undefined` | Define el size por defecto de los `EListItem` hijos que no declaren uno propio. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text`. |
| `activeColor` | `string` | `undefined` | Define el color de texto solo cuando el item esta activo (`interactive-element--active`, `router-link-active`, `router-link-exact-active`, `e-list-item--active` o `e-list-item-active`). |
| `elevation` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `undefined` | Aplica una clase `e-elevation--*` al contenedor de la lista. |
| `modelValue` | `string \| number \| Array<string \| number> \| undefined \| null` | `undefined` | Estado de seleccion de items. Si es array, la lista trabaja en multiple seleccion. |
| `group` | `string \| number \| Array<string \| number> \| undefined \| null` | estado interno | Estado de grupos abiertos. Es opcional; si no se pasa, `EList` administra su propio estado. |

### EListItem

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Deshabilita el item. |
| `ripple` | `boolean` | `true` via estilo interactivo | Mantiene compatibilidad con el API del item interactivo. |
| `prependIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al inicio. |
| `appendIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al final. |
| `prependAvatar` | `string` | `undefined` | Avatar al inicio. |
| `appendAvatar` | `string` | `undefined` | Avatar al final. |
| `isActive` | `boolean` | `undefined` | Fuerza estado activo manual, sin depender del modelo de la lista. |
| `activeClass` | `string` | `'e-list-item--active'` | Clase agregada cuando el item esta activo. |
| `title` | `string` | `undefined` | Titulo principal del item. |
| `subtitle` | `string` | `undefined` | Texto secundario del item. |
| `tag` | `string` | `undefined` | Override del elemento raiz. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text`. |
| `value` | `string \| number` | `undefined` | Valor explicito del item para seleccion. |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `'default'` | Define el tamano del item usando el mismo contrato que `EButton`. |

### EListGroup

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Deshabilita el grupo y su activador. |
| `elevation` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `undefined` | Aplica elevacion al contenedor del grupo. |
| `value` | `string \| number` | `useId()` | Identidad del grupo. Si no se pasa, el componente genera una interna. Para control externo o persistencia, conviene pasar un valor estable. |

## Eventos

### EList

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `ListModelProp` | Emitido al cambiar la seleccion de items. |
| `update:group` | `ListModelProp` | Emitido al abrir o cerrar grupos cuando el estado es controlado desde fuera. |

### EListItem

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `click:item` | `MouseEvent` | Emitido al hacer click en el item. |

## Slots

### EList

| Slot | Descripcion |
| --- | --- |
| `default` | Items y grupos de la lista. |

### EListItem

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal del item. |
| `prepend` | Reemplaza la zona inicial. |
| `append` | Reemplaza la zona final. |

### EListGroup

| Slot | Descripcion |
| --- | --- |
| `activator` | Recibe `attrs` para renderizar el item activador del grupo. |
| `default` | Contenido expandible del grupo. |

## Ejemplos

### Seleccion simple

```vue
<template>
  <EList v-model="selected" color="primary" outlined>
    <EListItem value="inbox" title="Inbox" subtitle="14 unread messages" />
    <EListItem value="drafts" title="Drafts" subtitle="3 items pending review" />
    <EListItem value="archive" title="Archive" subtitle="Everything shipped this week" />
  </EList>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref('inbox')
</script>
```

### Seleccion multiple

```vue
<template>
  <EList v-model="selected" dense color="secondary" size="small">
    <EListItem value="xs" title="xSmall item" size="x-small" />
    <EListItem value="sm" title="Small item" />
    <EListItem value="lg" title="Large item" size="large" />
  </EList>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(['sm'])
</script>
```

En este ejemplo, el segundo item hereda `size="small"` desde `EList`, mientras que el primero y el tercero lo sobreescriben localmente.

### Item enlazado a router

```vue
<template>
  <EList color="primary">
    <EListItem to="/components/list" title="List docs" />
    <EListItem :to="{ name: 'components-button' }" title="Button docs" />
  </EList>
</template>
```

Si no pasas `value`, `EListItem` intenta usar `to`, `to.path` o `to.name` como identidad del item antes de caer a un id interno.

### Grupo basico

```vue
<template>
  <EList v-model:group="openedGroups" color="primary">
    <EListGroup value="components">
      <template #activator="{ attrs }">
        <EListItem v-bind="attrs" title="Components" subtitle="Nivel raiz" />
      </template>

      <EListItem title="Button" />
      <EListItem title="List" />
    </EListGroup>
  </EList>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openedGroups = ref(['components'])
</script>
```

### Grupos anidados

```vue
<template>
  <EList v-model:group="openedGroups" color="primary" outlined>
    <EListGroup value="components">
      <template #activator="{ attrs }">
        <EListItem v-bind="attrs" title="Components" />
      </template>

      <EListGroup value="navigation">
        <template #activator="{ attrs }">
          <EListItem v-bind="attrs" title="Navigation" />
        </template>

        <EListItem title="List" />
        <EListItem title="Tabs" />
      </EListGroup>
    </EListGroup>
  </EList>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openedGroups = ref(['components', 'components/navigation'])
</script>
```

Internamente, los grupos anidados usan rutas jerarquicas para evitar colisiones entre ramas.

## Accesibilidad

- `EList` usa semantica de `listbox` cuando trabaja como lista seleccionable y mantiene semantica nativa de lista en los casos no seleccionables.
- `EListItem` soporta foco administrado, `Enter`, `Space`, `ArrowUp`, `ArrowDown`, `Home` y `End`.
- En listas agrupadas, `ArrowRight` y `ArrowLeft` navegan entre niveles:
  - `ArrowRight` expande el grupo o entra al primer hijo visible.
  - `ArrowLeft` colapsa el grupo o vuelve al activador padre.
- En activadores de grupo, `Enter` y `Space` hacen toggle del grupo.
- Si el item tiene `title` y `subtitle`, el componente expone `aria-labelledby` y `aria-describedby` automaticamente.

## Errores comunes

- Esperar que `v-model:group` sea obligatorio. No lo es; la lista mantiene estado interno para grupos si no lo pasas.
- Usar grupos anidados controlados sin `value` estable y luego intentar persistir la rama abierta. En esos casos conviene pasar `value` explicito.
- Esperar que `color` cambie el fondo del item: hoy afecta el color de texto y el underlay usa `currentColor`.
- Suponer que `ArrowRight` y `ArrowLeft` equivalen a seleccion. En grupos se usan para navegacion estructural; `Enter` y `Space` activan o hacen toggle.
- Esperar controlar el tamano del avatar con un prop dedicado: el avatar interno sigue el layout y las variables CSS del item.
- Forzar layout custom con `prepend` o `append` sin probar estados hover/focus en ancho completo. La indentacion anidada vive en el `li`, no en el contenedor interno.
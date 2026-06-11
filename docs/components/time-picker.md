# ETimePicker

## Objetivo

`ETimePicker` permite editar horas y minutos dentro de un `field` compartido, con soporte de menu incremental, escritura manual por segmentos, navegacion por teclado y control por `v-model`.

## Importacion

```ts
import { ETimePicker } from 'nuvex-ui'
```

## Navegacion Rapida

- [Props](#props)
- [Eventos](#eventos)
- [Metodos expuestos](#metodos-expuestos)
- [Slots](#slots)
- [Ejemplos](#ejemplos)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `Date \| string` | `undefined` | Valor actual del componente. Si se pasa `string`, debe ser un valor parseable por `Date`. Internamente trabaja con horas y minutos del valor recibido. |
| `hoursStep` | `number` | `1` | Cantidad usada por las flechas del menu para incrementar o decrementar horas. |
| `minutesStep` | `number` | `15` | Cantidad usada por las flechas del menu para incrementar o decrementar minutos. |
| `hourReadonly` | `boolean` | `false` | Vuelve readonly solo el segmento de horas. |
| `minuteReadonly` | `boolean` | `false` | Vuelve readonly solo el segmento de minutos. |
| `minReadonly` | `boolean` | `false` | Alias legado de `minuteReadonly`. Se mantiene por compatibilidad. |
| `arrowDown` | `string \| IconPath \| IconPath[]` | `undefined` | Reemplaza el icono decorativo del activador. |

Ademas hereda las props base de campo definidas por `FieldBaseProps`, como `label`, `detail`, `color`, `outlined`, `disabled`, `readonly`, `labelBehavior`, `prependIcon`, `appendIcon`, `inputAlign` y props de grid como `cols` o `md`.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `Date \| string` | Emitido cuando cambia un segmento a un valor valido o cuando se usan las flechas del menu. |
| `focus` | `FocusEvent` | Emitido al enfocar uno de los segmentos internos. |
| `blur` | `FocusEvent` | Emitido cuando el foco abandona por completo el control. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el control. Internamente dirige el foco al segmento de horas. |
| `blur()` | `void` | Quita foco del control. |
| `validate()` | `boolean` | Ejecuta validacion del field. |
| `reset()` | `void` | Restablece valor y estado interno. |
| `resetValidation()` | `void` | Limpia solo el estado de validacion. |

Tambien expone las refs `hours` y `minutes` si necesitas acceso directo a los inputs internos.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta del campo. |
| `separator` | Reemplaza el separador visual entre horas y minutos, tanto en el campo como en el menu. |

## Ejemplos

### Basico

```vue
<template>
  <ETimePicker v-model="value" label="Hora" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(new Date())
</script>
```

### Con label flotante y pasos personalizados

```vue
<template>
  <ETimePicker
    v-model="reviewTime"
    label="Revision"
    label-behavior="floating"
    outlined
    :hours-step="2"
    :minutes-step="5"
    detail="Ajusta ventanas en bloques de 2h y 5m."
  />
</template>
```

### Segmento de minutos en readonly

```vue
<template>
  <ETimePicker
    v-model="publishAt"
    label="Publicacion"
    :minute-readonly="true"
  />
</template>
```

### Separador personalizado

```vue
<template>
  <ETimePicker v-model="value" label="Duracion interna">
    <template #separator>
      <span>h</span>
    </template>
  </ETimePicker>
</template>
```

## Accesibilidad

- El control usa una etiqueta visible asociada al campo y agrupa los segmentos internos con `role="group"`.
- El segmento de horas expone `aria-label="Hours"` y el de minutos `aria-label="Minutes"`.
- Cuando el campo tiene detalles visibles, ambos segmentos quedan asociados a `aria-describedby`.
- Soporta navegacion por teclado entre segmentos con `ArrowLeft`, `ArrowRight`, `Enter`, `ArrowUp`, `ArrowDown` y `Escape`.
- Los iconos `prepend`, `append` y el icono de flecha del activador son decorativos en este componente.

## Errores comunes

- Pasar `disabled` esperando solo bloquear escritura manual: en `ETimePicker` tambien bloquea la apertura del menu.
- Usar `minReadonly` en codigo nuevo: funciona, pero el nombre recomendado es `minuteReadonly`.
- Pasar strings ambiguos como `10:30` o dependientes de locale en `modelValue`: usa un `Date` o una cadena parseable por `Date` de forma consistente, idealmente ISO.
- Esperar que `prependIcon` o `appendIcon` emitan eventos: en este componente son solo decorativos.
- Pasar un `modelValue` invalido o vacio esperando que el componente preserve una hora previa interna: `ETimePicker` normaliza el valor y resuelve una fecha segura solo para su logica interna.
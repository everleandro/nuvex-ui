# EForm

## Objetivo

`EForm` coordina configuracion y validacion de campos hijos, expone un `v-model` de validez agregada y permite aplicar reglas visuales compartidas como `outlined`, `disabled`, `readonly`, `fieldColor` y modo tabla.

## Importacion

```ts
import { EForm } from 'nuvex-ui'
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
| `modelValue` | `boolean \| undefined` | `undefined` | Estado agregado de validez del formulario. Se actualiza segun los errores reportados por los fields hijos. |
| `focusFirstInvalid` | `boolean` | `false` | Cuando `validate()` falla, mueve el foco al primer field invalido registrado. |
| `validateOnSubmit` | `boolean` | `false` | Ejecuta `validate()` al enviar el formulario y emite `submit-invalid` si falla. |
| `outlined` | `boolean` | `false` | Propaga estilo outlined a los campos hijos registrados. |
| `disabled` | `boolean` | `false` | Desactiva el formulario y propaga el estado a los fields hijos. |
| `readonly` | `boolean` | `false` | Propaga readonly a los fields hijos. |
| `labelBehavior` | `FieldLabelBehavior` | `undefined` | Configura el comportamiento de labels para los fields hijos. |
| `labelMinWidth` | `string \| number` | `undefined` | Define el ancho minimo de etiqueta compartido para los fields hijos. |
| `retainColor` | `boolean` | `false` | Mantiene color configurado en los fields hijos cuando pierden foco, segun el contrato compartido del sistema de fields. |
| `fieldColor` | `string` | `undefined` | Color compartido para los fields hijos. Si no existe, usa `color`. |
| `color` | `string` | `undefined` | Color base heredado por el formulario. Tambien sirve como fallback para linea de tabla heredada. |
| `table` | `boolean` | `false` | Activa layout tipo tabla entre fields hijos usando el sistema grid. |
| `tableLineColor` | `string` | `undefined` | Color explicito de lineas en modo tabla. |
| `tableCellBackgroundColor` | `string` | `undefined` | Fondo explicito de celdas en modo tabla. |
| `tableFieldColor` | `string` | `undefined` | Alias historico para el fondo de celdas en modo tabla. |
| `tableLineOpacity` | `string \| number` | `undefined` | Opacidad de las lineas del modo tabla. |

Ademas hereda props de `RowProps` y `ElevationProps`, por ejemplo `dense`, `cols`, `justify`, `align`, `noGutters` y `elevation`.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitido cuando cambia el estado agregado de validez del formulario. |
| `submit` | `SubmitEvent` | Emitido al enviar el formulario. Si `validateOnSubmit` es `true`, solo se emite cuando la validacion pasa. |
| `submit-invalid` | `SubmitEvent` | Emitido al enviar el formulario cuando `validateOnSubmit` falla. |

## Metodos expuestos

`EForm` expone estos metodos via `ref`:

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `validate()` | `Promise<boolean>` | Ejecuta `validate()` sobre todos los fields hijos registrados y devuelve si el formulario es valido. |
| `reset()` | `void` | Llama `reset()` en todos los fields hijos registrados. |
| `resetValidation()` | `void` | Limpia el estado de validacion de todos los fields hijos registrados. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido del formulario. Debe contener fields compatibles con el sistema de inyeccion de `EForm` para obtener validacion y configuracion compartida. |

## Ejemplos

### Basico con `v-model`

```vue
<template>
  <EForm v-model="formValid" label-behavior="floating">
    <ETextfield v-model="fullName" label="Nombre" :rules="[(v) => !!v || 'Requerido']" />
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formValid = ref(false)
const fullName = ref('')
</script>
```

### Validacion manual por `ref`

```vue
<template>
  <EForm ref="formRef" :focus-first-invalid="true">
    <ETextfield v-model="email" label="Email" :rules="emailRules" />
  </EForm>

  <EButton @click="validateForm">Validar</EButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const email = ref('')
const emailRules = [(v: string) => !!v || 'Requerido']

const validateForm = async () => {
  const valid = await formRef.value?.validate()
  console.log(valid)
}
</script>
```

### Submit controlado con `validateOnSubmit`

```vue
<template>
  <EForm validate-on-submit @submit="handleSubmit" @submit-invalid="handleInvalid">
    <ETextfield v-model="email" label="Email" :rules="emailRules" />
    <EButton type="submit">Enviar</EButton>
  </EForm>
</template>
```

### Modo tabla

```vue
<template>
  <EForm table table-line-color="teal-900" label-behavior="floating">
    <ETextfield :cols="12" :md="4" label="Codigo" />
    <ETextfield :cols="12" :md="8" label="Descripcion" />
    <ETextfield :cols="12" :md="4" label="Owner" />
    <ETextfield :cols="12" :md="4" label="Estado" />
    <ETextfield :cols="12" :md="4" label="Monto" />
  </EForm>
</template>
```

## Accesibilidad

- `EForm` renderiza un elemento `<form>` nativo, por lo que conserva semantica HTML de envio y agrupacion.
- Cuando usas `validateOnSubmit`, puedes combinarlo con mensajes visibles en los fields para explicar el error antes de reenfocar con `focusFirstInvalid`.
- La accesibilidad final depende de que los fields hijos implementen correctamente label, detalles y estados ARIA.

## Errores comunes

- Esperar que `v-model` refleje el resultado de `validate()` antes de que los fields reporten su estado: la validez agregada depende de los fields hijos registrados.
- Usar `validateOnSubmit` sin boton `type="submit"`: en ese caso no se dispara el flujo nativo del formulario.
- Mezclar fields no integrados con `EForm` esperando propagacion de `outlined`, `disabled`, `readonly` o validacion: solo aplica a componentes que se registran en el sistema de fields.
- Usar `tableFieldColor` en codigo nuevo: funciona como compatibilidad, pero `tableCellBackgroundColor` es mas claro.
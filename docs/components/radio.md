# ERadioGroup y ERadio

## Objetivo

`ERadioGroup` y `ERadio` resuelven seleccion exclusiva dentro del sistema compartido de `field`, con integracion con `EForm`, herencia de configuracion visual, soporte para variantes `row` y `column`, y propagacion centralizada de foco, readonly, disabled y color.

## Importacion

```ts
import { ERadio, ERadioGroup } from 'drocket'
```

## Navegacion Rapida

- [Props de ERadioGroup](#props-de-eradiogroup)
- [Props de ERadio](#props-de-eradio)
- [Eventos](#eventos)
- [Metodos expuestos](#metodos-expuestos)
- [Slots](#slots)
- [Ejemplos](#ejemplos)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props de ERadioGroup

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null \| undefined` | `undefined` | Valor seleccionado actualmente dentro del grupo. |
| `mandatory` | `boolean` | `false` | Cuando esta activo y no existe seleccion valida, intenta inicializar el primer radio disponible al montar. |
| `row` | `boolean` | `false` | Distribuye los radios en horizontal. Cuando no se usa, el grupo se comporta en columna. |
| `showOverlay` | `boolean` | `false` | Muestra el overlay visual del field en el contenedor del grupo. |
Ademas hereda las props base de `SelectionFieldBaseProps`, como `label`, `detail`, `detailErrors`, `detailsOnMessageOnly`, `outlined`, `disabled`, `readonly`, `color`, `retainColor`, `labelBehavior` (sin `floating`), `labelMinWidth` y props de grid como `cols`, `md` o `xl`.

## Props de ERadio

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null \| undefined` | `undefined` | Valor representado por esa opcion individual. Cuando coincide con el `modelValue` del grupo, el radio se considera activo. |
| `label` | `string \| number` | `undefined` | Etiqueta visible de la opcion. |

`ERadio` debe renderizarse dentro de un `ERadioGroup`. No esta pensado como control autonomo fuera de ese contexto.

## Eventos

### ERadioGroup

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null \| undefined` | Emitido cuando cambia la opcion seleccionada. |
| `focus` | `FocusEvent` | Emitido cuando cualquiera de los radios hijos recibe foco. |
| `blur` | `Event` | Emitido cuando el grupo pierde foco efectivo. |

### ERadio

`ERadio` no expone un contrato de eventos publico separado. La interaccion y el valor seleccionado se coordinan desde `ERadioGroup`.

## Metodos expuestos

### ERadioGroup

`ERadioGroup` participa del sistema de `field` compartido, por lo que hereda los metodos expuestos habituales a traves del contenedor del field.

### ERadio

`ERadio` no documenta metodos expuestos como API publica. Su ciclo de vida y configuracion dependen del grupo padre.

## Slots

### ERadioGroup

| Slot | Descripcion |
| --- | --- |
| `default` | Lista de componentes `ERadio` hijos. |
| `label` | Reemplaza el contenido visible de la etiqueta del grupo. |

### ERadio

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta de la opcion. |

## Ejemplos

### Grupo básico en fila

```vue
<template>
  <ERadioGroup v-model="contactMethod" row label="Método de contacto">
    <ERadio model-value="email" label="Email" />
    <ERadio model-value="phone" label="Teléfono" />
    <ERadio model-value="sms" label="SMS" />
  </ERadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const contactMethod = ref<'email' | 'phone' | 'sms'>('email')
</script>
```

### Grupo en columna con detail

```vue
<template>
  <ERadioGroup
    v-model="deploymentEnv"
    label="Ambiente de despliegue"
    detail="Elige dónde se publicarán los cambios"
  >
    <ERadio model-value="staging" label="Staging" />
    <ERadio model-value="production" label="Production" />
    <ERadio model-value="canary" label="Canary (10% traffic)" />
  </ERadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const deploymentEnv = ref<'staging' | 'production' | 'canary'>('staging')
</script>
```

### Con selección obligatoria

```vue
<template>
  <ERadioGroup
    v-model="membershipTier"
    mandatory
    label="Plan de membresía"
    detail-errors
    :rules="[(v) => !!v || 'Debes seleccionar un plan']"
  >
    <ERadio model-value="free" label="Gratuito" />
    <ERadio model-value="pro" label="Pro" />
    <ERadio model-value="enterprise" label="Enterprise" />
  </ERadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const membershipTier = ref<string | null>(null)
</script>
```

### Integrado con EForm

```vue
<template>
  <EForm v-model="formValid" label-behavior="floating">
    <ERadioGroup
      v-model="preferences.releaseTrack"
      label="Canal de actualización"
      detail="Cuándo recibir nuevas versiones"
      color="secondary"
    >
      <ERadio model-value="stable" label="Estable (recomendado)" />
      <ERadio model-value="beta" label="Beta (nuevas features primero)" />
      <ERadio model-value="nightly" label="Nightly (experimental)" />
    </ERadioGroup>

    <ERadioGroup
      v-model="preferences.language"
      row
      label="Idioma"
    >
      <ERadio model-value="es" label="Español" />
      <ERadio model-value="en" label="English" />
      <ERadio model-value="fr" label="Français" />
    </ERadioGroup>
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formValid = ref<boolean | undefined>()
const preferences = ref({
  releaseTrack: 'stable',
  language: 'es'
})
</script>
```

### Con cambios reactivos

```vue
<template>
  <div class="flex-col gap-6">
    <ERadioGroup
      v-model="reportFormat"
      label="Formato del reporte"
      @update:model-value="generateReport"
    >
      <ERadio model-value="pdf" label="PDF" />
      <ERadio model-value="excel" label="Excel" />
      <ERadio model-value="json" label="JSON" />
    </ERadioGroup>

    <div v-if="reportData" class="flex-col gap-2 p-4 rounded blue-100">
      <strong>Reporte en {{ reportFormat.toUpperCase() }}</strong>
      <code class="truncate">{{ reportData }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const reportFormat = ref<'pdf' | 'excel' | 'json'>('pdf')
const reportData = ref<string | null>(null)

const generateReport = async (format: string) => {
  // Simular generación de reporte
  reportData.value = `Generando reporte en ${format}...`
  await new Promise(resolve => setTimeout(resolve, 500))
  reportData.value = `{ "format": "${format}", "timestamp": "${new Date().toISOString()}" }`
}
</script>
```

### Estados combinados

```vue
<template>
  <div class="flex-col gap-4">
    <!-- Normal -->
    <ERadioGroup v-model="mode" label="Modo de operación">
      <ERadio model-value="auto" label="Automático" />
      <ERadio model-value="manual" label="Manual" />
    </ERadioGroup>

    <!-- Deshabilitado -->
    <ERadioGroup
      v-model="legacyMode"
      disabled
      label="Modo heredado (no disponible)"
    >
      <ERadio model-value="v1" label="Version 1" />
      <ERadio model-value="v2" label="Version 2" />
    </ERadioGroup>

    <!-- Readonly -->
    <ERadioGroup
      v-model="systemMode"
      readonly
      label="Modo del sistema (bloqueado)"
      detail="Su administrador ha establecido este valor"
    >
      <ERadio model-value="production" label="Production" />
      <ERadio model-value="sandbox" label="Sandbox" />
    </ERadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mode = ref<'auto' | 'manual'>('auto')
const legacyMode = ref<'v1' | 'v2'>('v1')
const systemMode = ref<'production' | 'sandbox'>('production')
</script>
```

## Accesibilidad

- `ERadioGroup` renderiza un contenedor con `role="radiogroup"` y enlaza etiqueta y detalles mediante `aria-labelledby` y `aria-describedby`.
- Cada `ERadio` usa un `input type="radio"` nativo con `role="radio"`, `aria-checked`, `aria-disabled` y `aria-readonly`.
- El foco se coordina a nivel de grupo, de modo que `focus` y `blur` se emiten desde `ERadioGroup` aunque el elemento enfocado real sea un hijo.
- El area clicable se amplia alrededor de cada opcion sin perder la semantica del input nativo.
- El color y estados visuales de las opciones se resuelven por herencia del contenedor de field compartido.

## Errores comunes

- Usar `ERadio` fuera de `ERadioGroup`: el componente depende del contexto inyectado por el grupo y lanzara un error.
- Esperar que cada `ERadio` tenga `v-model` propio: el estado seleccionado pertenece al grupo.
- Mezclar tipos incompatibles entre `ERadioGroup.modelValue` y los `model-value` de los hijos: la opcion activa depende de una comparacion exacta.
- Esperar comportamiento floating identico en `row` y `column`: el layout del label cambia segun la disposicion y el estado del field.
- Usar variables CSS locales para forzar color en cada opcion: en la arquitectura actual el color y estados se resuelven desde el contenedor `ERadioGroup`.
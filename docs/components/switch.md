# ESwitch

## Objetivo

`ESwitch` representa un valor booleano o binario dentro del sistema de `field` compartido, con soporte para `v-model`, estados `readonly` y `loading`, detalles integrados y exposicion consistente con `EForm`.

## Importacion

```ts
import { ESwitch } from 'drocket'
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
| `modelValue` | `boolean \| string \| number` | `undefined` | Valor actual del switch. Se compara contra `trueValue` para resolver el estado activo. |
| `trueValue` | `boolean \| string \| number` | `true` | Valor emitido cuando el switch se activa. |
| `falseValue` | `boolean \| string \| number` | `false` | Valor emitido cuando el switch se desactiva. |
| `loading` | `boolean` | `false` | Vuelve el control no interactivo y muestra un indicador visual de carga. |
| `hideOverlay` | `boolean` | `false` | Oculta el overlay visual del field. |

Ademas hereda las props base de campo definidas por `FieldBaseProps`, como `label`, `detail`, `rules`, `outlined`, `disabled`, `readonly`, `color`, `labelBehavior`, `labelMinWidth`, `retainColor` y props de grid como `cols`, `md` o `xl`.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `boolean \| string \| number` | Emitido cuando cambia el estado del switch. |
| `focus` | `FocusEvent` | Emitido cuando el control recibe foco. |
| `blur` | `Event` | Emitido cuando el control pierde foco. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el control interno. |
| `blur()` | `void` | Quita el foco del control interno. |
| `validate()` | `boolean` | Ejecuta las reglas del field. |
| `reset()` | `void` | Restablece el valor y el estado interno del field. |
| `resetValidation()` | `void` | Limpia solo el estado de validacion. |

Tambien expone `input` via `ref` si necesitas acceso al `HTMLInputElement` nativo.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta. |

## Ejemplos

### Básico

```vue
<template>
  <ESwitch v-model="notifications" label="Notificaciones" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notifications = ref(false)
</script>
```

### Con valores custom

```vue
<template>
  <ESwitch
    v-model="deploymentStatus"
    label="Publicar cambios"
    true-value="published"
    false-value="draft"
    detail="Controla visibilidad pública"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const deploymentStatus = ref<'published' | 'draft'>('draft')
</script>
```

### Estado de carga (async)

```vue
<template>
  <ESwitch
    v-model="analyticsEnabled"
    label="Analytics en vivo"
    detail="Recolecta datos de sesión"
    :loading="isSaving"
    @update:model-value="saveAnalyticsSetting"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const analyticsEnabled = ref(true)
const isSaving = ref(false)

const saveAnalyticsSetting = async (value: boolean) => {
  isSaving.value = true
  try {
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Guardado:', value)
  } finally {
    isSaving.value = false
  }
}
</script>
```

### Integrado con EForm

```vue
<template>
  <EForm v-model="settingsValid" label-behavior="floating">
    <ESwitch
      v-model="settings.emailNotifications"
      label="Notificaciones por email"
      detail-errors
      color="primary"
    />
    
    <ESwitch
      v-model="settings.pushNotifications"
      label="Notificaciones push"
      detail="Solo en navegadores compatibles"
    />
    
    <ESwitch
      v-model="settings.darkMode"
      label="Modo oscuro"
      @update:model-value="toggleTheme"
    />
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const settingsValid = ref<boolean | undefined>()
const settings = ref({
  emailNotifications: true,
  pushNotifications: false,
  darkMode: false
})

const toggleTheme = (darkMode: boolean) => {
  const theme = darkMode ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
}
</script>
```

### Estados combinados

```vue
<template>
  <div class="flex-col gap-4">
    <!-- Normal -->
    <ESwitch v-model="feature1" label="Característica 1" />
    
    <!-- Deshabilitada -->
    <ESwitch
      v-model="feature2"
      label="Característica 2 (Beta)"
      disabled
      detail="Próximamente disponible"
    />
    
    <!-- Readonly -->
    <ESwitch
      v-model="feature3"
      label="Característica 3 (Requerida)"
      readonly
      detail="No puede ser desactivada"
    />
    
    <!-- Con color -->
    <ESwitch
      v-model="feature4"
      label="Característica 4 (Critical)"
      color="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const feature1 = ref(true)
const feature2 = ref(false)
const feature3 = ref(true)
const feature4 = ref(true)
</script>
```

## Accesibilidad

- Usa un `input type="checkbox"` con `role="switch"` y una etiqueta visible asociada mediante `for`/`id`.
- Cuando hay supporting text visible, lo enlaza mediante `aria-describedby`.
- Expone `aria-invalid`, `aria-disabled`, `aria-readonly` y `aria-busy` segun el estado efectivo del control.
- En `loading` el indicador visual interno es decorativo y no se anuncia como `progressbar`; el estado ocupado se comunica desde el control principal.
- `readonly` se trata como estado no interactivo dentro de este componente para evitar una UX ambigua en controles binarios.

## Errores comunes

- Esperar que `readonly` permita enfocar y cambiar visualmente el switch sin confirmar el valor: en `ESwitch` ese estado se trata como no interactivo.
- Usar `loading` solo como señal visual: en este componente tambien bloquea interaccion y ajusta atributos accesibles.
- Pasar `modelValue` con un tipo que no coincide con `trueValue`/`falseValue`: el estado activo depende de esa comparacion exacta.
- Esperar eventos de `prependIcon` o `appendIcon`: `ESwitch` hereda props base de field, pero este control no renderiza esos iconos como puntos de interaccion.
# ETextfield

## Objetivo

`ETextfield` cubre captura de texto, numeros y cadenas cortas con soporte para validacion, contador, clearable, prefijos/sufijos y eventos ricos de entrada integrados con `EForm`.

## Importacion

```ts
import { ETextfield } from 'drocket'
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
| `modelValue` | `string \| number \| null` | `undefined` | Valor actual del input. |
| `type` | `string` | `'text'` | Tipo nativo del input HTML. |
| `name` | `string` | `undefined` | Atributo `name` del input. |
| `placeholder` | `string` | `undefined` | Placeholder visible cuando no aplica label flotante o cuando el label ya floto. |
| `autocomplete` | `string` | `undefined` | Valor pasado al atributo `autocomplete`. |
| `inputmode` | `TextInputInputMode` | `undefined` | Sugiere teclado virtual apropiado en dispositivos moviles. |
| `inputAlign` | `string` | `'start'` | Alineacion del contenido del input. |
| `inputReadonly` | `boolean` | `false` | Marca el input como readonly sin desactivar el field completo. |
| `disabled` | `boolean` | `false` | Desactiva interaccion. |
| `clearable` | `boolean` | `false` | Muestra control de limpieza cuando hay valor y el field puede limpiarse. |
| `iconClear` | `string \| IconPath \| IconPath[]` | `undefined` | Reemplaza el icono del boton de clear. |
| `limit` | `string \| number` | `undefined` | Limite maximo de caracteres. Tambien alimenta contador si `counter` esta activo. |
| `counter` | `boolean` | `false` | Muestra contador en `EDetails`. |
| `prefix` | `string` | `undefined` | Texto decorativo antes del input. |
| `suffix` | `string` | `undefined` | Texto decorativo despues del input. |
| `spellcheck` | `boolean` | `false` | Controla correccion ortografica nativa. |
| `autocapitalize` | `string` | `undefined` | Pasa el valor al atributo `autocapitalize`. |
| `enterkeyhint` | `TextInputEnterKeyHint` | `undefined` | Sugiere etiqueta/accion del enter virtual en teclado movil. |
| `modelModifiers` | `trim \| number \| lazy` | `{}` | Modificadores compatibles con la logica interna del input. |

Ademas hereda las props base de campo, como `label`, `detail`, `rules`, `outlined`, `readonly`, `prependIcon`, `appendIcon`, `color`, `labelBehavior` y props de grid.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null` | Emitido cuando cambia el valor normalizado del input. |
| `focus` | `FocusEvent` | Emitido al enfocar el input. |
| `blur` | `Event` | Emitido al perder foco. |
| `input` | `TextInputValueEventPayload` | Emitido en cada entrada, con `rawValue`, `value` y `event`. |
| `change` | `TextInputValueEventPayload` | Emitido al cambio nativo del input. |
| `keydown` | `TextInputKeyEventPayload` | Emitido en cualquier `keydown`. |
| `keyup` | `TextInputKeyEventPayload` | Emitido en cualquier `keyup`. |
| `keydown:enter` | `TextInputKeyEventPayload` | Emitido especificamente al presionar Enter. |
| `compositionstart` | `TextInputValueEventPayload<CompositionEvent>` | Inicio de composicion IME. |
| `compositionend` | `TextInputValueEventPayload<CompositionEvent>` | Fin de composicion IME. |
| `click:clear` | `void` | Emitido al usar el control de limpieza. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el input interno. |
| `blur()` | `void` | Quita foco del input interno. |
| `select()` | `void` | Selecciona el texto del input interno. |
| `validate()` | `boolean` | Ejecuta reglas del field. |
| `reset()` | `void` | Restablece valor y estado interno. |
| `resetValidation()` | `void` | Limpia solo el estado de validacion. |

Tambien expone `input` via `ref` si necesitas acceso directo al elemento nativo.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta. |

## Ejemplos

### Básico

```vue
<template>
  <ETextfield v-model="name" label="Nombre completo" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
</script>
```

### Con prefijo, sufijo y contador

```vue
<template>
  <ETextfield
    v-model="price"
    label="Precio"
    type="number"
    prefix="$"
    suffix="USD"
    :limit="10"
    counter
    detail="Máximo 10 dígitos"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const price = ref('')
</script>
```

### Clearable con label flotante

```vue
<template>
  <ETextfield
    v-model="email"
    label="Email"
    type="email"
    label-behavior="floating"
    clearable
    icon-clear="mdi-close"
    autocomplete="email"
    placeholder="usuario@ejemplo.com"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
</script>
```

### Con validación integrada

```vue
<template>
  <EForm v-model="formValid" label-behavior="floating">
    <ETextfield
      v-model="username"
      label="Usuario"
      clearable
      :rules="[
        (v) => !!v || 'Requerido',
        (v) => v.length >= 3 || 'Mínimo 3 caracteres',
        (v) => /^[a-zA-Z0-9_-]+$/.test(v) || 'Solo letras, números, guión y guión bajo'
      ]"
    />

    <ETextfield
      v-model="password"
      label="Contraseña"
      type="password"
      :rules="[
        (v) => !!v || 'Requerido',
        (v) => v.length >= 8 || 'Mínimo 8 caracteres'
      ]"
    />

    <ETextfield
      v-model="confirmPassword"
      label="Confirmar contraseña"
      type="password"
      :rules="[
        (v) => !!v || 'Requerido',
        (v) => v === password || 'Las contraseñas no coinciden'
      ]"
    />
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formValid = ref<boolean | undefined>()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
</script>
```

### Búsqueda con debounce

```vue
<template>
  <div class="flex-col gap-4">
    <ETextfield
      v-model="searchQuery"
      label="Buscar"
      clearable
      prepend-icon="mdi-magnify"
      placeholder="Escribe para buscar..."
      @input="debouncedSearch"
    />

    <div v-if="isSearching" class="text-center">
      Buscando...
    </div>

    <div v-else-if="searchResults.length > 0" class="flex-col gap-2">
      <div v-for="result in searchResults" :key="result.id" class="p-2 rounded border">
        {{ result.name }}
      </div>
    </div>

    <div v-else-if="searchQuery && searchResults.length === 0" class="text-center text-gray-500">
      No se encontraron resultados
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const searchResults = ref<Array<{ id: string; name: string }>>([])
const isSearching = ref(false)

let searchTimeout: NodeJS.Timeout

const debouncedSearch = async (event: any) => {
  clearTimeout(searchTimeout)
  
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    isSearching.value = true
    try {
      // Simular búsqueda en API
      await new Promise(resolve => setTimeout(resolve, 500))
      searchResults.value = [
        { id: '1', name: `Resultado para "${searchQuery.value}"` },
        { id: '2', name: `Otra opción "${searchQuery.value}"` }
      ]
    } finally {
      isSearching.value = false
    }
  }, 300)
}
</script>
```

### Entrada numérica con pasos

```vue
<template>
  <ETextfield
    v-model="quantity"
    label="Cantidad"
    type="number"
    input-mode="numeric"
    :rules="[
      (v) => !!v || 'Requerido',
      (v) => v >= 1 || 'Mínimo 1',
      (v) => v <= 100 || 'Máximo 100'
    ]"
    @keydown:enter="submitOrder"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const quantity = ref(1)

const submitOrder = () => {
  if (quantity.value >= 1 && quantity.value <= 100) {
    console.log(`Orden confirmada: ${quantity.value} items`)
  }
}
</script>
```

### Estados combinados

```vue
<template>
  <div class="flex-col gap-4">
    <!-- Normal -->
    <ETextfield v-model="field1" label="Campo normal" />

    <!-- Deshabilitado -->
    <ETextfield
      v-model="field2"
      label="Campo deshabilitado"
      disabled
      detail="No se puede editar"
    />

    <!-- Readonly -->
    <ETextfield
      v-model="field3"
      label="Campo de solo lectura"
      readonly
    />

    <!-- Con error -->
    <ETextfield
      v-model="field4"
      label="Campo con error"
      error
      detail="Mensaje de error"
    />

    <!-- Outlined -->
    <ETextfield
      v-model="field5"
      label="Campo outlined"
      outlined
    />

    <!-- Dense -->
    <ETextfield
      v-model="field6"
      label="Campo denso"
      dense
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const field1 = ref('Editable')
const field2 = ref('Deshabilitado')
const field3 = ref('Solo lectura')
const field4 = ref('Valor con error')
const field5 = ref('Outlined')
const field6 = ref('Denso')
</script>
```

## Accesibilidad

- Usa un `label` asociado al input y enlaza mensajes auxiliares mediante `aria-describedby` cuando existen detalles o contador.
- Expone `aria-invalid`, `aria-disabled` y `aria-readonly` segun el estado del field.
- El boton de limpieza solo aparece cuando el campo puede limpiarse; si dependes de lectores de pantalla, conviene acompanar el control con una etiqueta clara de contexto en el label.

## Errores comunes

- Usar `readonly` esperando bloquear solo el input: ese estado forma parte del contrato del field completo; si quieres apuntar al control interno, usa `inputReadonly`.
- Pasar `counter` sin `limit` esperando tope duro de longitud: el contador informa, pero el limite efectivo depende de `limit`.
- Esperar placeholder visible siempre con label flotante: cuando el label no ha flotado todavia, el placeholder se oculta para evitar duplicidad visual.
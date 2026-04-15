# ESelect

## Objetivo

`ESelect` resuelve seleccion simple o multiple con soporte para items primitivos u objetos, busqueda opcional, chips, keyboard navigation, custom rendering por slots y control por `v-model`.

## Importacion

```ts
import { ESelect } from 'drocket'
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
| `modelValue` | `SelectModelValue` | `undefined` | Valor seleccionado actual. Puede ser simple o arreglo si `multiple=true`. |
| `items` | `SelectItemType[]` | requerido | Lista de opciones disponibles. |
| `itemText` | `string` | `'text'` | Clave usada para obtener texto cuando los items son objetos. |
| `itemValue` | `string` | `'value'` | Clave usada para obtener valor cuando los items son objetos. |
| `multiple` | `boolean` | `false` | Permite seleccion multiple. |
| `returnObject` | `boolean` | `false` | Emite el item completo en lugar del valor normalizado. |
| `loading` | `boolean` | `false` | Muestra estado de carga y barra lineal. |
| `search` | `string \| number` | `undefined` | Valor de busqueda controlado externamente. |
| `autocomplete` | `boolean` | `false` | Permite escribir en el input interno y emitir `update:search`. |
| `placeholder` | `string` | `undefined` | Placeholder mostrado cuando no hay seleccion. |
| `chip` | `boolean` | `false` | Renderiza selecciones como `EChip`. |
| `chipClosable` | `boolean` | `false` | En seleccion simple, permite cerrar el chip activo. |
| `prefix` | `string` | `undefined` | Texto decorativo previo a la seleccion. |
| `suffix` | `string` | `undefined` | Texto decorativo posterior a la seleccion. |
| `inputAlign` | `string` | `'start'` | Alineacion del texto o selecciones. |
| `itemCol` | `string \| number` | `1` | Cantidad de columnas visuales para el listado. |
| `lineWidth` | `string \| number` | `undefined` | Grosor personalizado de la linea inferior cuando no es outlined. |
| `limit` | `string \| number` | `undefined` | Reservado para el contrato compartido del field; no limita el numero de items seleccionados. |
| `arrowDown` | `string \| IconPath \| IconPath[]` | `undefined` | Reemplaza el icono decorativo del activador. |
| `menuColor` | `string` | `undefined` | Color heredable del dropdown. Prioriza `menuColor` y si no existe reutiliza `color` del componente. |

Ademas hereda props base de field como `label`, `detail`, `outlined`, `disabled`, `readonly`, `clearable`, `prependIcon`, `appendIcon`, `color`, `rules` y props de grid.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `SelectModelValue` | Emitido al cambiar la seleccion. |
| `update:search` | `string \| number` | Emitido cuando cambia la busqueda en modo `autocomplete`. |
| `focus` | `FocusEvent` | Emitido al enfocar el input/activador interno. |
| `blur` | `Event` | Emitido al perder foco. |
| `click:clear` | `void` | Emitido al usar el control de limpieza. |
| `click:prepend` | `void` | Emitido al hacer click en el icono prepend. |
| `click:append` | `void` | Emitido al hacer click en el icono append externo. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el input interno. |
| `blur()` | `void` | Quita foco del input interno. |
| `validate()` | `boolean` | Ejecuta validacion del field. |
| `reset()` | `void` | Restablece valor y estado del control. |
| `resetValidation()` | `void` | Limpia solo estado de validacion. |

Tambien expone `input` via `ref`.

Si necesitas interactuar programaticamente con el control, usa `focus()` sobre el componente y deja que `ESelect` administre apertura, highlighted option y sincronizacion de busqueda.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta. |
| `selection` | Personaliza el render de la seleccion actual. Recibe `selection` y `attrs`. |
| `item` | Personaliza cada opcion del listado. Recibe `item` y `attrs`. |

## Ejemplos

### Selección simple

```vue
<template>
  <ESelect
    v-model="status"
    :items="['Draft', 'Review', 'Published', 'Archived']"
    label="Estado del documento"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref('Draft')
</script>
```

### Objetos con propiedades custom

```vue
<template>
  <ESelect
    v-model="selectedUser"
    :items="users"
    item-text="name"
    item-value="id"
    return-object
    label="Responsable"
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
}

const users: User[] = [
  { id: '1', name: 'Ana García', email: 'ana@example.com' },
  { id: '2', name: 'Carlos López', email: 'carlos@example.com' },
  { id: '3', name: 'Diana Chen', email: 'diana@example.com' }
]

const selectedUser = ref<User | undefined>()
</script>
```

### Selección múltiple con chips

```vue
<template>
  <ESelect
    v-model="selectedTags"
    :items="availableTags"
    multiple
    chip
    clearable
    label="Etiquetas"
    detail="Selecciona múltiples etiquetas"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const availableTags = ['UI Design', 'Documentation', 'Bug Report', 'Infrastructure', 'DevOps']
const selectedTags = ref<string[]>(['UI Design'])
</script>
```

### Búsqueda con autocomplete

```vue
<template>
  <ESelect
    v-model="selectedOption"
    :items="filteredItems"
    :search="searchQuery"
    autocomplete
    clearable
    label="Buscar y seleccionar"
    placeholder="Escribe aquí..."
    @update:search="searchQuery = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const allItems = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Date']
const searchQuery = ref('')
const selectedOption = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return allItems
  return allItems.filter(item =>
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
```

### Integrado con EForm

```vue
<template>
  <EForm v-model="formValid" label-behavior="floating">
    <ESelect
      v-model="form.assignee"
      :items="teamMembers"
      item-text="name"
      item-value="id"
      label="Asignar a"
      :rules="[(v) => !!v || 'Requerido']"
    />

    <ESelect
      v-model="form.priority"
      :items="['Low', 'Medium', 'High', 'Critical']"
      label="Prioridad"
      color="secondary"
    />

    <ESelect
      v-model="form.labels"
      :items="['Bug', 'Feature', 'Documentation', 'Support']"
      multiple
      chip
      label="Etiquetas"
    />
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TeamMember {
  id: string
  name: string
}

const teamMembers: TeamMember[] = [
  { id: 'ana', name: 'Ana García' },
  { id: 'carlos', name: 'Carlos López' },
  { id: 'diana', name: 'Diana Chen' }
]

const formValid = ref<boolean | undefined>()
const form = ref({
  assignee: '',
  priority: 'Medium',
  labels: []
})
</script>
```

### Con carga remota

```vue
<template>
  <ESelect
    v-model="selectedCountry"
    :items="countries"
    :loading="isLoading"
    label="País"
    detail="Los datos se cargan desde una API"
    @focus="fetchCountries"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Country {
  code: string
  name: string
}

const countries = ref<Country[]>([])
const selectedCountry = ref('')
const isLoading = ref(false)

const fetchCountries = async () => {
  if (countries.value.length > 0) return

  isLoading.value = true
  try {
    // Simular carga desde API
    await new Promise(resolve => setTimeout(resolve, 1000))
    countries.value = [
      { code: 'es', name: 'España' },
      { code: 'mx', name: 'México' },
      { code: 'ar', name: 'Argentina' },
      { code: 'co', name: 'Colombia' }
    ]
  } finally {
    isLoading.value = false
  }
}
</script>
```

### Cascada de selecciones

```vue
<template>
  <div class="flex-col gap-4">
    <ESelect
      v-model="selectedCategory"
      :items="categories"
      item-text="name"
      item-value="id"
      label="Categoría"
    />

    <ESelect
      v-model="selectedSubcategory"
      :items="subcategories"
      item-text="name"
      item-value="id"
      label="Subcategoría"
      :disabled="!selectedCategory"
    />

    <ESelect
      v-model="selectedProduct"
      :items="products"
      item-text="name"
      item-value="id"
      label="Producto"
      :disabled="!selectedSubcategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  categoryId: string
}

interface Product {
  id: string
  name: string
  subcategoryId: string
}

const categories: Category[] = [
  { id: '1', name: 'Electrónica' },
  { id: '2', name: 'Ropa' }
]

const subcategoriesData: Subcategory[] = [
  { id: '1-1', name: 'Laptops', categoryId: '1' },
  { id: '1-2', name: 'Teléfonos', categoryId: '1' },
  { id: '2-1', name: 'Camisetas', categoryId: '2' }
]

const productsData: Product[] = [
  { id: '1-1-1', name: 'MacBook Pro', subcategoryId: '1-1' },
  { id: '1-1-2', name: 'Dell XPS', subcategoryId: '1-1' },
  { id: '1-2-1', name: 'iPhone 15', subcategoryId: '1-2' }
]

const selectedCategory = ref('')
const selectedSubcategory = ref('')
const selectedProduct = ref('')

const subcategories = computed(() =>
  subcategoriesData.filter(s => s.categoryId === selectedCategory.value)
)

const products = computed(() =>
  productsData.filter(p => p.subcategoryId === selectedSubcategory.value)
)
</script>
```

### Estados combinados

```vue
<template>
  <div class="flex-col gap-4">
    <!-- Normal -->
    <ESelect v-model="field1" :items="['Opción 1', 'Opción 2']" label="Normal" />

    <!-- Deshabilitado -->
    <ESelect
      v-model="field2"
      :items="['Opción 1', 'Opción 2']"
      label="Deshabilitado"
      disabled
    />

    <!-- Readonly -->
    <ESelect
      v-model="field3"
      :items="['Opción 1', 'Opción 2']"
      label="Solo lectura"
      readonly
    />

    <!-- Con error -->
    <ESelect
      v-model="field4"
      :items="['Opción 1', 'Opción 2']"
      label="Con error"
      error
      detail="Mensaje de error"
    />

    <!-- Outlined -->
    <ESelect
      v-model="field5"
      :items="['Opción 1', 'Opción 2']"
      label="Outlined"
      outlined
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const field1 = ref('Opción 1')
const field2 = ref('Opción 1')
const field3 = ref('Opción 1')
const field4 = ref('Opción 2')
const field5 = ref('')
</script>
```

## Accesibilidad

- El input interno usa `role="combobox"` y enlaza el listado mediante `aria-controls`.
- Expone `aria-expanded`, `aria-activedescendant`, `aria-autocomplete`, `aria-invalid`, `aria-disabled` y `aria-readonly`.
- El listado usa `role="listbox"` y mantiene una opcion destacada para navegacion por teclado.
- Soporta `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Escape`, `Tab` y flujo especial de chips con `Backspace` en modo multiple.

## Errores comunes

- Pasar objetos sin configurar `itemText` o `itemValue` cuando tus claves no son `text` y `value`.
- Activar `autocomplete` esperando filtrado automatico: el componente emite `update:search`, pero el filtrado de `items` lo controlas externamente.
- Usar `returnObject` sin cuidar igualdad referencial entre items remotos: la seleccion depende del valor comparable o del objeto emitido segun configuracion.
- Esperar que `limit` restrinja cantidad de seleccionados: no controla eso; solo forma parte del contrato comun del field.
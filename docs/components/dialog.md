# EDialog

## Objetivo

`EDialog` muestra contenido modal encima de un overlay global, con soporte para cierre por `v-model`, modo persistente, fullscreen y control de ancho maximo.

## Importacion

```ts
import { EDialog } from 'nuvex-ui'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Controla apertura y cierre del dialog. |
| `fullscreen` | `boolean` | `false` | Hace que el dialog ocupe toda la pantalla. |
| `absolute` | `boolean` | `false` | Cambia el contenedor del dialog a `position: absolute`. |
| `autoFocus` | `boolean` | `true` | Intenta mover el foco al contenedor del dialog al abrir. |
| `restoreFocus` | `boolean` | `true` | Intenta devolver el foco al elemento previo al cerrar. |
| `persistent` | `boolean` | `false` | Evita cierre por click fuera o `Escape`; en su lugar reproduce la animacion corta de rechazo. |
| `maxWidth` | `string \| number` | `undefined` | Define el ancho maximo en px cuando no esta en fullscreen. |
| `elevation` | `string \| number` | `undefined` | Agrega la clase `e-elevation--{valor}` al panel del dialog. |

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitido al abrir o cerrar el dialog. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido renderizado dentro del panel del dialog. |

## API expuesta

El componente expone `close(force?: boolean)` mediante `ref` y `defineExpose`.

- `close()` intenta cerrar el dialog respetando `persistent`.
- `close(true)` fuerza el cierre incluso si `persistent` esta activo.

## Ejemplos

### Basico

```vue
<template>
  <div>
    <EButton color="primary" @click="open = true">Abrir dialog</EButton>

    <EDialog v-model="open" :max-width="520">
      <ECard>
        <ECardContainer>
          <h3>Confirmar accion</h3>
          <p>Este dialog se controla con v-model.</p>
        </ECardContainer>
      </ECard>
    </EDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>
```

### Persistente

```vue
<template>
  <div>
    <EDialog v-model="open" persistent :max-width="480">
      <ECard>
        <ECardContainer>
          <h3>Debes elegir una accion</h3>
          <p>Click fuera y Escape no cierran el dialog.</p>
          <EButton color="primary" @click="open = false">Aceptar</EButton>
        </ECardContainer>
      </ECard>
    </EDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>
```

### Fullscreen

```vue
<template>
  <EDialog v-model="open" fullscreen>
    <div style="padding: 24px; background: white; min-height: 100%;">
      <h2>Vista fullscreen</h2>
      <EButton text @click="open = false">Cerrar</EButton>
    </div>
  </EDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>
```

## Accesibilidad

- El contenedor usa `role="dialog"` y `aria-modal="true"`.
- Debes proveer un titulo visible y contenido claro dentro del slot.
- Por defecto intenta enfocar el dialog al abrir y restaurar el foco al cerrar. Puedes desactivar ese comportamiento con `autoFocus` o `restoreFocus`.
- Si el dialog contiene formularios largos, asegura un orden de tabulacion coherente y una accion primaria visible.
- En `persistent`, incluye siempre una salida explicita (`Cerrar`, `Cancelar`, `Aceptar`) para no bloquear al usuario.

## Errores comunes

- Esperar cierre automatico sin escuchar `update:modelValue`: el componente depende de `v-model` para reflejar el estado externo.
- Usar `maxWidth` con unidades CSS: el componente agrega `px`, por lo que espera numero o string numerico.
- Marcar `persistent` y no ofrecer una accion de salida visible: el usuario puede quedar bloqueado.
- Renderizar multiples dialogs abiertos al mismo tiempo sin coordinacion de foco: puede romper la navegacion por teclado.
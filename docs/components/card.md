# ECard

## Objetivo

`ECard` provee un contenedor visual para agrupar contenido, con soporte de color de texto, altura fija y elevacion.

## Importacion

```ts
import { ECard } from 'drocket'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `depressed` | `boolean` | `false` | Quita la sombra del card. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text` al card. |
| `height` | `string` | `undefined` | Altura fija en px. |
| `elevation` | `string \| number` | `undefined` | Agrega la clase `e-elevation--{valor}`. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal del card. |
| `footer` | Contenido adicional al final del card. |

## Componentes relacionados

`ECardContainer` es un helper estructural que agrega el padding interno estandar del card.

```ts
import { ECard, ECardContainer } from 'drocket'
```

## Ejemplos

### Basico

```vue
<template>
  <ECard>
    <ECardContainer>
      <h3>Titulo</h3>
      <p>Contenido principal del card.</p>
    </ECardContainer>
  </ECard>
</template>
```

### Sin sombra

```vue
<template>
  <ECard depressed>
    <ECardContainer>Card sin elevacion visual.</ECardContainer>
  </ECard>
</template>
```

### Con footer

```vue
<template>
  <ECard elevation="lg">
    <ECardContainer>
      <h3>Resumen</h3>
      <p>Informacion principal.</p>
    </ECardContainer>

    <template #footer>
      <ECardContainer>
        <EButton text>Cancelar</EButton>
        <EButton color="primary">Aceptar</EButton>
      </ECardContainer>
    </template>
  </ECard>
</template>
```

## Accesibilidad

- `ECard` es un contenedor visual y no aporta semantica interactiva por si solo.
- Si el card representa una region importante, agrega semantica desde fuera con `section`, `article`, `aria-labelledby` o encabezados visibles.
- Si el card contiene acciones, mantenlas en botones o links reales dentro del contenido.
- No conviertas el card completo en area clickeable sin exponer foco, etiqueta y rol adecuados.

## Errores comunes

- Esperar que `color` cambie el fondo: hoy solo agrega una clase de color de texto.
- Pasar `height` esperando unidades CSS libres: el componente agrega `px`, por lo que espera un valor numerico o string numerico.
- Usar contenido suelto sin `ECardContainer` y luego sorprenderse por falta de padding interno.
- Mezclar multiples patrones de espaciado (padding manual + `ECardContainer`) y terminar con layouts inconsistentes.
# Utility Classes

Drocket genera automáticamente clases CSS de utilidad para acelerar el desarrollo. Estas clases siguen convenciones simples y cubren casos comunes: espaciado, flexbox, posicionamiento, texto y colores.

## Introducción Rápida

```vue
<template>
  <!-- Flex centrado con espaciado -->
  <div class="flex-row gap-4 items-center justify-center p-8">
    <span class="text-truncate flex-1">Título largo truncado</span>
    <button class="rounded-lg p-4">Acción</button>
  </div>
</template>
```

## Espaciado (Margin & Padding)

Todas las clases de espaciado se basan en `$space-base` (default: 4px). Genera valores de `0` a `$space-scale` (default: 16).

### Cálculo
- `.m-1` = `margin: 4px;`
- `.p-8` = `padding: 32px;`
- `.pt-2` = `padding-top: 8px;`

### Sintaxis

```
.{m|p}{x|y|t|r|b|l}-{0-16}
.{m}-{x|y|t|r|b|l}-n{0-16}  // Negativo (solo margin)
```

### Ejemplos

```vue
<template>
  <!-- Margin -->
  <div class="m-4">Margen: 16px en todos lados</div>
  <div class="mx-8">Margen horizontal: 32px</div>
  <div class="mt-2 mb-6">Margen top 8px, bottom 24px</div>
  
  <!-- Padding -->
  <div class="p-4">Padding: 16px</div>
  <div class="py-8">Padding vertical: 32px</div>
  <div class="pl-2 pr-6">Padding left 8px, right 24px</div>
  
  <!-- Margen negativo -->
  <div class="m-n4">Margen: -16px</div>
  <div class="ml-n2">Margen left: -8px (útil para offset)</div>
</template>
```

## Flexbox & Grid

### Dirección

```vue
<template>
  <div class="flex-row">Horizontal, izq a der</div>
  <div class="flex-col">Vertical, arriba a abajo</div>
</template>
```

### Wrapping

```vue
<template>
  <div class="flex-wrap">Permite saltos de línea</div>
  <div class="flex-nowrap">Sin saltos</div>
</template>
```

### Flex Grow/Shrink

```vue
<template>
  <!-- Crecimiento -->
  <div class="flex-row">
    <div class="flex-1">Crece para ocupar espacio disponible</div>
    <div class="flex-0">Tamaño fijo</div>
  </div>
  
  <!-- Control fino -->
  <div class="flex-grow">flex-grow: 1</div>
  <div class="flex-grow-0">flex-grow: 0</div>
  <div class="flex-shrink">flex-shrink: 1</div>
  <div class="flex-shrink-0">No se encoge</div>
  <div class="flex-auto">Flexible con contenido natural</div>
  <div class="flex-none">Tamaño fijo</div>
</template>
```

### Alineación

```vue
<template>
  <!-- justify-content (horizontal en row, vertical en column) -->
  <div class="flex-row justify-start">Alineado al inicio</div>
  <div class="flex-row justify-center">Centrado</div>
  <div class="flex-row justify-end">Alineado al final</div>
  <div class="flex-row justify-between">Distribuido con espacios</div>
  <div class="flex-row justify-around">Distribuido simétrico</div>
  
  <!-- align-items (vertical en row, horizontal en column) -->
  <div class="flex-row items-start">Alineado arriba</div>
  <div class="flex-row items-center">Centrado verticalmente</div>
  <div class="flex-row items-end">Alineado abajo</div>
  <div class="flex-row items-baseline">Alineado por baseline</div>
  <div class="flex-row items-stretch">Estira hacia los lados</div>
</template>
```

### Gap (Espaciado entre items)

```vue
<template>
  <!-- Gap simétrico -->
  <div class="flex-col gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <!-- Espacio: 16px entre cada item -->
  </div>
  
  <!-- Gap por eje -->
  <div class="flex-col gap-x-8 gap-y-2">
    <div>Espacio horizontal: 32px, vertical: 8px</div>
  </div>
</template>
```

### Patrones Comunes

```vue
<template>
  <!-- Centrado completo -->
  <div class="flex-row gap-4 items-center justify-center h-full">
    Contenido centrado en todos lados
  </div>
  
  <!-- Distribución espacial -->
  <div class="flex-row gap-4 justify-between items-center p-4">
    <span>Izquierda</span>
    <span>Centro</span>
    <span>Derecha</span>
  </div>
  
  <!-- Barra de herramientas -->
  <div class="flex-row gap-2 items-center justify-between px-4 py-2">
    <span class="flex-0">Logo</span>
    <div class="flex-1" />
    <nav class="flex-row gap-2">Botones</nav>
  </div>
</template>
```

## Posicionamiento

### Position Types

```vue
<template>
  <div class="relative">
    Baseline para elementos absolutos internos
    
    <div class="absolute top-4 right-4">
      Arriba-derecha relativo al parent
    </div>
  </div>
  
  <div class="fixed bottom-0 right-0">
    Fijo en la esquina inferior-derecha de la viewport
  </div>
  
  <div class="sticky top-0">
    "Sticky" al scroll (si está dentro de contenedor scrollable)
  </div>
</template>
```

### Sides

```vue
<template>
  <!-- Valores individuales -->
  <div class="absolute top-0">top: 0</div>
  <div class="absolute left-0">left: 0</div>
  <div class="absolute bottom-full">bottom: 100%</div>
  <div class="absolute right-full">right: 100%</div>
  
  <!-- Inset (todos los lados) -->
  <div class="absolute inset-0">
    Llena todo el contenedor parent
  </div>
</template>
```

## Overflow

### Axis-agnostic

```vue
<template>
  <div class="overflow-auto">Scroll si es necesario en cualquier dirección</div>
  <div class="overflow-hidden">Recorta el contenido</div>
  <div class="overflow-visible">Permite overflow visual</div>
  <div class="overflow-scroll">Siempre con scrollbars</div>
</template>
```

### Por Eje

```vue
<template>
  <!-- Horizontal -->
  <div class="overflow-x-auto overflow-y-hidden">
    Scroll izq-der solo
  </div>
  
  <!-- Vertical -->
  <div class="overflow-x-hidden overflow-y-auto">
    Scroll arriba-abajo solo
  </div>
</template>
```

## Texto

### Truncamiento

```vue
<template>
  <!-- Una línea -->
  <p class="truncate">
    Este texto muy largo se trunca en una sola línea con ellipsis...
  </p>
  
  <!-- Múltiples líneas -->
  <p class="line-clamp-2">
    Este texto no excede 2 líneas. Cualquier contenido
    extra se trunca con ellipsis.
  </p>
  <p class="line-clamp-3">
    Hasta 3 líneas de contenido.
    Línea 2.
    Línea 3. Extra se corta.
  </p>
</template>
```

### Whitespace

```vue
<template>
  <p class="whitespace-normal">
    Whitespace normal. Múltiples   espacios se colapsan.
  </p>
  
  <pre class="whitespace-pre">
    Respeta    espacios y
    saltos de línea
  </pre>
  
  <p class="whitespace-nowrap">
    No hay saltos de línea, overflow automático
  </p>
  
  <div class="whitespace-pre-wrap">
    Respeta espacios Y    permite wrapping
  </div>
</template>
```

### Word Breaking

```vue
<template>
  <p class="break-words">
    unhyphenatedverylongwordcanwraptothelinefollowing
  </p>
  
  <p class="break-all">
    Rompe en cualquier carácter si es necesario.
  </p>
  
  <p class="break-keep">
    No rompe palabras, respeta CJK
  </p>
</template>
```

## Border Radius

### Presets

```vue
<template>
  <div class="rounded">0.375rem (6px)</div>
  <div class="rounded-sm">0.125rem (2px)</div>
  <div class="rounded-md">0.5rem (8px)</div>
  <div class="rounded-lg">0.75rem (12px)</div>
  <div class="rounded-xl">1rem (16px)</div>
  <div class="rounded-2xl">1.5rem (24px)</div>
  <div class="rounded-3xl">2rem (32px)</div>
  <div class="rounded-full">9999px (círculo/píldora)</div>
  <div class="rounded-none">0 (sin redondeado)</div>
</template>
```

### Por Lado

```vue
<template>
  <!-- Top (arriba) -->
  <div class="rounded-t">Redondeado arriba</div>
  
  <!-- Right (derecha) -->
  <div class="rounded-r">Redondeado derecha</div>
  
  <!-- Bottom (abajo) -->
  <div class="rounded-b">Redondeado abajo</div>
  
  <!-- Left (izquierda) -->
  <div class="rounded-l">Redondeado izquierda</div>
</template>
```

## Display & Responsive

### Display Base

```vue
<template>
  <div class="d-block">block</div>
  <div class="d-inline">inline</div>
  <div class="d-inline-block">inline-block</div>
  <div class="d-flex">flex</div>
  <div class="d-inline-flex">inline-flex</div>
  <div class="d-none">none (oculto)</div>
</template>
```

### Display Responsivo

Cambia display según breakpoint. Breakpoints disponibles: `xs` (0), `sm` (600px), `md` (960px), `lg` (1264px), `xl` (1904px).

```vue
<template>
  <!-- Oculto < 600px, block >= 600px -->
  <nav class="d-none d-sm-block">
    Menú de escritorio
  </nav>
  
  <!-- Flex normal, hidden >= 1264px -->
  <button class="d-flex d-lg-none">
    Menú mobile
  </button>
  
  <!-- Flex en mobile, flex también en desktop (no cambia) -->
  <div class="d-flex">
    Siempre flex
  </div>
</template>
```

## Colores

### Colores Semánticos

```vue
<template>
  <!-- Fondo + contraste automático -->
  <div class="primary">
    Fondo primario, texto en contraste
  </div>
  
  <!-- Solo texto -->
  <span class="primary--text">Texto en color primario</span>
  
  <!-- Todos los colores semánticos -->
  <div class="secondary">secondary</div>
  <div class="error">error</div>
  <div class="warning">warning</div>
  <div class="success">success</div>
  <div class="info">info</div>
</template>
```

### Colores Primitivos

```vue
<template>
  <!-- Familia base (tono 500) -->
  <div class="red">Rojo base + contraste</div>
  <div class="blue">Azul base + contraste</div>
  <div class="green">Verde base + contraste</div>
  
  <!-- Tonos específicos -->
  <div class="red-100">Rojo muy claro</div>
  <div class="red-500">Rojo base</div>
  <div class="red-900">Rojo muy oscuro</div>
  
  <!-- Solo color de texto -->
  <span class="blue-600--text">Texto azul-600</span>
  
  <!-- Tonos disponibles: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 -->
  <div class="green-700">Verde saturado</div>
  <div class="amber-300">Ámbar claro</div>
  <div class="purple-500">Púrpura</div>
</template>
```

## Combinaciones Prácticas

### Card con Padding y Sombra

```vue
<template>
  <div class="e-elevation--md rounded-lg p-6 gap-4 flex-col">
    <h3 class="text-lg font-semibold">Título</h3>
    <p class="line-clamp-3">Descripción...</p>
  </div>
</template>
```

### Form Label y Input

```vue
<template>
  <div class="flex-col gap-2">
    <label class="text-sm primary--text">Email</label>
    <input class="p-3 border rounded outlined" />
  </div>
</template>
```

### Barra de Herramientas

```vue
<template>
  <div class="flex-row gap-4 items-center justify-between px-6 py-4 e-elevation--sm">
    <span class="primary--text font-semibold">Drocket</span>
    <nav class="flex-row gap-2">
      <button class="p-2 rounded hover:bg-blue-100">Home</button>
      <button class="p-2 rounded hover:bg-blue-100">Docs</button>
      <button class="p-2 rounded hover:bg-blue-100">About</button>
    </nav>
  </div>
</template>
```

## Responsividad

Las utility classes respetan los breakpoints definidos en `$grid-breakpoints`. Usa prefijo de breakpoint para aplicar clases solo en rangos específicos:

```vue
<template>
  <!-- Stack en mobile, lado a lado en tablet+ -->
  <div class="flex-col d-md-flex d-md-flex-row gap-4">
    <div class="flex-1">Panel izquierdo (full width mobile)</div>
    <div class="flex-1">Panel derecho (50% tablet+)</div>
  </div>
  
  <!-- Padding dinámico: pequeño mobile, grande desktop -->
  <div class="p-4 p-md-8">
    Padding: 16px mobile, 32px desktop
  </div>
</template>
```

## Performance

Las utility classes se generan una sola vez durante el build. El archivo resultante es pequeño (<50KB gzipped) gracias a:

- Loops SCSS que reutilizan patrones
- Prefijado automático de breakpoints
- Compresión CSS estándar

Úsalas libremente; no añaden overhead significativo.

## Referencia Rápida

| Utilidad | Ejemplos |
|----------|----------|
| Margin | `.m-4`, `.mx-2`, `.mt-8`, `.m-n4` |
| Padding | `.p-4`, `.px-6`, `.py-2` |
| Display | `.d-flex`, `.d-none`, `.d-sm-block` |
| Flexbox | `.flex-row`, `.gap-4`, `.items-center`, `.justify-between` |
| Posición | `.absolute`, `.relative`, `.top-0`, `.inset-0` |
| Overflow | `.overflow-auto`, `.overflow-x-hidden` |
| Texto | `.truncate`, `.line-clamp-2`, `.whitespace-nowrap` |
| Radio | `.rounded`, `.rounded-lg`, `.rounded-full` |
| Color | `.primary`, `.red-500`, `.blue--text` |

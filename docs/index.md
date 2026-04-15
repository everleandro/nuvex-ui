# Drocket Docs

Drocket es una libreria de componentes para Vue 3 orientada a construir interfaces consistentes y reutilizables.

## Empezar rapido

1. Instala el paquete:

```bash
npm install drocket
```

2. Registra el plugin en tu app Vue:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Drocket } from 'drocket'
import 'drocket/styles.css'

const app = createApp(App)
app.use(Drocket)
app.mount('#app')
```

## Secciones

- [Guia de inicio](./getting-started.md)
- [Theming y personalización](./theming.md)
- [Utility Classes](./utilities.md)
- [Componentes](./components/README.md)

## Novedades recientes

- Theming dinamico con CSS variables y soporte de tema claro/oscuro por `data-theme`.
- Variables globales de componentes expuestas como `--e-*` (botones, listas, iconos, schedule, etc.).
- `EButton` ahora soporta colores personalizados por CSS variables (`--e-color-{nombre}`, `--e-contrast-{nombre}`) sin recompilar.
- Playground local independiente con scripts:
	- `npm run playground:dev`
	- `npm run playground:build`
	- `npm run playground:preview`

## Convencion de docs por componente

Cada componente debe incluir:

- objetivo
- importacion
- props
- eventos
- slots
- ejemplos
- notas de accesibilidad
- errores comunes

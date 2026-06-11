# Documentacion Nuvex UI

Esta carpeta contiene la documentacion local del proyecto.

## Estructura

- `index.md`: vision general y rutas recomendadas.
- `getting-started.md`: instalacion y setup rapido.
- `theming.md`: personalizacion con variables Sass.
- `components/`: documentacion por componente.

## Flujo recomendado

1. Crear o actualizar el componente.
2. Actualizar su pagina en `docs/components/`.
3. Si hay cambios globales, actualizar `getting-started.md` o `theming.md`.
4. Si cambian scripts de desarrollo, documentarlos en `getting-started.md`.

## Changelog

### 2026-03-08

- Se documento el sistema de theming dinamico con CSS variables `--e-*` en `docs/theming.md`.
- Se agregaron scripts de playground (`playground:dev`, `playground:build`, `playground:preview`) en `docs/getting-started.md` y `README.md`.
- Se actualizo la documentacion de `EButton` para reflejar colores dinamicos y colores personalizados por CSS variables.

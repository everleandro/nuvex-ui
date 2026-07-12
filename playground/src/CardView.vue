<template>
    <section class="card-page">
        <header class="card-page__header">
            <p class="card-page__eyebrow">Components</p>
            <h2 class="card-page__title">Card Examples</h2>
            <p class="card-page__lead">
                Vista de referencia para revisar cards contenidas, tonales y la combinacion tonal con outlined.
            </p>
        </header>

        <article class="card-demo">
            <h3>Body media</h3>
            <p class="card-demo__caption">`prepend` y `append` ahora viven dentro del contenido principal del card.</p>

            <div class="card-grid">
                <ECard :prepend-icon="iconFactory.heart" title="Default card" subtitle="Contained surface"
                    description="Usa el fondo de superficie por defecto." />
                <ECard :append-icon="iconFactory.calendar" title="Timeline" subtitle="Body append"
                    description="El append del body se renderiza al final de `card__main`." />
            </div>
        </article>

        <article class="card-demo">
            <h3>Header media</h3>
            <p class="card-demo__caption">Usa `prepend-header-*` y `append-header-*` cuando la media pertenece al encabezado.</p>

            <div class="card-grid">
                <ECard :prepend-header-icon="iconFactory.heart" title="Default card" subtitle="Contained surface"
                    description="Mantiene el icono junto al bloque de title y subtitle." />
                <ECard :append-header-icon="iconFactory.calendar" title="Meeting note" subtitle="Header append"
                    description="El append del header conserva el alineado al extremo derecho." />
            </div>
        </article>

        <article class="card-demo">
            <h3>Contained</h3>
            <p class="card-demo__caption">Base visual para contrastar el comportamiento normal contra tonal.</p>

            <div class="card-grid">
                <ECard title="Default card" subtitle="Contained surface"
                    description="Usa el fondo de superficie por defecto." />
                <ECard title="Primary card" subtitle="Contained with color"
                    description="Aplica color como fondo solido del card." color="primary" />
            </div>
        </article>

        <article class="card-demo">
            <h3>Tonal</h3>
            <p class="card-demo__caption">El color pasa a tinta y la superficie se resuelve como capa tonal.</p>

            <div class="card-grid">
                <ECard tonal title="Default tonal" subtitle="Neutral tonal surface"
                    description="Mantiene el color base de superficie y lo proyecta como capa tonal." />
                <ECard tonal color="primary" title="Primary tonal" subtitle="Tonal with semantic color"
                    description="Replica la inversion visual del button tonal con color." />
                <ECard tonal color="teal-700" title="Teal tonal" subtitle="Primitive palette token"
                    description="Valida el comportamiento tonal con tokens de paleta." />
            </div>
        </article>

        <article class="card-demo">
            <h3>Tonal + outlined</h3>
            <p class="card-demo__caption">La combinacion se mantiene soportada para sumar borde sin perder la capa
                tonal.</p>

            <div class="card-grid">
                <ECard tonal outlined title="Outlined tonal" subtitle="Border plus tonal layer"
                    description="El borde se mantiene y la card sigue plana, sin elevacion." />
                <ECard tonal outlined color="secondary" title="Secondary outlined tonal"
                    subtitle="Semantic color plus outline"
                    description="Caso de referencia para la combinacion que decidiste conservar." />
            </div>
        </article>
    </section>
</template>
<script setup lang="ts">

import iconFactory from "./icons.ts";
</script>

<style scoped>
.card-page {
    display: grid;
    gap: 20px;
}

.card-page__header {
    display: grid;
    gap: 6px;
}

.card-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.card-page__title {
    margin: 0;
}

.card-page__lead {
    margin: 0;
    opacity: 0.84;
}

.card-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.card-demo h3 {
    margin: 0;
}

.card-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.card-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
</style>
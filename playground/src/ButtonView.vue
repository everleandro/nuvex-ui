<template>
    <section class="button-page">
        <header class="button-page__header">
            <p class="button-page__eyebrow">Components</p>
            <h2 class="button-page__title">Button Examples</h2>
            <p class="button-page__lead">
                Primera seccion de Button en el nuevo playground, enfocada en variantes, estados, tamanos e iconos.
            </p>
        </header>

        <article class="button-demo">
            <h3>Variants</h3>
            <p class="button-demo__caption">Base para validar estilo filled, outlined, text y color.</p>

            <div class="button-row">
                <EButton color="primary">Primary</EButton>
                <EButton color="secondary">Secondary</EButton>
                <EButton color="teal-900">Teal 900</EButton>
                <EButton outlined color="primary">Outlined</EButton>
                <EButton text color="primary">Text</EButton>
            </div>
        </article>

        <article class="button-demo">
            <h3>States</h3>
            <p class="button-demo__caption">Checks rapidos para disabled, loading y comportamiento de ancho.</p>

            <ECard>
                <div class="button-row">
                    <EButton disabled>Disabled</EButton>
                    <EButton loading color="primary">Loading</EButton>
                    <EButton :loading="isSaving" color="success" @click="simulateSave">
                        Simulate Save
                    </EButton>
                </div>
            </ECard>

            <div class="button-stack">
                <EButton block color="primary">Block button</EButton>
            </div>
        </article>

        <article class="button-demo">
            <h3>Sizes</h3>
            <p class="button-demo__caption">Comparativa visual para revisar escala tipografica y espaciado.</p>

            <div class="button-row button-row--align-end">
                <EButton size="x-small" color="primary">x-small</EButton>
                <EButton size="small" color="primary">small</EButton>
                <EButton size="default" color="primary">default</EButton>
                <EButton size="large" color="primary">large</EButton>
                <EButton size="x-large" color="primary">x-large</EButton>
            </div>
        </article>


        <article class="button-demo">
            <h3>Icons</h3>
            <p class="button-demo__caption">Casos con prepend, append, icon-only y FAB.</p>

            <div class="button-row">
                <EButton :prepend-icon="iconFactory.heart" color="secondary">Back</EButton>
                <EButton :append-icon="iconFactory.arrowRight" color="secondary">Continue</EButton>
                <EButton :icon="iconFactory.menu" aria-label="Open menu" color="primary" />
                <EButton fab :icon="iconFactory.trash" aria-label="Add item" color="primary" />
                <EButton :icon="iconFactory.heart" aria-label="Close" color="secondary" />
                <EButton :icon="iconFactory.heart" aria-label="Close" />
            </div>
        </article>
        <article class="button-demo">
            <h3>Stacked</h3>
            <p class="button-demo__caption">Icono y contenido acomodados en columna con la prop `stacked`.</p>

            <div class="button-row">
                <EButton stacked :prepend-icon="iconFactory.heart" color="primary">Favorito</EButton>
                <EButton stacked :append-icon="iconFactory.arrowRight" color="secondary">Continuar</EButton>
                <EButton stacked outlined :prepend-icon="iconFactory.menu" color="primary">Menu</EButton>
                <EButton stacked tonal :prepend-icon="iconFactory.trash" color="error">Eliminar</EButton>
                <EButton stacked text :prepend-icon="iconFactory.heart">Texto</EButton>
            </div>

            <div class="button-row button-row--align-end">
                <EButton stacked size="x-small" :prepend-icon="iconFactory.heart" color="primary">x-small</EButton>
                <EButton stacked size="small" :prepend-icon="iconFactory.heart" color="primary">small</EButton>
                <EButton stacked size="default" :prepend-icon="iconFactory.heart" color="primary">default</EButton>
                <EButton stacked size="large" :prepend-icon="iconFactory.heart" color="primary">large</EButton>
                <EButton stacked size="x-large" :prepend-icon="iconFactory.heart" color="primary">x-large</EButton>
            </div>
        </article>

        <article class="button-demo">
            <h3>Button text</h3>
            <p class="button-demo__caption">Variantes de botones tipo texto.</p>

            <div class="button-row">
                <EButton :icon="iconFactory.menu" text aria-label="icon text primary" color="primary" />
                <EButton fab :icon="iconFactory.trash" text aria-label="fab text button" />
                <EButton :icon="iconFactory.heart" text aria-label="icon text secondary" color="secondary" />
                <EButton :icon="iconFactory.heart" text aria-label="icon text default" />
                <EButton text aria-label="default text default" >Default</EButton>
            </div>
        </article>
        <article class="button-demo">
            <h3>Button tonal</h3>
            <p class="button-demo__caption">Variantes de botones tipo tonal.</p>

            <div class="button-row">
                <EButton :icon="iconFactory.menu" tonal aria-label="icon tonal primary" color="primary" />
                <EButton fab :icon="iconFactory.trash" tonal aria-label="fab tonal button" />
                <EButton :icon="iconFactory.heart" tonal aria-label="icon tonal secondary" color="secondary" />
                <EButton :icon="iconFactory.heart" tonal aria-label="icon tonal default" />
                <EButton tonal aria-label="default tonal default" >Default</EButton>
            </div>
        </article>
        <ECard>
            <article class="button-demo">
                <h3>Links</h3>
                <p class="button-demo__caption">Prueba rapida para comportamiento como anchor.</p>

                <div class="button-row">
                    <EButton href="https://github.com" target="_blank" rel="noreferrer">Open GitHub</EButton>
                </div>
            </article>
        </ECard>
    </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const isSaving = ref(false);

const simulateSave = () => {
    if (isSaving.value) {
        return;
    }

    isSaving.value = true;

    setTimeout(() => {
        isSaving.value = false;
    }, 1200);
};
</script>

<style scoped>
.button-page {
    display: grid;
    gap: 20px;
}

.button-page__header {
    display: grid;
    gap: 6px;
}

.button-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.button-page__title {
    margin: 0;
}

.button-page__lead {
    margin: 0;
    opacity: 0.84;
}

.button-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.button-demo h3 {
    margin: 0;
}

.button-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.button-row--align-end {
    align-items: flex-end;
}

.button-stack {
    display: grid;
    gap: 12px;
}
</style>

<template>
    <section class="bar-page">
        <header class="bar-page__header">
            <p class="bar-page__eyebrow">Components</p>
            <h2 class="bar-page__title">Bar Examples</h2>
            <p class="bar-page__lead">
                Casos base para revisar estilos, densidad, colores y composicion de contenido en EBar.
            </p>
        </header>

        <article class="bar-demo">
            <h3>Default + Actions</h3>
            <p class="bar-demo__caption">Uso basico con titulo, acciones y separador flexible.</p>

            <div class="bar-surface">
                <EBar outlined>
                    <EButton :icon="iconFactory.menu" aria-label="Open menu" />
                    <strong class="bar-label">Projects</strong>
                    <ESpacer />
                    <EButton text>Share</EButton>
                    <EButton color="primary">Create</EButton>
                </EBar>
            </div>
        </article>

        <article class="bar-demo">
            <h3>Elevation</h3>
            <p class="bar-demo__caption">Uso basico con titulo, acciones y separador flexible.</p>

            <div class="bar-surface">
                <EBar elevation="md">
                    <EButton :icon="iconFactory.menu" aria-label="Open menu" />
                    <strong class="bar-label">Projects</strong>
                    <ESpacer />
                    <EButton text>Share</EButton>
                    <EButton color="primary">Create</EButton>
                </EBar>
            </div>
        </article>

        <article class="bar-demo">
            <h3>Dense + Color</h3>
            <p class="bar-demo__caption">Comparativa visual para densidad compacta y color de superficie.</p>

            <div class="bar-stack">
                <div class="bar-surface">
                    <EBar dense outlined color="surface-raised">
                        <strong class="bar-label">Dense Bar</strong>
                        <ESpacer />
                        <EButton :icon="iconFactory.themeDarkLight" aria-label="Toggle theme" />
                    </EBar>
                </div>

                <div class="bar-surface">
                    <EBar outlined color="primary">
                        <strong class="bar-label">Primary Bar</strong>
                        <ESpacer />
                        <EButton text>Docs</EButton>
                        <EButton text>Support</EButton>
                    </EBar>
                </div>
            </div>
        </article>

        <article class="bar-demo">
            <h3>Append Slot</h3>
            <p class="bar-demo__caption">Ejemplo con bloque adicional en slot append para layouts avanzados.</p>

            <div class="bar-surface">
                <EBar outlined>
                    <strong class="bar-label">Workspace</strong>
                    <ESpacer />
                    <EButton text>Overview</EButton>
                    <template #append>
                        <div class="bar-append">
                            <EButton :icon="iconFactory.accountBox" aria-label="Account" />
                        </div>
                    </template>
                </EBar>
            </div>
        </article>
    </section>
</template>

<script setup>
import iconFactory from "./icons.ts";
</script>

<style scoped>
.bar-page {
    display: grid;
    gap: 20px;
}

.bar-page__header {
    display: grid;
    gap: 6px;
}

.bar-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.bar-page__title {
    margin: 0;
}

.bar-page__lead {
    margin: 0;
    opacity: 0.84;
}

.bar-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.bar-demo h3 {
    margin: 0;
}

.bar-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.bar-stack {
    display: grid;
    gap: 12px;
}

.bar-surface {
    border: 1px dashed var(--e-color-border, rgba(0, 0, 0, 0.12));
    border-radius: 12px;
    overflow: hidden;
}

.bar-label {
    font-size: 14px;
}

.bar-append {
    display: flex;
    align-items: center;
    padding-right: 8px;
}
</style>

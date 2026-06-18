<template>
    <section class="card-playground">
        <div class="card-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Card Playground</h1>
            <p class="hero-copy">
                Esta vista separa las pruebas de <strong>ECard</strong> para validar la
                migracion de color, contraste, borde outlined y composicion sin seguir
                creciendo la vista principal del playground.
            </p>
        </div>

        <section class="block card-section">
            <div class="section-head">
                <div>
                    <p class="section-kicker">Color</p>
                    <h2>Superficie + contraste</h2>
                    <p>
                        Estos ejemplos prueban el nuevo manejo de color por variables CSS,
                        alineado con el comportamiento de <strong>EButton</strong>.
                    </p>
                </div>
            </div>

            <div class="card-grid">
                <ECard
                    v-for="sample in colorSamples"
                    :key="sample.name"
                    :color="sample.color"
                    :outlined="sample.outlined"
                    :depressed="sample.depressed"
                    :title="sample.title"
                    :subtitle="sample.subtitle"
                    :prepend-avatar="sample.prependAvatar"
                    :prepend-avatar-props="sample.prependAvatarProps"
                    :prepend-icon="sample.prependIcon"
                    :prepend-icon-props="sample.prependIconProps"
                    elevation="sm"
                >
                    <div class="play-card__meta">
                        <span>{{ sample.label }}</span>
                        <strong>{{ sample.name }}</strong>
                    </div>
                    <p>{{ sample.copy }}</p>

                    <div class="play-card__actions">
                        <EButton :color="sample.actionColor" :outlined="sample.actionOutlined">
                            Primary action
                        </EButton>
                        <EButton text :color="sample.actionColor">Secondary</EButton>
                    </div>
                </ECard>
            </div>
        </section>

        <section class="block card-section">
            <div class="section-head">
                <div>
                    <p class="section-kicker">Outlined</p>
                    <h2>Bordes y variantes</h2>
                    <p>
                        Este bloque ayuda a revisar si el borde toma correctamente el color
                        del card y si el contraste del contenido se mantiene estable.
                    </p>
                </div>
            </div>

            <ERow dense>
                <ECol v-for="variant in outlineSamples" :key="variant.title" :cols="12" :md="6" :lg="4">
                    <ECard
                        class="play-card play-card--outline"
                        :color="variant.color"
                        :title="variant.title"
                        :subtitle="variant.caption"
                        :prepend-icon="variant.prependIcon"
                        :prepend-icon-props="variant.prependIconProps"
                        outlined
                    >

                        <p>{{ variant.copy }}</p>

                        <template #footer>
                            <div class="play-card__footer">
                                <span>{{ variant.token }}</span>
                                <EButton text :prepend-icon="iconFactory.arrowRight">Inspect</EButton>
                            </div>
                        </template>
                    </ECard>
                </ECol>
            </ERow>
        </section>

        <section class="block card-section">
            <div class="section-head">
                <div>
                    <p class="section-kicker">Composition</p>
                    <h2>Alturas, contenido y footer</h2>
                    <p>
                        Pruebas de layout para revisar como responde la tarjeta al contenido,
                        altura fija y uso de acciones al pie.
                    </p>
                </div>
            </div>

            <div class="composition-grid">
                <ECard
                    class="play-card play-card--editor"
                    color="secondary"
                    title="Editor draft"
                    subtitle="Height fija para probar contenido vertical."
                    :prepend-icon="iconFactory.pencil"
                    :prepend-icon-props="{ size: 'small' }"
                    height="280"
                    elevation="md"
                >

                    <div class="editor-preview">
                        <div class="editor-preview__line editor-preview__line--strong"></div>
                        <div class="editor-preview__line"></div>
                        <div class="editor-preview__line editor-preview__line--short"></div>
                        <div class="editor-preview__panel">
                            <EButton text :prepend-icon="iconFactory.arrowLeft">Back</EButton>
                            <EButton color="secondary">Publish</EButton>
                        </div>
                    </div>
                </ECard>

                <ECard
                    class="play-card play-card--metrics"
                    title="Metrics snapshot"
                    subtitle="Estado actual de tablero"
                    prepend-avatar="https://i.pravatar.cc/80?img=12"
                    :prepend-avatar-props="{ size: 'small', elevation: 'sm' }"
                    outlined
                    elevation="sm"
                >
                    <span class="status-dot"></span>

                    <div class="metrics-grid">
                        <div v-for="metric in metrics" :key="metric.label" class="metric-box">
                            <span>{{ metric.label }}</span>
                            <strong>{{ metric.value }}</strong>
                        </div>
                    </div>

                    <template #footer>
                        <div class="play-card__footer">
                            <span>Footer slot</span>
                            <EButton text :append-icon="iconFactory.arrowRight">Details</EButton>
                        </div>
                    </template>
                </ECard>
            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import ECol from "../../src/components/grid/col.vue";
import ERow from "../../src/components/grid/row.vue";
import iconFactory from "../../src/utils/icons";

const colorSamples = [
    {
        name: "Default surface",
        label: "surface",
        title: "Card without explicit color",
        subtitle: "Usa tokens base para comparar el resto de variantes.",
        prependIcon: iconFactory.menu,
        prependIconProps: { size: "small" },
        copy: "Usa los tokens de surface base para comparar el resto de variantes.",
        color: undefined,
        outlined: false,
        depressed: false,
        actionColor: "primary",
        actionOutlined: false,
    },
    {
        name: "Primary",
        label: "semantic",
        title: "Primary background + computed contrast",
        subtitle: "Contraste resuelto automaticamente desde el tema.",
        prependAvatar: "https://i.pravatar.cc/80?img=7",
        prependAvatarProps: { size: "small", elevation: "sm" },
        copy: "Sirve para validar que el contraste de texto y acciones se resuelva desde variables.",
        color: "primary",
        outlined: false,
        depressed: false,
        actionColor: "primary",
        actionOutlined: true,
    },
    {
        name: "Teal 300",
        label: "primitive",
        title: "Primitive palette token",
        subtitle: "Color primitivo con contraste legible.",
        prependIcon: iconFactory.calendar,
        prependIconProps: { size: "x-small", stateLayer: false },
        copy: "Ayuda a confirmar que un color primitivo tambien actualiza fondo y contraste del card.",
        color: "teal-300",
        outlined: false,
        depressed: true,
        actionColor: "teal-300",
        actionOutlined: true,
    },
];

const outlineSamples = [
    {
        title: "Primary outlined",
        caption: "Semantic token",
        prependIcon: iconFactory.chevronDown,
        prependIconProps: { size: "small" },
        copy: "El borde debe seguir el color resuelto del card, no un color de texto heredado por clase.",
        color: "primary",
        token: "color=primary",
    },
    {
        title: "Warning outlined",
        caption: "Semantic token",
        prependIcon: iconFactory.menuDown,
        prependIconProps: { size: "small", stateLayer: false },
        copy: "Caso util para verificar contraste y legibilidad sobre tonos calidos.",
        color: "warning",
        token: "color=warning",
    },
    {
        title: "Blue 700 outlined",
        caption: "Primitive token",
        prependIcon: iconFactory.clear,
        prependIconProps: { size: "x-small" },
        copy: "Sirve para revisar el borde con tonos oscuros de la paleta primitiva.",
        color: "blue-700",
        token: "color=blue-700",
    },
];

const metrics = [
    { label: "Open issues", value: "14" },
    { label: "PRs", value: "5" },
    { label: "Coverage", value: "82%" },
    { label: "Tokens", value: "128" },
];
</script>

<style scoped>
.card-playground {
    display: grid;
    gap: 24px;
}

.card-playground__hero {
    display: grid;
    gap: 8px;
    max-width: 760px;
}

.eyebrow,
.section-kicker {
    color: #5b6b8a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin: 0;
    text-transform: uppercase;
}

.card-playground__hero h1,
.section-head h2,
.play-card h3,
.play-card strong {
    color: var(--e-primary-color, #172033);
    margin: 0;
}

.hero-copy,
.section-head p,
.play-card p,
.play-card span {
    color: var(--e-secondary-color, #596579);
    line-height: 1.6;
    margin: 0;
}

.card-section {
    display: grid;
    gap: 20px;
}

.section-head {
    display: grid;
    gap: 8px;
    max-width: 720px;
}

.card-grid,
.composition-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.play-card {
    border-radius: 20px;
    overflow: hidden;
}

.play-card :deep(.e-card__main) {
    display: grid;
    gap: 16px;
    padding: 24px;
}

.play-card__meta,
.play-card__actions,
.play-card__footer {
    display: flex;
    align-items: center;
    gap: 12px;
}

.play-card__meta {
    justify-content: space-between;
}

.play-card__actions,
.play-card__footer {
    flex-wrap: wrap;
}

.play-card__footer {
    justify-content: space-between;
}

.play-card--outline :deep(.e-card__main) {
    min-height: 190px;
}

.editor-preview {
    display: grid;
    gap: 12px;
    margin-top: auto;
}

.editor-preview__line {
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.38);
}

.editor-preview__line--strong {
    width: 72%;
    height: 14px;
}

.editor-preview__line--short {
    width: 48%;
}

.editor-preview__panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.18);
}

.metrics-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.metric-box {
    display: grid;
    gap: 4px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.04);
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.16);
}

@media (max-width: 720px) {
    .play-card__meta,
    .play-card__footer,
    .editor-preview__panel {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
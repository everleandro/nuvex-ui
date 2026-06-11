<template>
    <section class="tab-playground">
        <div class="tab-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Tab Playground</h1>
            <p class="hero-copy">
                Esta vista permite probar <strong>ETabGroup</strong> y <strong>ETab</strong>
                en modo horizontal y vertical con cambios en tiempo real.
            </p>
        </div>

        <div class="tab-grid">
            <ECard class="tab-card" elevation="md">
                <div class="tab-card__header">
                    <div>
                        <p class="section-kicker">Caso base</p>
                        <h2>Tabs horizontales</h2>
                    </div>
                    <p class="card-copy">
                        Selecciona una opcion para validar estados activos, color e inactivo.
                    </p>
                </div>

                <div class="window-demo">
                    <ETabGroup v-model="state.mainTab" :tab-align="state.align" :grow="state.grow" color="primary"
                        inactive-color="secondary">
                        <ETab value="overview">Overview</ETab>
                        <ETab value="activity">Activity</ETab>
                        <ETab value="settings">Settings</ETab>
                    </ETabGroup>

                    <EWindow v-model="state.mainTab" class="window-stage">
                        <EWindowItem value="overview">
                            <div class="window-pane">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint recusandae
                                possimus et cumque
                                eveniet nihil qui ab nesciunt eaque sapiente error, laboriosam, veniam
                                temporibus, at quas
                                consequatur quae minima harum!</p>
                            </div>
                        </EWindowItem>

                        <EWindowItem value="activity">
                            <div class="window-pane">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint recusandae
                                possimus et cumque
                                eveniet nihil qui ab nesciunt eaque sapiente error, laboriosam, veniam
                                temporibus, at quas
                                consequatur quae minima harum!</p>
                            </div>
                        </EWindowItem>

                        <EWindowItem value="settings">
                            <div class="window-pane">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint recusandae
                                possimus et cumque
                                eveniet nihil qui ab nesciunt eaque sapiente error, laboriosam, veniam
                                temporibus, at quas
                                consequatur quae minima harum!</p>
                            </div>
                        </EWindowItem>
                    </EWindow>
                </div>

                <p class="selected-copy">
                    Tab seleccionada: <strong>{{ state.mainTab }}</strong>
                </p>
            </ECard>

            <ECard class="tab-card" elevation="md">
                <div class="tab-card__header">
                    <div>
                        <p class="section-kicker">Sandbox</p>
                        <h2>Configuracion</h2>
                    </div>
                    <p class="card-copy">
                        Cambia alineacion, grow y orientacion para revisar el comportamiento.
                    </p>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Alineacion</span>
                    <div class="pill-group">
                        <button v-for="option in alignOptions" :key="option" type="button"
                            :class="['pill-button', { 'pill-button--active': state.align === option }]"
                            @click="state.align = option">
                            {{ option }}
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Modo</span>
                    <div class="pill-group">
                        <button type="button" :class="['pill-button', { 'pill-button--active': !state.vertical }]"
                            @click="state.vertical = false">
                            Horizontal
                        </button>
                        <button type="button" :class="['pill-button', { 'pill-button--active': state.vertical }]"
                            @click="state.vertical = true">
                            Vertical
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Ancho</span>
                    <div class="pill-group">
                        <button type="button" :class="['pill-button', { 'pill-button--active': !state.grow }]"
                            @click="state.grow = false">
                            Auto
                        </button>
                        <button type="button" :class="['pill-button', { 'pill-button--active': state.grow }]"
                            @click="state.grow = true">
                            Grow
                        </button>
                    </div>
                </div>

                <div class="preview-stage">
                    <ETabGroup v-model="state.previewTab" :tab-align="state.align" :grow="state.grow"
                        :vertical="state.vertical" color="teal-900" inactive-color="secondary">
                        <ETab value="summary">Summary</ETab>
                        <ETab value="billing">Billing</ETab>
                        <ETab value="security">Security</ETab>
                    </ETabGroup>

                    <EWindow v-model="state.previewTab" class="window-stage">
                        <EWindowItem value="summary">
                            <div class="window-pane">
                                <p>
                                    Vista de resumen para validar la transicion con la configuracion actual.
                                </p>
                            </div>
                        </EWindowItem>

                        <EWindowItem value="billing">
                            <div class="window-pane">
                                <p>
                                    Vista de facturacion para revisar cambios de direccion y animacion al navegar tabs.
                                </p>
                            </div>
                        </EWindowItem>

                        <EWindowItem value="security">
                            <div class="window-pane">
                                <p>
                                    Vista de seguridad para confirmar estados activos y transicion inversa.
                                </p>
                            </div>
                        </EWindowItem>
                    </EWindow>
                </div>

                <pre class="payload-preview">{{ statePreview }}</pre>
            </ECard>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import ECard from "../../src/components/card/index.vue";
import ETab from "../../src/components/tab/index.vue";
import ETabGroup from "../../src/components/tab/group.vue";
import EWindow from "../../src/components/window/index.vue";
import EWindowItem from "../../src/components/window/item.vue";

type TabAlign = "start" | "center" | "end";

type TabSandboxState = {
    mainTab: string;
    previewTab: string;
    align: TabAlign;
    grow: boolean;
    vertical: boolean;
};

const alignOptions: Array<TabAlign> = ["start", "center", "end"];

const state = reactive<TabSandboxState>({
    mainTab: "overview",
    previewTab: "summary",
    align: "center",
    grow: false,
    vertical: false,
});

const statePreview = computed(() => {
    return JSON.stringify(state, null, 2);
});
</script>

<style scoped>
.tab-playground {
    display: grid;
    gap: 24px;
}

.tab-playground__hero {
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

.tab-playground__hero h1,
.tab-card h2 {
    color: #172033;
    margin: 0;
}

.hero-copy,
.card-copy,
.selected-copy {
    color: #596579;
    line-height: 1.6;
    margin: 0;
}

.tab-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.tab-card {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.tab-card__header {
    display: grid;
    gap: 10px;
}

.selected-copy strong {
    color: #172033;
}

.control-group {
    display: grid;
    gap: 10px;
}

.control-group__label {
    color: #51617d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pill-button {
    appearance: none;
    background: #eef2f8;
    border: 1px solid transparent;
    border-radius: 999px;
    color: #34445e;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 12px;
    transition: all 0.2s ease;
}

.pill-button:hover {
    background: #e3eaf4;
}

.pill-button--active {
    background: #172033;
    border-color: #172033;
    color: #f8fbff;
}

.preview-stage {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    padding: 16px;
}

.window-demo {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    overflow: hidden;
}

.window-stage {
    background: #f8fbff;
}

.window-pane {
    padding: 16px;
}

.window-pane p {
    color: #34445e;
    line-height: 1.6;
    margin: 0;
}

.payload-preview {
    background: #111827;
    border-radius: 16px;
    color: #d9e2f1;
    font-size: 12px;
    line-height: 1.55;
    margin: 0;
    overflow: auto;
    padding: 16px;
}

@media (max-width: 640px) {
    .tab-card {
        padding: 18px;
    }
}
</style>
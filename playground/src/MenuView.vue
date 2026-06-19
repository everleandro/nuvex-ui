<template>
    <section class="menu-playground">
        <div class="menu-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Menu Playground</h1>
            <p class="hero-copy">
                Esta vista sirve para probar apertura, cierre, layering y nesting de
                <strong>EMenu</strong> sin mezclarlo con otros componentes.
            </p>
        </div>

        <div class="menu-grid">
            <ECard class="menu-card" elevation="md">
                <p class="section-kicker">Caso base</p>
                <h2>Menu simple</h2>
                <p class="card-copy">
                    Prueba click en activador, click fuera y <strong>Escape</strong>.
                </p>

                <div class="menu-demo-row">
                    <EMenu v-model="simpleMenuOpen" close-on-content-click elevation="sm">
                        <template #activator="activator">
                            <EButton color="primary" v-bind="buildActivatorBindings(activator)">
                                Open Menu
                            </EButton>
                        </template>

                        <div class="menu-surface">
                            <button class="menu-item" type="button">Profile</button>
                            <button class="menu-item" type="button">Billing</button>
                            <button class="menu-item" type="button">Notifications</button>
                        </div>
                    </EMenu>
                </div>

                <div class="menu-demo-row">
                    <EMenu v-model="simpleMenuOpen1">
                        <template #activator="activator">
                            <EButton color="teal-300" v-bind="buildActivatorBindings(activator)">
                                Open Menu
                            </EButton>
                        </template>

                        <div class="menu-surface">
                            <button class="menu-item" type="button">Profile</button>
                            <button class="menu-item" type="button">Billing</button>
                            <button class="menu-item" type="button">Notifications</button>
                        </div>
                    </EMenu>
                </div>

                <div class="menu-demo-row">
                    <EMenu v-model="listMenuOpen">
                        <template #activator="{ attrs }">
                            <EButton color="primary" v-bind="attrs" :icon="iconFactory.arrowUp" />
                        </template>

                        <EList>
                            <EListItem title="Profile" />
                            <EListItem title="Billing and Subscription" />
                            <EListItem title="Notifications" />
                        </EList>
                    </EMenu>
                </div>

                <p class="status-copy">
                    Estado actual: <strong>{{ simpleMenuOpen ? "abierto" : "cerrado" }}</strong>
                </p>
            </ECard>

            <ECard class="menu-card" elevation="md">
                <p class="section-kicker">Caso anidado</p>
                <h2>Menu con submenu</h2>
                <p class="card-copy">
                    El submenu debe cerrar primero con <strong>Escape</strong> o click fuera,
                    manteniendo el menu padre abierto hasta el siguiente dismiss.
                </p>

                <div class="menu-demo-row">
                    <EButton color="teal-900">
                        spacer
                    </EButton>
                    <EMenu v-model="simpleMenuOpen2">
                        <template #activator="activator">
                            <EButton color="teal-300" v-bind="buildActivatorBindings(activator)">
                                Open Menu
                            </EButton>
                        </template>

                        <div class="menu-surface">
                            <button class="menu-item" type="button">Profile</button>
                            <button class="menu-item" type="button">Billing</button>
                            <button class="menu-item" type="button">Notifications</button>
                        </div>
                    </EMenu>

                    <EMenu v-model="parentMenuOpen" origin="bottom left" elevation="lg">
                        <template #activator="activator">
                            <EButton color="secondary" outlined v-bind="buildActivatorBindings(activator)">
                                Open Nested Menu
                            </EButton>
                        </template>

                        <div class="menu-surface menu-surface--wide">
                            <button class="menu-item" type="button">Dashboard</button>
                            <button class="menu-item" type="button">Projects</button>

                            <div class="menu-item menu-item--submenu">
                                <span>More options</span>

                                <EMenu v-model="childMenuOpen" origin="top right" offset-x="-8" elevation="lg">
                                    <template #activator="activator">
                                        <button class="submenu-trigger" type="button"
                                            v-bind="buildActivatorBindings(activator)">
                                            Open Submenu
                                        </button>
                                    </template>

                                    <div class="menu-surface menu-surface--compact">
                                        <button class="menu-item" type="button">Duplicate</button>
                                        <button class="menu-item" type="button">Archive</button>
                                        <button class="menu-item" type="button">Delete</button>
                                    </div>
                                </EMenu>
                            </div>
                        </div>
                    </EMenu>
                </div>

                <div class="status-grid">
                    <p>
                        Padre: <strong>{{ parentMenuOpen ? "abierto" : "cerrado" }}</strong>
                    </p>
                    <p>
                        Hijo: <strong>{{ childMenuOpen ? "abierto" : "cerrado" }}</strong>
                    </p>
                </div>
            </ECard>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EList from "../../src/components/list/index.vue";
import EListItem from "../../src/components/list/item.vue";
import EMenu from "../../src/components/menu/index.vue";

import iconFactory from "../../src/utils/icons";

type ActivatorBindings = {
    onClick?: (evt?: Event) => void;
    onKeydown?: (evt: KeyboardEvent) => void;
    ref?: (value: unknown) => void;
    [key: string]: unknown;
};

const simpleMenuOpen = ref(false);
const simpleMenuOpen1 = ref(false);
const listMenuOpen = ref(false);
const simpleMenuOpen2 = ref(false);
const parentMenuOpen = ref(false);
const childMenuOpen = ref(false);

const buildActivatorBindings = (activator: ActivatorBindings) => ({
    ref: activator.ref,
    onClick: activator.onClick,
    onKeydown: activator.onKeydown,
    "aria-haspopup": activator["aria-haspopup"],
    "aria-expanded": activator["aria-expanded"],
    "aria-controls": activator["aria-controls"],
    "aria-disabled": activator["aria-disabled"],
});
</script>

<style scoped>
.menu-playground {
    display: grid;
    gap: 24px;
}

.menu-playground__hero {
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

.menu-playground__hero h1,
.menu-card h2 {
    color: var(--e-primary-color, #172033);
    margin: 0;
}

.hero-copy,
.card-copy,
.status-copy,
.status-grid p {
    color: var(--e-secondary-color, #596579);
    line-height: 1.6;
    margin: 0;
}

.menu-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.menu-card {
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.menu-demo-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.menu-surface {
    min-width: 220px;
    display: grid;
    gap: 6px;
    padding: 12px;
    border-radius: 16px;
}

.menu-surface--wide {
    min-width: 260px;
}

.menu-surface--compact {
    min-width: 180px;
}

.menu-item,
.submenu-trigger {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    font: inherit;
    padding: 10px 12px;
    text-align: left;
}

.menu-item:hover,
.submenu-trigger:hover {
    background: rgba(23, 32, 51, 0.06);
}

.menu-item--submenu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.status-grid {
    display: grid;
    gap: 6px;
}

@media (max-width: 720px) {
    .menu-card {
        padding: 18px;
    }

    .menu-grid {
        grid-template-columns: 1fr;
    }
}
</style>
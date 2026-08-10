<template>
    <section class="drawer-page">
        <header class="drawer-page__header">
            <p class="drawer-page__eyebrow">Components</p>
            <h2 class="drawer-page__title">Drawer Playground</h2>
            <p class="drawer-page__lead">Ejemplo sencillo de navegacion con las regiones prepend, default y append.</p>
        </header>

        <article class="drawer-demo">
            <div class="drawer-demo__actions">
                <EButton color="primary" outlined @click="drawerOpen = !drawerOpen">
                    {{ drawerOpen ? "Close drawer" : "Open drawer" }}
                </EButton>
            </div>

            <EApp class="drawer-demo__frame">
                <EDrawer v-model="drawerOpen" dev-mode nav width="280px">
                    <template #prepend>
                        <div class="drawer-demo__header">
                            <EIcon :icon="iconFactory.layersOutline" />
                            <strong>Workspace</strong>
                        </div>
                    </template>

                    <EList dense>
                        <EListItem :prepend-icon="iconFactory.home" title="Overview" />
                        <EListItem :prepend-icon="iconFactory.layersOutline" title="Projects" />
                        <EListItem :prepend-icon="iconFactory.cog" title="Settings" />
                    </EList>

                    <template #append>
                        <div class="drawer-demo__footer">
                            <EButton :prepend-icon="iconFactory.account" text block>Account</EButton>
                        </div>
                    </template>
                </EDrawer>
            </EApp>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const drawerOpen = ref(true);
</script>

<style scoped>
.drawer-page {
    display: grid;
    gap: 24px;
}

.drawer-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    opacity: 0.72;
}

.drawer-page__title {
    margin: 4px 0 0;
}

.drawer-page__lead {
    margin: 8px 0 0;
    opacity: 0.78;
}

.drawer-demo {
    display: grid;
    gap: 16px;
}

.drawer-demo__actions {
    display: flex;
    justify-content: flex-end;
}

.drawer-demo__frame {
    position: relative;
    min-height: 420px;
    overflow: hidden;
    border: 1px solid var(--e-color-border);
    border-radius: var(--e-border-radius-root);
    background: var(--e-color-surface-canvas);
}

.drawer-demo__frame :deep(.e-drawer) {
    position: absolute;
}

.drawer-demo__header,
.drawer-demo__footer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
}

.drawer-demo__header {
    border-bottom: 1px solid var(--e-color-border);
}

.drawer-demo__footer {
    border-top: 1px solid var(--e-color-border);
}
</style>

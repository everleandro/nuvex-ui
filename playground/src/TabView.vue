<template>
  <section class="tab-page">
    <header class="tab-page__header">
      <p class="tab-page__eyebrow">Components</p>
      <h2 class="tab-page__title">Tab Examples</h2>
      <p class="tab-page__lead">
        Casos base para validar seleccion, track, paneles enlazados, iconos y orientacion vertical.
      </p>
    </header>

    <article class="tab-demo">
      <h3>Basic tabs with panels</h3>
      <p class="tab-demo__caption">Baseline para revisar indicador, sincronizacion con EWindow y semantica accesible.</p>

      <ETabGroup v-model="primaryTab" color="primary" inactive-color="secondary" track name="account-tabs">
        <ETab value="overview" :to="''">Overview</ETab>
        <ETab value="activity" :to="''">Activity</ETab>
        <ETab value="settings" :to="''">Settings</ETab>
      </ETabGroup>

      <EWindow v-model="primaryTab" name="account-tabs" class="tab-window">
        <EWindowItem value="overview">
          <ECard title="Overview" subtitle="Resumen del workspace activo" elevation="sm">
            Tokens, layout base y estado de navegacion en una sola vista.
          </ECard>
        </EWindowItem>
        <EWindowItem value="activity">
          <ECard title="Activity" subtitle="Eventos recientes" elevation="sm">
            Ideal para probar paneles con contenido real que cambia junto al tab activo.
          </ECard>
        </EWindowItem>
        <EWindowItem value="settings">
          <ECard title="Settings" subtitle="Preferencias del componente" elevation="sm">
            Usa este caso para revisar IDs accesibles y foco con teclado.
          </ECard>
        </EWindowItem>
      </EWindow>

      <p class="tab-demo__state">Active tab: {{ primaryTab }}</p>
    </article>

    <article class="tab-demo">
      <h3>Grow and icon tabs</h3>
      <p class="tab-demo__caption">Comparativa para ancho distribuido, iconografia y cambio de color inactivo.</p>

      <ETabGroup v-model="featureTab" grow color="teal-900" inactive-color="secondary" tab-align="start">
        <ETab value="design" :icon="iconFactory.designSystem" :to="''">Design</ETab>
        <ETab value="docs" :icon="iconFactory.introduction" :to="''">Docs</ETab>
        <ETab value="release" :icon="iconFactory.rocket" :to="''">Release</ETab>
      </ETabGroup>

      <div class="tab-highlight-grid">
        <ECard
          v-for="item in featureItems"
          :key="item.value"
          :title="item.title"
          :subtitle="item.subtitle"
          elevation="sm"
          :class="['tab-highlight-card', { 'tab-highlight-card--active': featureTab === item.value }]"
        >
          {{ item.body }}
        </ECard>
      </div>

      <p class="tab-demo__state">Feature focus: {{ featureTab }}</p>
    </article>

    <article class="tab-demo">
      <h3>Vertical navigation</h3>
      <p class="tab-demo__caption">Escenario para probar ArrowUp, ArrowDown, Home y End junto a un panel lateral.</p>

      <div class="tab-vertical-layout">
        <ETabGroup
          v-model="verticalTab"
          vertical
          track
          color="success"
          inactive-color="secondary"
          name="workspace-tabs"
        >
          <ETab value="foundation" :icon="iconFactory.foundation" :to="''">Foundation</ETab>
          <ETab value="components" :icon="iconFactory.components" :to="''">Components</ETab>
          <ETab value="utilities" :icon="iconFactory.utilities" :to="''">Utilities</ETab>
        </ETabGroup>

        <EWindow v-model="verticalTab" name="workspace-tabs" class="tab-window tab-window--vertical">
          <EWindowItem value="foundation">
            <ECard title="Foundation" subtitle="Tokens, color y spacing" elevation="sm">
              Revisa alineacion visual entre indicador vertical y contenido del panel.
            </ECard>
          </EWindowItem>
          <EWindowItem value="components">
            <ECard title="Components" subtitle="Inventario de bloques UI" elevation="sm">
              Buen caso para verificar navegacion por teclado y persistencia del estado activo.
            </ECard>
          </EWindowItem>
          <EWindowItem value="utilities">
            <ECard title="Utilities" subtitle="Helpers y shortcuts" elevation="sm">
              Permite revisar densidad y espaciado cuando el tablist cambia a columna.
            </ECard>
          </EWindowItem>
        </EWindow>
      </div>

      <p class="tab-demo__state">Vertical tab: {{ verticalTab }}</p>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const primaryTab = ref("overview");
const featureTab = ref("design");
const verticalTab = ref("foundation");

const featureItems = [
  {
    value: "design",
    title: "Design review",
    subtitle: "Visual regression",
    body: "Valida el comportamiento del indicador y la distribucion de ancho cuando grow esta activo.",
  },
  {
    value: "docs",
    title: "Docs sync",
    subtitle: "Content parity",
    body: "Sirve para contrastar etiquetas largas, iconos y estados inactivos sin paneles complejos.",
  },
  {
    value: "release",
    title: "Release prep",
    subtitle: "QA checklist",
    body: "Usa este bloque para revisar feedback visual rapido mientras cambia el tab activo.",
  },
];
</script>

<style scoped>
.tab-page {
  display: grid;
  gap: 20px;
}

.tab-page__header {
  display: grid;
  gap: 8px;
}

.tab-page__eyebrow {
  color: var(--e-color-primary);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.tab-page__title {
  margin: 0;
}

.tab-page__lead {
  color: var(--e-color-on-surface-variant, rgba(0, 0, 0, 0.64));
  margin: 0;
  max-width: 72ch;
}

.tab-demo {
  display: grid;
  gap: 16px;
}

.tab-demo h3,
.tab-demo__caption,
.tab-demo__state {
  margin: 0;
}

.tab-demo__caption {
  color: var(--e-color-on-surface-variant, rgba(0, 0, 0, 0.64));
}

.tab-demo__state {
  color: var(--e-color-on-surface-variant, rgba(0, 0, 0, 0.72));
  font-size: 0.95rem;
}

.tab-window {
  min-height: 120px;
}

.tab-highlight-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.tab-highlight-card {
  border: 1px solid transparent;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.tab-highlight-card--active {
  border-color: var(--e-color-teal-900, currentColor);
  transform: translateY(-2px);
}

.tab-vertical-layout {
  display: grid;
  gap: 20px;
}

.tab-window--vertical {
  min-height: 160px;
}

@media (min-width: 900px) {
  .tab-vertical-layout {
    align-items: start;
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  }
}
</style>
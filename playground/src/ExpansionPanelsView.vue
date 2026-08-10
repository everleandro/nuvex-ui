<template>
  <section class="expansion-page">
    <header class="expansion-page__header">
      <p class="expansion-page__eyebrow">Components</p>
      <h2 class="expansion-page__title">Expansion Panels Examples</h2>
      <p class="expansion-page__lead">
        Primera vista real del playground: casos base para validar estado, estilos y API de EExpansionPanels.
      </p>
    </header>

    <article class="expansion-demo">
      <h3>Accordion</h3>
      <p class="expansion-demo__caption">Solo un panel abierto a la vez.</p>

      <EExpansionPanels v-model="accordionValue" accordion color="primary" elevation="sm">
        <EExpansionPanel value="api" header-title="API">
          Define estructura de props, eventos y slots en un solo lugar.
        </EExpansionPanel>
        <EExpansionPanel value="states" header-title="State handling">
          Usa el valor actual para sincronizar UI y pruebas manuales.
        </EExpansionPanel>
        <EExpansionPanel value="accessibility" header-title="Accessibility">
          Incluye aria-expanded, aria-controls y comportamiento de foco en cada toggle.
        </EExpansionPanel>
      </EExpansionPanels>

      <p class="expansion-demo__state">Valor actual: {{ accordionValue || "none" }}</p>
    </article>

    <article class="expansion-demo">
      <h3>Multiple</h3>
      <p class="expansion-demo__caption">Permite abrir varios paneles al mismo tiempo.</p>

      <EExpansionPanels v-model="multipleValue" color="secondary" elevation="sm">
        <EExpansionPanel value="design" header-title="Design tokens">
          Verifica contraste en tema claro y oscuro, junto al espaciado por defecto.
        </EExpansionPanel>
        <EExpansionPanel value="motion" header-title="Motion and transitions">
          Revisa altura animada y rotacion del icono al abrir/cerrar.
        </EExpansionPanel>
        <EExpansionPanel value="integration" header-title="Integration">
          Prueba interaccion con otros componentes dentro del body.
        </EExpansionPanel>
      </EExpansionPanels>

      <p class="expansion-demo__state">
        Valores actuales: {{ multipleValue.length ? multipleValue.join(", ") : "none" }}
      </p>
    </article>

    <article class="expansion-demo">
      <h3>Disabled + custom icons</h3>
      <p class="expansion-demo__caption">Escenario para validar estados bloqueados y override visual.</p>

      <EExpansionPanels color="teal-900" >
        <EExpansionPanel
          header-title="Custom icon"
          :toggle-icon="iconFactory.accountBox"
          disable-icon-rotation
        >
          Icono fijo con rotacion deshabilitada para casos de UI especifica.
        </EExpansionPanel>

        <EExpansionPanel
          header-title="Disabled panel"
          disabled
          value="disabled"
        >
          Este contenido no debe abrirse al hacer click en el header.
        </EExpansionPanel>
      </EExpansionPanels>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const accordionValue = ref("api");
const multipleValue = ref(["design"]);
</script>

<style scoped>
.expansion-page {
  display: grid;
  gap: 20px;
}

.expansion-page__header {
  display: grid;
  gap: 6px;
}

.expansion-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.expansion-page__title {
  margin: 0;
}

.expansion-page__lead {
  margin: 0;
  opacity: 0.84;
}

.expansion-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.expansion-demo h3 {
  margin: 0;
}

.expansion-demo__caption {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.expansion-demo__state {
  margin: 0;
  font-size: 13px;
  opacity: 0.78;
}
</style>

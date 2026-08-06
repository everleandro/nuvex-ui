<template>
  <section class="grid-page">
    <header class="grid-page__header">
      <p class="grid-page__eyebrow">Components</p>
      <h2 class="grid-page__title">Grid Playground</h2>
      <p class="grid-page__lead">
        Playground equivalente a la doc de Grid para validar ERow y ECol con casos interactivos y patrones de composicion.
      </p>
    </header>

    <article class="grid-demo">
      <h3>Usage (interactive)</h3>
      <p class="grid-demo__caption">
        Ajusta gap, cols y modificadores de fila para ver como responde el layout con el mismo contenido.
      </p>

      <EForm class="grid-controls">
        <ESelect v-model="rowState.gap" cols="24" md="8" :items="gaps" label="gap" />
        <ESelect v-model="rowState.cols" cols="24" md="8" :items="colSpans" label="cols" />

        <ECheckbox v-model="rowState.dense" cols="24" md="4" label="dense" color="primary" />
        <ECheckbox v-model="rowState.auto" cols="24" md="4" label="auto" color="primary" />
        <ECheckbox v-model="rowState.equal" cols="24" md="4" label="equal" color="primary" />
        <ECheckbox v-model="rowState.noGutters" cols="24" md="4" label="noGutters" color="primary" />
      </EForm>

      <div class="grid-surface">
        <ERow class="full-width" :dense="rowState.dense" :auto="rowState.auto" :equal="rowState.equal"
          :no-gutters="rowState.noGutters" :gap="rowState.gap">
          <ECol v-for="item in previewColumns" :key="item.title" :cols="rowState.cols" >
            <ECard outlined class="full-height" :title="item.title" :description="item.description" />
          </ECol>
        </ERow>
      </div>

      <pre class="grid-snippet">{{ usageSnippet }}</pre>
    </article>

    <article class="grid-demo">
      <h3>Responsive breakpoints</h3>
      <p class="grid-demo__caption">
        Define spans mobile-first con cols y breakpoints como md/lg para escalar la distribucion.
      </p>

      <div class="grid-surface">
        <ERow class="full-width" gap="md">
          <ECol cols="12" md="8" lg="9">
            <ECard elevation="sm" title="Main content" description="Spans most of the row on medium and large screens." />
          </ECol>
          <ECol cols="12" md="4" lg="3">
            <ECard outlined title="Sidebar" description="Stacks below content on mobile and aligns beside it from md." />
          </ECol>
        </ERow>
      </div>
    </article>

    <article class="grid-demo">
      <h3>Row modes</h3>
      <p class="grid-demo__caption">
        Referencias rapidas para dense, equal y no-gutters sobre la misma base de columnas.
      </p>

      <div class="grid-stack">
        <div class="grid-surface">
          <ERow class="full-width" dense gap="sm">
            <ECol cols="12" md="4">
              <ECard outlined title="dense" description="Tighter gutters for compact interfaces." />
            </ECol>
            <ECol cols="12" md="4">
              <ECard outlined title="dense" description="Track packing favors filling earlier gaps." />
            </ECol>
            <ECol cols="12" md="4">
              <ECard outlined title="dense" description="Useful when content cards are mixed in height." />
            </ECol>
          </ERow>
        </div>

        <div class="grid-surface">
          <ERow class="full-width" equal gap="sm">
            <ECol cols="12" md="4">
              <ECard outlined title="equal" description="Columns stretch to equal row height." />
            </ECol>
            <ECol cols="12" md="4">
              <ECard outlined title="equal" description="Supports cards with different content length." />
            </ECol>
            <ECol cols="12" md="4">
              <ECard outlined title="equal" description="Keeps visual rhythm in dashboard rows." />
            </ECol>
          </ERow>
        </div>

        <div class="grid-surface">
          <ERow class="full-width" no-gutters>
            <ECol cols="12" md="4">
              <ECard outlined title="no-gutters" description="Removes horizontal and vertical gutters." />
            </ECol>
            <ECol cols="12" md="4">
              <ECard outlined title="no-gutters" description="Useful for edge-to-edge compositions." />
            </ECol>
            <ECol cols="12" md="4">
              <ECard outlined title="no-gutters" description="Combine with component spacing when needed." />
            </ECol>
          </ERow>
        </div>
      </div>
    </article>

    <article class="grid-demo">
      <h3>Nested layouts</h3>
      <p class="grid-demo__caption">
        Anida una fila interna dentro de una columna solo cuando una region necesite sub-grid local.
      </p>

      <div class="grid-surface">
        <ERow class="full-width" gap="md">
          <ECol cols="12" lg="8">
            <ECard class="mb-3" elevation="sm" title="Primary column" />
            <ERow gap="sm">
              <ECol cols="12" md="6">
                <ECard outlined title="Nested A" />
              </ECol>
              <ECol cols="12" md="6">
                <ECard outlined title="Nested B" />
              </ECol>
            </ERow>
          </ECol>

          <ECol cols="12" lg="4">
            <ECard outlined title="Support rail" description="Use for filters, context, or quick actions." />
          </ECol>
        </ERow>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, reactive } from "vue";

const rowState = reactive({
  gap: "md",
  cols: "12",
  dense: false,
  auto: false,
  equal: false,
  noGutters: false,
});

const gaps = ["none", "xs", "sm", "md", "lg", "8", "16", "24"];
const colSpans = ["12", "6", "4", "3", "auto"];

const previewColumns = computed(() => [
  { title: "Column A", description: "Replace with section, metrics, or form content." },
  { title: "Column B", description: "Replace with section, metrics, or form content." },
  { title: "Column C", description: "Replace with section, metrics, or form content." },
]);

const usageSnippet = computed(() => {
  const attrs = [
    rowState.gap ? `gap=\"${rowState.gap}\"` : "",
    rowState.dense ? "dense" : "",
    rowState.auto ? "auto" : "",
    rowState.equal ? "equal" : "",
    rowState.noGutters ? "no-gutters" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `<ERow ${attrs}>\n  <ECol cols=\"${rowState.cols}\" md=\"4\">\n    <ECard title=\"Column A\" />\n  </ECol>\n  <ECol cols=\"${rowState.cols}\" md=\"4\">\n    <ECard title=\"Column B\" />\n  </ECol>\n  <ECol cols=\"${rowState.cols}\" md=\"4\">\n    <ECard title=\"Column C\" />\n  </ECol>\n</ERow>`;
});
</script>

<style scoped>
.grid-page {
  display: grid;
  gap: 20px;
}

.grid-page__header {
  display: grid;
  gap: 6px;
}

.grid-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.grid-page__title {
  margin: 0;
}

.grid-page__lead {
  margin: 0;
  opacity: 0.84;
}

.grid-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.grid-demo h3 {
  margin: 0;
}

.grid-demo__caption {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.grid-controls {
  margin-top: 8px;
}

.grid-stack {
  display: grid;
  gap: 12px;
}

.grid-surface {
  border: 1px dashed var(--e-color-border, rgba(0, 0, 0, 0.12));
  border-radius: 12px;
  padding: 12px;
}

.grid-snippet {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
  border: 1px solid var(--e-color-border, rgba(0, 0, 0, 0.12));
}
</style>

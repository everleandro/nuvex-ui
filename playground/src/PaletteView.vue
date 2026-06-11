<template>
  <section class="palette-page">
    <div class="hero-card">
      <div>
        <p class="eyebrow">Primitive Palette</p>
        <h2>Paleta publica de Nuvex UI</h2>
        <p class="lead">
          Esta vista muestra las CSS vars generadas automaticamente como
          <code>--e-palette-red-500</code> para que puedas validar tonos,
          contraste y combinaciones en runtime.
        </p>
      </div>

      <div class="hero-actions">
        <div class="token-preview">
          <span>Base</span>
          <strong>{{ selectedFamily }}</strong>
          <code>{{ selectedBaseToken }}</code>
        </div>

        <div class="tone-picker" role="tablist" aria-label="Select palette family">
          <button
            v-for="family in families"
            :key="family"
            class="tone-chip"
            :class="{ 'tone-chip--active': family === selectedFamily }"
            type="button"
            @click="selectedFamily = family"
          >
            {{ family }}
          </button>
        </div>
      </div>
    </div>

    <section class="block palette-overview">
      <div class="section-head">
        <div>
          <h3>Preview rapido</h3>
          <p>
            Cada tarjeta usa la variable CSS real. Si el usuario redefine
            <code>$primitive-color-seeds</code>, este preview cambia solo.
          </p>
        </div>
      </div>

      <div class="family-grid">
        <article v-for="family in families" :key="family" class="family-card">
          <div class="family-card__swatch" :style="baseSwatchStyle(family)"></div>
          <div class="family-card__body">
            <strong>{{ family }}</strong>
            <code>{{ baseToken(family) }}</code>
          </div>
        </article>
      </div>
    </section>

    <section class="block">
      <div class="section-head">
        <div>
          <h3>Escala {{ selectedFamily }}</h3>
          <p>Tokens disponibles desde 50 hasta 900.</p>
        </div>
      </div>

      <div class="swatch-grid">
        <article
          v-for="tone in tones"
          :key="tone"
          class="swatch-card"
          :style="toneSwatchStyle(selectedFamily, tone)"
        >
          <div class="swatch-card__meta">
            <span>{{ tone }}</span>
            <code>{{ toneToken(selectedFamily, tone) }}</code>
          </div>
        </article>
      </div>
    </section>

    <section class="block">
      <div class="section-head">
        <div>
          <h3>Uso sugerido</h3>
          <p>Ejemplos rapidos de consumo desde una app que instala la libreria.</p>
        </div>
      </div>

      <div class="example-grid">
        <article class="example-card" :style="exampleSurfaceStyle('50', '800')">
          <span class="example-label">Surface tint</span>
          <strong>{{ selectedFamily }} 50 / 800</strong>
          <code>background: var({{ toneToken(selectedFamily, 50) }})</code>
        </article>

        <article class="example-card" :style="exampleSurfaceStyle('500', '50')">
          <span class="example-label">Accent solid</span>
          <strong>{{ selectedFamily }} 500 / 50</strong>
          <code>background: var({{ toneToken(selectedFamily, 500) }})</code>
        </article>

        <article class="example-card" :style="exampleSurfaceStyle('700', '50')">
          <span class="example-label">Strong emphasis</span>
          <strong>{{ selectedFamily }} 700 / 50</strong>
          <code>color: var({{ toneToken(selectedFamily, 50) }})</code>
        </article>
      </div>

      <pre class="code-sample"><code>$primitive-color-seeds: (
  {{ selectedFamily }}: #2563eb,
);

$primitive-color-overrides: (
  {{ selectedFamily }}: (
    700: #1d4ed8,
  ),
);

@import "nuvex-ui/setting.scss";</code></pre>
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const families = [
  "red",
  "pink",
  "purple",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "brown",
  "neutral",
];

const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const selectedFamily = ref("blue");

const selectedBaseToken = computed(() => baseToken(selectedFamily.value));

function baseToken(family) {
  return `--e-palette-${family}`;
}

function toneToken(family, tone) {
  return `--e-palette-${family}-${tone}`;
}

function baseSwatchStyle(family) {
  return {
    background: `var(${baseToken(family)})`,
    color: "white",
  };
}

function toneSwatchStyle(family, tone) {
  const foregroundTone = tone >= 500 ? 50 : 900;

  return {
    background: `var(${toneToken(family, tone)})`,
    color: `var(${toneToken(family, foregroundTone)})`,
  };
}

function exampleSurfaceStyle(backgroundTone, textTone) {
  return {
    background: `var(${toneToken(selectedFamily.value, backgroundTone)})`,
    color: `var(${toneToken(selectedFamily.value, textTone)})`,
    borderColor: `var(${toneToken(selectedFamily.value, 200)})`,
  };
}
</script>

<style scoped>
.palette-page {
  display: grid;
  gap: 24px;
}

.hero-card,
.block {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
}

.hero-card {
  display: grid;
  gap: 20px;
  padding: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-card h2,
.section-head h3 {
  margin: 0;
  color: #0f172a;
}

.lead,
.section-head p {
  margin: 8px 0 0;
  color: #475569;
  line-height: 1.6;
}

.hero-actions {
  display: grid;
  gap: 16px;
}

.token-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.04);
  color: #0f172a;
}

.token-preview code,
.swatch-card code,
.family-card code,
.example-card code,
.lead code {
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
}

.tone-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tone-chip {
  padding: 10px 14px;
  border: 0;
  border-radius: 999px;
  background: #e2e8f0;
  color: #0f172a;
  cursor: pointer;
  font-weight: 600;
}

.tone-chip--active {
  background: #0f172a;
  color: #f8fafc;
}

.block {
  padding: 24px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
}

.family-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}

.family-card {
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: white;
}

.family-card__swatch {
  height: 78px;
}

.family-card__body {
  display: grid;
  gap: 6px;
  padding: 14px;
  color: #0f172a;
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 14px;
}

.swatch-card {
  min-height: 132px;
  padding: 16px;
  border-radius: 18px;
  display: flex;
  align-items: end;
}

.swatch-card__meta {
  display: grid;
  gap: 6px;
}

.swatch-card__meta span {
  font-size: 20px;
  font-weight: 700;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.example-card {
  display: grid;
  gap: 10px;
  min-height: 140px;
  padding: 18px;
  border: 1px solid transparent;
  border-radius: 18px;
}

.example-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}

.code-sample {
  overflow-x: auto;
  margin: 20px 0 0;
  padding: 16px;
  border-radius: 16px;
  background: #0f172a;
  color: #e2e8f0;
}

@media (max-width: 720px) {
  .hero-card,
  .block {
    padding: 18px;
  }

  .swatch-grid,
  .family-grid,
  .example-grid {
    grid-template-columns: 1fr;
  }
}

:global([data-theme="dark"]) .hero-card,
:global([data-theme="dark"]) .block {
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.4);
}

:global([data-theme="dark"]) .eyebrow,
:global([data-theme="dark"]) .lead,
:global([data-theme="dark"]) .section-head p,
:global([data-theme="dark"]) .family-card__body,
:global([data-theme="dark"]) .token-preview {
  color: #cbd5e1;
}

:global([data-theme="dark"]) .hero-card h2,
:global([data-theme="dark"]) .section-head h3 {
  color: #f8fafc;
}

:global([data-theme="dark"]) .family-card,
:global([data-theme="dark"]) .token-preview {
  background: rgba(15, 23, 42, 0.66);
  border-color: rgba(148, 163, 184, 0.18);
}

:global([data-theme="dark"]) .tone-chip {
  background: rgba(148, 163, 184, 0.18);
  color: #e2e8f0;
}

:global([data-theme="dark"]) .tone-chip--active {
  background: #f8fafc;
  color: #0f172a;
}
</style>
<template>
  <section class="alignment-page">
    <header class="alignment-page__header">
      <p class="alignment-page__eyebrow">Migration QA</p>
      <h2 class="alignment-page__title">Field Alignment Review</h2>
      <p class="alignment-page__lead">
        Vista de comparacion para validar la alineacion vertical entre controles que comparten EField.
      </p>
    </header>

    <article class="alignment-panel">
      <h3>Text Inputs</h3>
      <EForm>
        <ETextfield
          v-model="name"
          label="Name"
          prefix="@"
          append-inner-icon="mdi-magnify"
          detail="Prefix + append-inner"
          lg="4"
        />

        <ETextfield
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          clearable
          detail="Prepend-inner + clearable"
          lg="4"
        />

        <ETextarea
          v-model="bio"
          label="Bio"
          auto-grow
          rows="2"
          max-rows="5"
          clearable
          detail="Textarea autogrow"
          lg="4"
        />
      </EForm>
    </article>

    <article class="alignment-panel">
      <h3>Select + Chips</h3>
      <EForm>
        <ESelect
          v-model="country"
          :items="countries"
          item-title="label"
          item-value="value"
          label="Country"
          clearable
          detail="Select simple"
          lg="6"
        />

        <ESelect
          v-model="tags"
          :items="tagItems"
          item-title="label"
          item-value="value"
          label="Tags"
          multiple
          chips
          closable-chips
          detail="Select chips"
          lg="6"
        />
      </EForm>
    </article>

    <article class="alignment-panel">
      <h3>Selection Controls</h3>
      <EForm>
        <ECheckbox
          v-model="acceptTerms"
          label="Accept terms"
          detail="Checkbox alignment"
          lg="6"
        />

        <ERadioGroup v-model="tier" label="Plan tier" detail="Radio alignment" lg="6">
          <ERadio model-value="starter" label="Starter" />
          <ERadio model-value="pro" label="Pro" />
          <ERadio model-value="enterprise" label="Enterprise" />
        </ERadioGroup>
      </EForm>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
const bio = ref("");
const country = ref(null);
const tags = ref(["api"]);
const acceptTerms = ref(false);
const tier = ref("pro");

const countries = [
  { label: "Mexico", value: "mx" },
  { label: "Spain", value: "es" },
  { label: "Argentina", value: "ar" },
];

const tagItems = [
  { label: "API", value: "api" },
  { label: "Docs", value: "docs" },
  { label: "Design", value: "design" },
  { label: "QA", value: "qa" },
];
</script>

<style scoped>
.alignment-page {
  display: grid;
  gap: 20px;
}

.alignment-page__header {
  display: grid;
  gap: 6px;
}

.alignment-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.alignment-page__title {
  margin: 0;
}

.alignment-page__lead {
  margin: 0;
  opacity: 0.84;
}

.alignment-panel {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.alignment-panel h3 {
  margin: 0;
}
</style>

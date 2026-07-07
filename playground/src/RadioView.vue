<template>
  <section class="radio-page">
    <header class="radio-page__header">
      <p class="radio-page__eyebrow">Components</p>
      <h2 class="radio-page__title">Radio Examples</h2>
      <p class="radio-page__lead">
        Escenarios para validar alineacion de ERadioGroup con la arquitectura nueva de EField.
      </p>
    </header>

    <article class="radio-demo">
      <h3>Basic alignment</h3>
      <p class="radio-demo__caption">Comparativa visual de opciones en columna y fila.</p>

      <EForm>
        <ERadioGroup v-model="plan" label="Plan" detail="Default column layout" lg="6">
          <ERadio model-value="starter" label="Starter" />
          <ERadio model-value="pro" label="Pro" />
          <ERadio model-value="enterprise" label="Enterprise" />
        </ERadioGroup>

        <ERadioGroup v-model="billing" label="Billing" row detail="Row layout" lg="6">
          <ERadio model-value="monthly" label="Monthly" />
          <ERadio model-value="yearly" label="Yearly" />
        </ERadioGroup>
      </EForm>
    </article>

    <article class="radio-demo">
      <h3>Validation and mandatory</h3>
      <p class="radio-demo__caption">Reglas de seleccion requerida y comportamiento en submit.</p>

      <EForm v-model="isValid" validate-on-submit @submit="onSubmit" @submit-invalid="onInvalid">
        <ERadioGroup v-model="channel" label="Preferred channel" :rules="requiredRule" detail="Required" lg="6">
          <ERadio model-value="email" label="Email" />
          <ERadio model-value="sms" label="SMS" />
          <ERadio model-value="push" label="Push" />
        </ERadioGroup>

        <ERadioGroup v-model="language" label="Language" mandatory detail="Mandatory fallback" lg="6">
          <ERadio model-value="en" label="English" />
          <ERadio model-value="es" label="Spanish" />
        </ERadioGroup>

        <div class="radio-demo__actions">
          <EButton type="submit" color="primary">Submit</EButton>
          <EButton type="button" outlined @click="resetDemo">Reset</EButton>
        </div>
      </EForm>

      <p class="radio-demo__state">Form valid: {{ isValid ? "yes" : "no" }}</p>
      <p class="radio-demo__state">Last action: {{ submitState }}</p>
    </article>

    <article class="radio-demo">
      <h3>Dense, readonly and disabled</h3>
      <p class="radio-demo__caption">Casos no interactivos para inspeccionar metrica final.</p>

      <EForm>
        <ERadioGroup v-model="denseMode" dense label="Dense options" lg="4">
          <ERadio model-value="a" label="Mode A" />
          <ERadio model-value="b" label="Mode B" />
        </ERadioGroup>

        <ERadioGroup :model-value="readonlyMode" readonly label="Readonly group" lg="4">
          <ERadio model-value="x" label="Option X" />
          <ERadio model-value="y" label="Option Y" />
        </ERadioGroup>

        <ERadioGroup :model-value="disabledMode" disabled label="Disabled group" lg="4">
          <ERadio model-value="on" label="On" />
          <ERadio model-value="off" label="Off" />
        </ERadioGroup>
      </EForm>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";

const plan = ref("pro");
const billing = ref("monthly");

const channel = ref(undefined);
const language = ref(undefined);
const isValid = ref(false);
const submitState = ref("No submit yet");

const denseMode = ref("a");
const readonlyMode = ref("x");
const disabledMode = ref("off");

const requiredRule = [
  (value) => !!value || "Please select one option",
];

const onSubmit = () => {
  submitState.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const onInvalid = () => {
  submitState.value = "Validation blocked submission";
};

const resetDemo = () => {
  channel.value = undefined;
  language.value = undefined;
  submitState.value = "Demo reset";
};
</script>

<style scoped>
.radio-page {
  display: grid;
  gap: 20px;
}

.radio-page__header {
  display: grid;
  gap: 6px;
}

.radio-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.radio-page__title {
  margin: 0;
}

.radio-page__lead {
  margin: 0;
  opacity: 0.84;
}

.radio-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.radio-demo h3 {
  margin: 0;
}

.radio-demo__caption {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.radio-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.radio-demo__state {
  margin: 0;
  font-size: 13px;
  opacity: 0.78;
}
</style>

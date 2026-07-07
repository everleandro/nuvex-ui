<template>
  <section class="checkbox-page">
    <header class="checkbox-page__header">
      <p class="checkbox-page__eyebrow">Components</p>
      <h2 class="checkbox-page__title">Checkbox Examples</h2>
      <p class="checkbox-page__lead">
        Escenarios para revisar alineacion visual y estados de ECheckbox tras la migracion de EField.
      </p>
    </header>

    <article class="checkbox-demo">
      <h3>Basic alignment</h3>
      <p class="checkbox-demo__caption">Validacion del control y label en casos simples.</p>

      <EForm>
        <ECheckbox v-model="termsAccepted" label="I accept terms and conditions" lg="6" />
        <ECheckbox v-model="newsletter" label="Subscribe to product updates" lg="6" detail="Optional" />
      </EForm>
    </article>

    <article class="checkbox-demo">
      <h3>Validation in form</h3>
      <p class="checkbox-demo__caption">Reglas y detalle de error para revisar espaciado con mensajes.</p>

      <EForm v-model="isValid" validate-on-submit @submit="onSubmit" @submit-invalid="onInvalid">
        <ECheckbox
          v-model="privacyPolicy"
          label="I have read the privacy policy"
          :rules="requiredRule"
          detail="Required to continue"
          lg="6"
        />

        <ECheckbox
          v-model="securityNotices"
          label="Receive security notices"
          detail="Recommended"
          lg="6"
        />

        <div class="checkbox-demo__actions">
          <EButton type="submit" color="primary">Submit</EButton>
          <EButton type="button" outlined @click="resetDemo">Reset</EButton>
        </div>
      </EForm>

      <p class="checkbox-demo__state">Form valid: {{ isValid ? "yes" : "no" }}</p>
      <p class="checkbox-demo__state">Last action: {{ submitState }}</p>
    </article>

    <article class="checkbox-demo">
      <h3>Dense, readonly and disabled</h3>
      <p class="checkbox-demo__caption">Casos comunes para inspeccionar metrica y no interactividad.</p>

      <EForm>
        <ECheckbox v-model="denseChoice" dense label="Dense checkbox" lg="4" />
        <ECheckbox :model-value="true" readonly label="Readonly checked" lg="4" />
        <ECheckbox :model-value="false" disabled label="Disabled unchecked" lg="4" />
      </EForm>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";

const termsAccepted = ref(false);
const newsletter = ref(true);

const privacyPolicy = ref(false);
const securityNotices = ref(true);
const isValid = ref(false);
const submitState = ref("No submit yet");

const denseChoice = ref(true);

const requiredRule = [
  (value) => value === true || "This checkbox is required",
];

const onSubmit = () => {
  submitState.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const onInvalid = () => {
  submitState.value = "Validation blocked submission";
};

const resetDemo = () => {
  privacyPolicy.value = false;
  securityNotices.value = true;
  submitState.value = "Demo reset";
};
</script>

<style scoped>
.checkbox-page {
  display: grid;
  gap: 20px;
}

.checkbox-page__header {
  display: grid;
  gap: 6px;
}

.checkbox-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.checkbox-page__title {
  margin: 0;
}

.checkbox-page__lead {
  margin: 0;
  opacity: 0.84;
}

.checkbox-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.checkbox-demo h3 {
  margin: 0;
}

.checkbox-demo__caption {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.checkbox-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-demo__state {
  margin: 0;
  font-size: 13px;
  opacity: 0.78;
}
</style>

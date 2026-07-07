<template>
  <section class="switch-page">
    <header class="switch-page__header">
      <p class="switch-page__eyebrow">Components</p>
      <h2 class="switch-page__title">Switch Examples</h2>
      <p class="switch-page__lead">
        Escenarios para validar interaccion, estados y alineamiento de ESwitch.
      </p>
    </header>

    <article class="switch-demo">
      <h3>Basic usage</h3>
      <EForm>
        <ESwitch v-model="notifications" label="Notifications" detail="Default" lg="4" />
        <ESwitch v-model="marketing" label="Marketing emails" color="success" lg="4" />
        <ESwitch v-model="betaFeatures" label="Beta features" color="info" lg="4" />
      </EForm>

      <p class="switch-demo__state">notifications: {{ notifications }}</p>
      <p class="switch-demo__state">marketing: {{ marketing }}</p>
      <p class="switch-demo__state">betaFeatures: {{ betaFeatures }}</p>
    </article>

    <article class="switch-demo">
      <h3>Validation and mandatory</h3>
      <EForm v-model="isValid" validate-on-submit @submit="onSubmit" @submit-invalid="onInvalid">
        <ESwitch
          v-model="acceptTerms"
          label="Accept terms and conditions"
          :rules="mustBeTrueRule"
          detail="Required to submit"
          lg="6"
        />

        <ESwitch v-model="acceptPrivacy" label="Accept privacy policy" mandatory detail="Mandatory" lg="6" />

        <div class="switch-demo__actions">
          <EButton type="submit" color="primary">Submit</EButton>
          <EButton type="button" outlined @click="resetValidation">Reset</EButton>
        </div>
      </EForm>

      <p class="switch-demo__state">Form valid: {{ isValid ? "yes" : "no" }}</p>
      <p class="switch-demo__state">Last action: {{ submitState }}</p>
    </article>

    <article class="switch-demo">
      <h3>Dense, disabled and readonly</h3>
      <EForm>
        <ESwitch v-model="denseMode" dense label="Dense mode" lg="4" />
        <ESwitch :model-value="disabledOn" disabled label="Disabled on" lg="4" />
        <ESwitch :model-value="readonlyOff" readonly label="Readonly off" lg="4" />
      </EForm>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";

const notifications = ref(true);
const marketing = ref(false);
const betaFeatures = ref(true);

const acceptTerms = ref(false);
const acceptPrivacy = ref(true);
const isValid = ref(false);
const submitState = ref("No submit yet");

const denseMode = ref(true);
const disabledOn = ref(true);
const readonlyOff = ref(false);

const mustBeTrueRule = [
  (value) => value === true || "You must accept terms",
];

const onSubmit = () => {
  submitState.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const onInvalid = () => {
  submitState.value = "Validation blocked submission";
};

const resetValidation = () => {
  acceptTerms.value = false;
  acceptPrivacy.value = true;
  submitState.value = "Demo reset";
};
</script>

<style scoped>
.switch-page {
  display: grid;
  gap: 20px;
}

.switch-page__header {
  display: grid;
  gap: 6px;
}

.switch-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.switch-page__title {
  margin: 0;
}

.switch-page__lead {
  margin: 0;
  opacity: 0.84;
}

.switch-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.switch-demo h3 {
  margin: 0;
}

.switch-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.switch-demo__state {
  margin: 0;
  font-size: 13px;
  opacity: 0.78;
}
</style>

<template>
  <section class="form-page">
    <header class="form-page__header">
      <p class="form-page__eyebrow">Components</p>
      <h2 class="form-page__title">Form Playground</h2>
      <p class="form-page__lead">
        Vista integrada para probar varios componentes de formulario en un flujo real de captura.
      </p>
    </header>

    <article class="form-demo">
      <h3>Contact Form</h3>
      <p class="form-demo__caption">
        Combina EForm, ETextfield, ESelect, ERadioGroup, ECheckbox, ESwitch y acciones de submit.
      </p>

      <EForm
        v-model="formValid"
        validate-on-submit
        label-behavior="floating"
        class="form-demo__grid"
        @submit="handleSubmit"
        @submit-invalid="handleInvalid"
      >
        <ETextfield
          v-model="fullName"
          label="Full name"
          :rules="nameRules"
          detail="Write your first and last name"
          clearable
        />

        <ETextfield
          v-model="email"
          label="Work email"
          :rules="emailRules"
          detail="We will only use this for demo notifications"
          clearable
        />

        <ESelect
          v-model="priority"
          :items="priorities"
          label="Request priority"
          detail="Choose the urgency level"
          clearable
        />

        <ERadioGroup
          v-model="contactChannel"
          row
          label="Preferred contact"
          detail="Select how we should reach out"
        >
          <ERadio model-value="email" label="Email" />
          <ERadio model-value="slack" label="Slack" />
          <ERadio model-value="phone" label="Phone" />
        </ERadioGroup>

        <ECheckbox
          v-model="acceptTerms"
          label="I accept terms and privacy policy"
        />

        <ESwitch
          v-model="notifyByEmail"
          label="Send confirmation email"
          detail="Toggle to receive a copy of this request"
        />

        <div class="form-demo__actions">
          <EButton type="submit" color="primary">Submit</EButton>
          <EButton outlined type="button" @click="resetFields">Reset</EButton>
        </div>
      </EForm>
    </article>

    <article class="form-demo form-demo--preview">
      <h3>Live State</h3>
      <p class="form-demo__caption">Resumen rapido del estado para validar comportamiento en tiempo real.</p>

      <p class="form-demo__state">Valid now: {{ formValid ? "yes" : "no" }}</p>
      <p class="form-demo__state">Last submit: {{ submitStatus }}</p>

      <pre class="form-demo__json">{{ payloadPreview }}</pre>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const formValid = ref(false);
const fullName = ref("");
const email = ref("");
const priority = ref("Medium");
const contactChannel = ref("email");
const acceptTerms = ref(false);
const notifyByEmail = ref(true);
const submitStatus = ref("No submit yet");

const priorities = ["Low", "Medium", "High", "Critical"];

const nameRules = [(v) => !!`${v || ""}`.trim() || "Name is required"];
const emailRules = [
  (v) => !!`${v || ""}`.trim() || "Email is required",
  (v) => /.+@.+\..+/.test(`${v || ""}`) || "Email must be valid",
];

const payloadPreview = computed(() => {
  return JSON.stringify(
    {
      fullName: fullName.value,
      email: email.value,
      priority: priority.value,
      contactChannel: contactChannel.value,
      acceptTerms: acceptTerms.value,
      notifyByEmail: notifyByEmail.value,
    },
    null,
    2,
  );
});

const handleSubmit = () => {
  submitStatus.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const handleInvalid = () => {
  submitStatus.value = "Blocked by validation";
};

const resetFields = () => {
  fullName.value = "";
  email.value = "";
  priority.value = "Medium";
  contactChannel.value = "email";
  acceptTerms.value = false;
  notifyByEmail.value = true;
  submitStatus.value = "Form reset";
};
</script>

<style scoped>
.form-page {
  display: grid;
  gap: 20px;
}

.form-page__header {
  display: grid;
  gap: 6px;
}

.form-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.form-page__title {
  margin: 0;
}

.form-page__lead {
  margin: 0;
  opacity: 0.84;
}

.form-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.form-demo h3 {
  margin: 0;
}

.form-demo__caption {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.form-demo__grid {
  display: grid;
  gap: 14px;
}

.form-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.form-demo--preview {
  align-content: start;
}

.form-demo__state {
  margin: 0;
  font-size: 13px;
  opacity: 0.78;
}

.form-demo__json {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
}
</style>
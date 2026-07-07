<template>
  <section class="textarea-page">
    <header class="textarea-page__header">
      <p class="textarea-page__eyebrow">Components</p>
      <h2 class="textarea-page__title">Textarea Examples</h2>
      <p class="textarea-page__lead">
        Coleccion de ejemplos para validar captura de texto largo con reglas, contador y estados.
      </p>
    </header>

    <article class="textarea-demo">
      <h3>Basic</h3>
      <p class="textarea-demo__caption">Caso basico con helper detail y etiqueta flotante.</p>

      <ETextarea
        v-model="bio"
        label="Short bio"
        detail="Tell us about your role and experience"
        placeholder="I am a frontend engineer focused on design systems..."
        label-behavior="floating"
      />
    </article>
    <article class="textarea-demo">
      <h3>rows-1</h3>
      <p class="textarea-demo__caption">Caso basico con rows 1</p>

      <ETextarea
        v-model="bio"
        label="Short bio"
        rows="1"
        detail="Tell us about your role and experience"
        :append-inner-icon="iconFactory.history"
        placeholder="I am a frontend engineer focused on design systems..."
      />
    </article>

    <article class="textarea-demo">
      <h3>Counter and limit</h3>
      <p class="textarea-demo__caption">Control de longitud para mensajes cortos.</p>

      <ETextarea
        v-model="summary"
        label="Release summary"
        :limit="140"
        counter
        clearable
        detail="Max 140 characters"
      />
    </article>

    <article class="textarea-demo">
      <h3>Prefix, suffix and rows</h3>
      <p class="textarea-demo__caption">Personalizacion visual para notas de costo.</p>

      <ETextarea
        v-model="estimateNotes"
        label="Estimate notes"
        prefix="$"
        suffix="USD"
        :rows="5"
        detail="Use prefix and suffix as visual helpers"
      />
    </article>

    <article class="textarea-demo">
      <h3>Prepend and append</h3>
      <p class="textarea-demo__caption">Casos para validar contenido externo en slots prepend/append.</p>

      <div class="textarea-demo__stack">
        <ETextarea
          v-model="logMessage"
          label="System log"
          :rows="3"
          detail="Textarea with prepend and append text slots"
        >
          <template #prepend>
            <span class="textarea-demo__affix">LOG</span>
          </template>
          <template #append>
            <span class="textarea-demo__affix">UTC</span>
          </template>
        </ETextarea>

        <ETextarea
          v-model="urlNotes"
          label="Service endpoint notes"
          :rows="3"
          detail="Combined with prefix/suffix to compare alignment"
          prefix="https://"
          suffix=".internal"
        >
          <template #prepend>
            <span class="textarea-demo__affix">API</span>
          </template>
          <template #append>
            <span class="textarea-demo__affix">v2</span>
          </template>
        </ETextarea>
      </div>
    </article>

    <article class="textarea-demo">
      <h3>Prepend-inner and append-inner icons</h3>
      <p class="textarea-demo__caption">Validacion de iconos internos alineados con primera linea.</p>

      <div class="textarea-demo__stack">
        <ETextarea
          v-model="innerIconNotes"
          label="Deployment notes"
          :rows="3"
          detail="Using prepend-inner and append-inner icon slots"
          clearable
        >
          <template #prepend-inner>
            <EIcon :icon="iconFactory.pencil" class="textarea-demo__inner-icon" />
          </template>
          <template #append-inner>
            <EIcon :icon="iconFactory.contentCopy" class="textarea-demo__inner-icon" />
          </template>
        </ETextarea>

        <ETextarea
          v-model="innerIconAutoGrow"
          label="Runbook update"
          auto-grow
          :rows="2"
          :max-rows="6"
          detail="Inner icons with auto-grow"
        >
          <template #prepend-inner>
            <EIcon :icon="iconFactory.form" class="textarea-demo__inner-icon" />
          </template>
          <template #append-inner>
            <EIcon :icon="iconFactory.history" class="textarea-demo__inner-icon" />
          </template>
        </ETextarea>
      </div>
    </article>

    <article class="textarea-demo">
      <h3>AutoGrow</h3>
      <p class="textarea-demo__caption">
        El campo crece automaticamente con el contenido, sin limite de altura.
      </p>

      <ETextarea
        v-model="autoGrowNotes"
        label="Sprint notes"
        auto-grow
        :rows="2"
        detail="Type multiple lines to validate auto-grow behavior"
        clearable
      />
    </article>

    <article class="textarea-demo">
      <h3>AutoGrow with maxRows</h3>
      <p class="textarea-demo__caption">
        Crece hasta un maximo y luego habilita scroll interno.
      </p>

      <ETextarea
        v-model="autoGrowLimited"
        label="Post-mortem summary"
        auto-grow
        :rows="2"
        :max-rows="6"
        detail="Max rows is set to 6"
      />

      <div class="textarea-demo__actions">
        <EButton type="button" outlined @click="fillAutoGrowSample">Fill sample text</EButton>
        <EButton type="button" outlined @click="resetAutoGrowSample">Reset text</EButton>
      </div>
    </article>

    <article class="textarea-demo">
      <h3>Validation in form</h3>
      <p class="textarea-demo__caption">Integracion de textarea con reglas dentro de EForm.</p>

      <EForm v-model="isValid" validate-on-submit @submit="onSubmit" @submit-invalid="onInvalid">
        <ETextarea
          v-model="feedback"
          label="Product feedback"
          detail="Share the issue and proposed improvement"
          :rules="feedbackRules"
          :rows="4"
          clearable
        />

        <div class="textarea-demo__actions">
          <EButton type="submit" color="primary">Submit feedback</EButton>
          <EButton type="button" outlined @click="resetFeedback">Reset</EButton>
        </div>
      </EForm>

      <p class="textarea-demo__state">Form valid: {{ isValid ? "yes" : "no" }}</p>
      <p class="textarea-demo__state">Last action: {{ submitState }}</p>
    </article>

    <article class="textarea-demo">
      <h3>Readonly and disabled</h3>
      <p class="textarea-demo__caption">Comparativa de estados no editables.</p>

      <div class="textarea-demo__stack">
        <ETextarea
          model-value="This text can be selected but not edited."
          label="Readonly"
          readonly
          :rows="3"
        />

        <ETextarea
          model-value="This textarea is disabled."
          label="Disabled"
          disabled
          :rows="3"
        />
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const bio = ref("");
const summary = ref("Version 1.0.0 introduces a cleaner API and better field validation.");
const estimateNotes = ref("1200 for implementation and 300 for QA.");
const logMessage = ref("2026-07-06 10:05:12 Service restarted successfully.");
const urlNotes = ref("catalog/users endpoint requires service token.");
const innerIconNotes = ref("Deploy completed at 11:42 with zero-downtime migration.");
const innerIconAutoGrow = ref("Documented rollback checks and smoke test plan.");
const autoGrowNotes = ref("Initial note line.");
const autoGrowLimited = ref("");
const feedback = ref("");
const isValid = ref(false);
const submitState = ref("No submit yet");

const feedbackRules = [
  (value) => !!`${value || ""}`.trim() || "Feedback is required",
  (value) => `${value || ""}`.trim().length >= 20 || "Write at least 20 characters",
];

const onSubmit = () => {
  submitState.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const onInvalid = () => {
  submitState.value = "Validation blocked submission";
};

const resetFeedback = () => {
  feedback.value = "";
  submitState.value = "Feedback reset";
};

const fillAutoGrowSample = () => {
  autoGrowLimited.value = [
    "Incident timeline:",
    "1. Alert triggered at 09:12",
    "2. Team acknowledged at 09:15",
    "3. Mitigation applied at 09:22",
    "4. Root cause identified at 09:40",
    "5. Permanent fix deployed at 10:05",
    "6. Follow-up actions documented",
    "7. Monitoring updated",
  ].join("\n");
};

const resetAutoGrowSample = () => {
  autoGrowLimited.value = "";
};
</script>

<style scoped>
.textarea-page {
  display: grid;
  gap: 20px;
}

.textarea-page__header {
  display: grid;
  gap: 6px;
}

.textarea-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.textarea-page__title {
  margin: 0;
}

.textarea-page__lead {
  margin: 0;
  opacity: 0.84;
}

.textarea-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.textarea-demo h3 {
  margin: 0;
}

.textarea-demo__caption {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.textarea-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.textarea-demo__state {
  margin: 0;
  font-size: 13px;
  opacity: 0.78;
}

.textarea-demo__stack {
  display: grid;
  gap: 12px;
}

.textarea-demo__affix {
  display: inline-flex;
  align-items: center;
  min-height: 100%;
  padding: 0 6px;
  font-size: 12px;
  letter-spacing: 0.04em;
  opacity: 0.76;
  text-transform: uppercase;
}

.textarea-demo__inner-icon {
  opacity: 0.76;
}
</style>
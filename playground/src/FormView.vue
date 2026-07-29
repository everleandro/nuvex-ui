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

      <EForm v-model="formValid" validate-on-submit label-behavior="floating" class="form-demo__grid"
        @submit="handleSubmit" @submit-invalid="handleInvalid">
        <ETextfield v-model="fullName" label="Full name" :rules="nameRules" detail="Write your first and last name"
          clearable />

        <ETextfield v-model="email" label="Work email" :rules="emailRules"
          detail="We will only use this for demo notifications" clearable />

        <ESelect v-model="priority" :items="priorities" label="Request priority" detail="Choose the urgency level"
          clearable />

        <ERadioGroup v-model="contactChannel" row label="Preferred contact" detail="Select how we should reach out">
          <ERadio model-value="email" label="Email" />
          <ERadio model-value="slack" label="Slack" />
          <ERadio model-value="phone" label="Phone" />
        </ERadioGroup>

        <ECheckbox v-model="acceptTerms" label="I accept terms and privacy policy" />

        <ESwitch v-model="notifyByEmail" label="Send confirmation email"
          detail="Toggle to receive a copy of this request" />

        <div class="form-demo__actions">
          <EButton type="submit" color="primary">Submit</EButton>
          <EButton outlined type="button" @click="resetFields">Reset</EButton>
        </div>
      </EForm>
    </article>

    <article class="form-demo">
      <h3>Table Layout Form</h3>
      <p class="form-demo__caption">
        Ejemplo de EForm con la prop table activa para organizar campos en una grilla mas estructurada.
      </p>

      <EForm v-model="tableFormValid" table validate-on-submit class="form-demo__grid" @submit="handleTableSubmit"
        @submit-invalid="handleTableInvalid">
        <ETextfield v-model="ticketId" md="6" label="Ticket ID" :rules="ticketIdRules"
          detail="Identificador interno de la solicitud" />

        <ESelect v-model="environment" md="6" :items="environments" label="Environment" />

        <ESelect v-model="assignee" md="6" :items="assignees" chip multiple item-text="name" item-value="id" label="Assignee"
          clearable />

        <ETextarea v-model="changeWindow" md="6" label="Change window" rows="3" detail="Rango estimado para la ejecucion" />

        <ECheckbox v-model="requiresApproval" md="6" label="Requires approval" />

        <ESwitch v-model="sendSummary" :prepending-icon="iconFactory.email" md="6" label="Send summary"
          detail="Envia un resumen al cerrar la solicitud" />

        <EFormColumn class="gap-4 d-flex p-4">
          <ESpacer />
          <EButton type="submit" color="primary">Save request</EButton>
          <EButton outlined type="button" @click="resetTableFields">Reset table form</EButton>
        </EFormColumn>
      </EForm>
    </article>

    <article class="form-demo form-demo--preview">
      <h3>Live State</h3>
      <p class="form-demo__caption">Resumen rapido del estado para validar comportamiento en tiempo real.</p>

      <p class="form-demo__state">Valid now: {{ formValid ? "yes" : "no" }}</p>
      <p class="form-demo__state">Last submit: {{ submitStatus }}</p>
      <p class="form-demo__state">Table valid now: {{ tableFormValid ? "yes" : "no" }}</p>
      <p class="form-demo__state">Table submit: {{ tableSubmitStatus }}</p>

      <pre class="form-demo__json">{{ payloadPreview }}</pre>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import iconFactory from "./icons.ts";


const formValid = ref(false);
const fullName = ref("");
const email = ref("");
const priority = ref("Medium");
const contactChannel = ref("email");
const acceptTerms = ref(false);
const notifyByEmail = ref(true);
const submitStatus = ref("No submit yet");
const tableFormValid = ref(false);
const ticketId = ref("");
const environment = ref("Production");
const assignee = ref([]);
const changeWindow = ref("");
const requiresApproval = ref(true);
const sendSummary = ref(false);
const tableSubmitStatus = ref("No submit yet");

const priorities = ["Low", "Medium", "High", "Critical"];
const assignees = [
  { id: "ana", name: "Ana Garcia", email: "ana@example.com" },
  { id: "carlos", name: "Carlos Lopez", email: "carlos@example.com" },
  { id: "diana", name: "Diana Chen", email: "diana@example.com" },
  { id: "elena", name: "Elena Martinez", email: "elena@example.com" },
  { id: "francisco", name: "Francisco Rivera", email: "francisco@example.com" },
  { id: "gabriel", name: "Gabriel Torres", email: "gabriel@example.com" },
];
const environments = ["Production", "Staging", "QA", "Development"];

const nameRules = [(v) => !!`${v || ""}`.trim() || "Name is required"];
const emailRules = [
  (v) => !!`${v || ""}`.trim() || "Email is required",
  (v) => /.+@.+\..+/.test(`${v || ""}`) || "Email must be valid",
];
const ticketIdRules = [(v) => !!`${v || ""}`.trim() || "Ticket ID is required"];

const payloadPreview = computed(() => {
  return JSON.stringify(
    {
      contactForm: {
        fullName: fullName.value,
        email: email.value,
        priority: priority.value,
        contactChannel: contactChannel.value,
        acceptTerms: acceptTerms.value,
        notifyByEmail: notifyByEmail.value,
      },
      tableForm: {
        ticketId: ticketId.value,
        environment: environment.value,
        assignee: assignee.value,
        changeWindow: changeWindow.value,
        requiresApproval: requiresApproval.value,
        sendSummary: sendSummary.value,
      },
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

const handleTableSubmit = () => {
  tableSubmitStatus.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const handleTableInvalid = () => {
  tableSubmitStatus.value = "Blocked by validation";
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

const resetTableFields = () => {
  ticketId.value = "";
  environment.value = "Production";
  assignee.value = "Platform Team";
  changeWindow.value = "";
  requiresApproval.value = true;
  sendSummary.value = false;
  tableSubmitStatus.value = "Form reset";
};
</script>

<style>
.form-demo__json {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
}
</style>
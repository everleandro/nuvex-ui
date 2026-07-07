<template>
    <section class="textfield-page">
        <header class="textfield-page__header">
            <p class="textfield-page__eyebrow">Components</p>
            <h2 class="textfield-page__title">Text Field Examples</h2>
            <p class="textfield-page__lead">
                Escenarios para validar alineacion vertical, estados y comportamiento de prefijo/sufijo.
            </p>
        </header>

        <article class="textfield-demo">
            <h3>Basic and label behavior</h3>
            <p class="textfield-demo__caption">Comparativa entre inline y floating para revisar primera linea.</p>

            <EForm>
                <ETextfield v-model="fullName" label="Full name" detail="Default label behavior" lg="6" clearable
                    suffix="Engineer" :prepend-icon="iconFactory.history" :prepend-inner-icon="iconFactory.history"
                    :append-icon="iconFactory.history" :append-inner-icon="iconFactory.history" prefix="Dr." />

                <ETextfield v-model="jobTitle" label="Job title" detail="Floating label behavior" lg="6"
                    suffix="Engineer" :prepend-icon="iconFactory.history" :prepend-inner-icon="iconFactory.history"
                    :append-icon="iconFactory.history" :append-inner-icon="iconFactory.history"
                    label-behavior="floating" clearable prefix="Dr." placeholder="Enter your job title" />
            </EForm>
        </article>

        <article class="textfield-demo">
            <h3>Prefix and suffix alignment</h3>
            <p class="textfield-demo__caption">Validacion visual de prefix/suffix contra la primera linea del input.</p>

            <EForm>
                <ETextfield v-model="budget" label="Budget" prefix="$" suffix="USD" inputmode="decimal"
                    detail="Check vertical alignment with " lg="6" />

                <ETextfield v-model="weight" label="Package weight" suffix="kg" inputmode="decimal"
                    detail="Suffix should align with input baseline" lg="6" />
            </EForm>
        </article>

        <article class="textfield-demo">
            <h3>Validation and counter</h3>
            <p class="textfield-demo__caption">Reglas tipicas de formulario con feedback en tiempo real.</p>

            <EForm v-model="isValid" validate-on-submit @submit="onSubmit" @submit-invalid="onInvalid">
                <ETextfield v-model="email" label="Work email" placeholder="name@company.com" :rules="emailRules"
                    detail="Must be a valid email" clearable lg="6" />

                <ETextfield v-model="username" label="Username" :rules="usernameRules" :limit="20" counter
                    detail="Only letters, numbers, _ and -" clearable lg="6" />

                <div class="textfield-demo__actions">
                    <EButton type="submit" color="primary">Submit</EButton>
                    <EButton type="button" outlined @click="resetValidationDemo">Reset</EButton>
                </div>
            </EForm>

            <p class="textfield-demo__state">Form valid: {{ isValid ? "yes" : "no" }}</p>
            <p class="textfield-demo__state">Last action: {{ submitState }}</p>
        </article>

        <article class="textfield-demo">
            <h3>Dense, outlined and readonly</h3>
            <p class="textfield-demo__caption">Casos para revisar metrica vertical en variantes comunes.</p>

            <EForm>
                <ETextfield v-model="denseValue" label="Dense" dense detail="Dense variant" lg="4" />

                <ETextfield v-model="outlinedValue" label="Outlined" outlined prefix="@" lg="4" />

                <ETextfield model-value="Readonly value" label="Readonly" readonly lg="4" />
            </EForm>
        </article>

        <article class="textfield-demo">
            <h3>Disabled and loading-like states</h3>
            <p class="textfield-demo__caption">Snapshot rapido de estados no interactivos.</p>

            <EForm>
                <ETextfield model-value="Disabled text field" label="Disabled" disabled lg="6" />

                <ETextfield v-model="search" label="Search" detail="Example with prepend icon" clearable lg="6" />
            </EForm>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const fullName = ref("Ada Lovelace");
const jobTitle = ref("Design Systems Engineer");
const budget = ref("1250");
const weight = ref("8.5");

const email = ref("");
const username = ref("nuvex_user");
const isValid = ref(false);
const submitState = ref("No submit yet");

const denseValue = ref("Compact input");
const outlinedValue = ref("nuvex-ui");
const search = ref("");

const emailRules = [
    (value) => !!`${value || ""}`.trim() || "Email is required",
    (value) => /.+@.+\..+/.test(`${value || ""}`) || "Email must be valid",
];

const usernameRules = [
    (value) => !!`${value || ""}`.trim() || "Username is required",
    (value) => /^[a-zA-Z0-9_-]+$/.test(`${value || ""}`) || "Only letters, numbers, _ and -",
];

const onSubmit = () => {
    submitState.value = `Submitted at ${new Date().toLocaleTimeString()}`;
};

const onInvalid = () => {
    submitState.value = "Validation blocked submission";
};

const resetValidationDemo = () => {
    email.value = "";
    username.value = "nuvex_user";
    submitState.value = "Demo reset";
};
</script>

<style scoped>
.textfield-page {
    display: grid;
    gap: 20px;
}

.textfield-page__header {
    display: grid;
    gap: 6px;
}

.textfield-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.textfield-page__title {
    margin: 0;
}

.textfield-page__lead {
    margin: 0;
    opacity: 0.84;
}

.textfield-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.textfield-demo h3 {
    margin: 0;
}

.textfield-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.textfield-demo__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.textfield-demo__state {
    margin: 0;
    font-size: 13px;
    opacity: 0.78;
}
</style>

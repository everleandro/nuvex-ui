<template>
    <section class="select-page">
        <header class="select-page__header">
            <p class="select-page__eyebrow">Components</p>
            <h2 class="select-page__title">Select Playground</h2>
            <p class="select-page__lead">
                Ejemplos rapidos para validar estados, mapeo de items, chips, busqueda y slots en ESelect.
            </p>
        </header>

        <article class="select-demo">
            <h3></h3>
            <p class="select-demo__caption"></p>

            <ECard title="Interactive controls"
                subtitle="Ajusta props comunes en vivo para revisar comportamiento base." color="green-100"
                elevation="sm">
                <div class="select-controls">
                    <ESelect v-model="playgroundValue" :items="assignees" item-text="name" item-value="id"
                        :label="playgroundLabel" :placeholder="playgroundPlaceholder" :color="playgroundColor"
                        retain-color :outlined="playgroundOptions.outlined" :clearable="playgroundOptions.clearable" :label-behavior="playgroundOptions.floatingLabel? 'float' : 'default'"
                        :disabled="playgroundOptions.disabled" :readonly="playgroundOptions.readonly" />
                    <EForm class="select-controls__form">
                        <ESelect v-model="playgroundColor" lg="6" :items="colors" label="Color" clearable />
                        <ECheckbox v-model="playgroundOptions.outlined" lg="6" label="Outlined" />
                        <ECheckbox v-model="playgroundOptions.clearable" lg="6" label="Clearable" />
                        <ECheckbox v-model="playgroundOptions.floatingLabel" lg="6" label="Floating Label" />
                        <ECheckbox v-model="playgroundOptions.disabled" lg="6" label="Disabled" />
                        <ECheckbox v-model="playgroundOptions.readonly" lg="6" label="Readonly" />
                    </EForm>
                </div>
            </ECard>
        </article>

        <article class="select-demo">
            <h3>Basic and state variants</h3>
            <p class="select-demo__caption">Baseline para disabled, readonly y outlined.</p>
            <EForm>
                <ESelect v-model="basicValue" lg="6" :items="statusItems" label="Default" clearable />
                <ESelect v-model="outlinedValue" lg="6" :items="statusItems" label="Outlined" outlined clearable />
                <ESelect v-model="readonlyValue" lg="6" :items="statusItems" label="Readonly" readonly outlined />
                <ESelect v-model="disabledValue" lg="6" :items="statusItems" label="Disabled" disabled />
            </EForm>
        </article>

        <article class="select-demo">
            <h3>Object mapping</h3>
            <p class="select-demo__caption">Compara modelo primitivo vs return-object.</p>
            <div>
                <pre>{{ mappedObject }}</pre>
            </div>
            <EForm>
                <ESelect v-model="mappedPrimitive" lg="6" :items="assignees" item-text="name" item-value="id"
                    label="Primitive model" clearable />
                <ESelect v-model="mappedObject" lg="6" :items="assignees" item-text="name" item-value="id" return-object
                    label="Object model" clearable />
            </EForm>
        </article>

        <article class="select-demo">
            <h3>Multiple and chips</h3>
            <p class="select-demo__caption">Patron para tags y seleccion multiple.</p>
            <EForm>
                <ESelect v-model="selectedTags" lg="6" :items="tagItems" label="Tags" multiple chip clearable />
                <ESelect v-model="singleChip" lg="6" :items="statusItems" label="Single chip" chip chip-closable
                    clearable />
            </EForm>
        </article>

        <article class="select-demo">
            <h3>Autocomplete and async loading</h3>
            <p class="select-demo__caption">Busqueda local + carga remota de opciones.</p>
            <EForm>
                <ESelect v-model="fruitValue" lg="6" :items="filteredFruits" :search="fruitSearch" label="Search fruit"
                    placeholder="Type to filter" autocomplete clearable
                    @update:search="fruitSearch = String($event || '')" />

                <ESelect v-model="countryValue" lg="6" :items="countryItems" item-text="name" item-value="code"
                    :loading="loadingCountries" label="Country" detail="Options are loaded on focus" clearable
                    @focus="fetchCountries" />
            </EForm>

            <div class="select-async-bench">
                <p class="select-async-bench__steps">
                    Test flow: click inside the select, wait for loading to finish, and verify whether options open
                    without a second click.
                </p>

                <ESelect v-model="probeCountryValue" :items="probeCountryItems" item-text="name" item-value="code"
                    :loading="probeLoadingCountries" label="Async test bench" clearable
                    detail="Loads countries only when user focuses this field" @focus="handleProbeFocus" />

                <div class="select-async-bench__meta">
                    <span>User intent: {{ probeIntentByUser ? "yes" : "no" }}</span>
                    <span>Loading: {{ probeLoadingCountries ? "yes" : "no" }}</span>
                    <span>Items: {{ probeCountryItems.length }}</span>
                </div>

                <div class="select-async-bench__actions">
                    <EButton size="small" type="button" outlined @click="resetProbeScenario">
                        Reset scenario
                    </EButton>
                    <EButton size="small" type="button" @click="preloadProbeCountries">
                        Preload without focus
                    </EButton>
                </div>

                <ul class="select-async-bench__events">
                    <li v-for="(entry, index) in probeEvents" :key="`${index}-${entry}`">{{ entry }}</li>
                </ul>
            </div>
        </article>

        <article class="select-demo">
            <h3>Named slots</h3>
            <p class="select-demo__caption">Render custom para item y selection con metadata.</p>
            <ESelect v-model="slotValue" :items="assignees" item-text="name" item-value="id" label="Assignee" clearable>
                <template #selection="{ selection }">
                    <span class="slot-selection__name">{{ selection.name }}</span>
                    <span class="slot-selection__mail"> - {{ selection.email }}</span>
                </template>

                <template #item="{ item, attrs }">
                    <EListItem v-bind="attrs">
                        <div class="slot-item">
                            <span class="slot-item__name">{{ item.name }}</span>
                            <small class="slot-item__mail">{{ item.email }}</small>
                        </div>
                    </EListItem>
                </template>
            </ESelect>
        </article>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";

const statusItems = ["Draft", "In review", "Published", "Archived"];
const tagItems = ["UI", "Accessibility", "API", "Performance", "Docs"];
const fruitItems = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Date", "Grape", "Orange"];

const assignees = [
    { id: "ana", name: "Ana Garcia", email: "ana@example.com" },
    { id: "carlos", name: "Carlos Lopez", email: "carlos@example.com" },
    { id: "diana", name: "Diana Chen", email: "diana@example.com" },
];

const colors = ["primary", "secondary", "teal-900", "success", "warning"];

const playgroundValue = ref("ana");
const playgroundLabel = ref("Assignee");
const playgroundPlaceholder = ref("Select assignee");
const playgroundColor = ref("primary");
const playgroundOptions = ref({
    outlined: false,
    clearable: true,
    disabled: false,
    readonly: false,
    floatingLabel: true,
});

const basicValue = ref("Draft");
const outlinedValue = ref("In review");
const readonlyValue = ref("Published");
const disabledValue = ref("Archived");

const mappedPrimitive = ref("ana");
const mappedObject = ref(assignees[0]);

const selectedTags = ref(["UI", "API"]);
const singleChip = ref("Draft");

const fruitValue = ref("");
const fruitSearch = ref("");
const filteredFruits = computed(() => {
    const term = fruitSearch.value.trim().toLowerCase();
    if (!term) return fruitItems;
    return fruitItems.filter((item) => item.toLowerCase().includes(term));
});

const loadingCountries = ref(false);
const countryValue = ref(undefined);
const countryItems = ref([]);

const fetchCountries = async () => {
    if (countryItems.value.length > 0 || loadingCountries.value) return;

    loadingCountries.value = true;
    try {
        await new Promise((resolve) => setTimeout(resolve, 900));
        countryItems.value = [
            { code: "es", name: "Spain" },
            { code: "mx", name: "Mexico" },
            { code: "ar", name: "Argentina" },
            { code: "co", name: "Colombia" },
        ];
    } finally {
        loadingCountries.value = false;
    }
};

const probeLoadingCountries = ref(false);
const probeCountryValue = ref(undefined);
const probeCountryItems = ref([]);
const probeIntentByUser = ref(false);
const probeEvents = ref([]);

const pushProbeEvent = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    probeEvents.value = [`${timestamp} - ${message}`, ...probeEvents.value].slice(0, 8);
};

const resolveProbeCountries = () => {
    return [
        { code: "es", name: "Spain" },
        { code: "mx", name: "Mexico" },
        { code: "ar", name: "Argentina" },
        { code: "co", name: "Colombia" },
    ];
};

const handleProbeFocus = async () => {
    probeIntentByUser.value = true;
    pushProbeEvent("focus received");

    if (probeCountryItems.value.length > 0 || probeLoadingCountries.value) {
        pushProbeEvent("ignored fetch (already resolved or loading)");
        return;
    }

    probeLoadingCountries.value = true;
    pushProbeEvent("loading started");

    try {
        await new Promise((resolve) => setTimeout(resolve, 1100));
        probeCountryItems.value = resolveProbeCountries();
        pushProbeEvent("loading finished");
    } finally {
        probeLoadingCountries.value = false;
    }
};

const preloadProbeCountries = async () => {
    if (probeCountryItems.value.length > 0 || probeLoadingCountries.value) return;

    probeIntentByUser.value = false;
    probeLoadingCountries.value = true;
    pushProbeEvent("preload started without focus");

    try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        probeCountryItems.value = resolveProbeCountries();
        pushProbeEvent("preload finished without focus");
    } finally {
        probeLoadingCountries.value = false;
    }
};

const resetProbeScenario = () => {
    probeLoadingCountries.value = false;
    probeCountryValue.value = undefined;
    probeCountryItems.value = [];
    probeIntentByUser.value = false;
    probeEvents.value = [];
};

const slotValue = ref("ana");
</script>

<style scoped>
.select-page {
    display: grid;
    gap: 20px;
}

.select-page__header {
    display: grid;
    gap: 6px;
}

.select-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.select-page__title {
    margin: 0;
}

.select-page__lead {
    margin: 0;
    opacity: 0.84;
}

.select-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.select-demo h3 {
    margin: 0;
}

.select-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.select-controls {
    display: grid;
    gap: 14px;
}

.select-controls__form {
    display: grid;
    gap: 8px;
}

.select-async-bench {
    display: grid;
    gap: 10px;
    padding: 12px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--e-surface-color, #fff) 85%, black 15%);
}

.select-async-bench__steps {
    margin: 0;
    font-size: 13px;
    opacity: 0.8;
}

.select-async-bench__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
    opacity: 0.82;
}

.select-async-bench__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.select-async-bench__events {
    margin: 0;
    padding-left: 18px;
    font-size: 12px;
    opacity: 0.8;
    display: grid;
    gap: 4px;
}

.slot-selection__name,
.slot-item__name {
    font-weight: 600;
}

.slot-selection__mail,
.slot-item__mail {
    opacity: 0.75;
}

.slot-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 0;
}
</style>

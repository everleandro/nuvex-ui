<template>
  <section class="date-picker-page">
    <header class="date-picker-page__header">
      <p class="date-picker-page__eyebrow">Components</p>
      <h2 class="date-picker-page__title">Date Picker Examples</h2>
      <p class="date-picker-page__lead">
        Escenarios para validar navegacion, restricciones de fechas, localizacion, slots y cierre en dialog para EDatePicker.
      </p>
    </header>

    <article class="date-picker-demo">
      <h3>Interactive controls</h3>
      <p class="date-picker-demo__caption">Controla la vista activa y activa fines de semana deshabilitados desde un panel lateral.</p>

      <div class="date-picker-demo__split">
        <EDatePicker v-model="usageDate" :view="usageView" :disabled="usageDisabledConfig" color="primary" />

        <ECard elevation="sm">
          <div class="date-picker-meta">
            <div>
              <strong>Current view</strong>
              <p>{{ selectedViewLabel }}</p>
            </div>
            <div>
              <strong>Selected date</strong>
              <p>{{ formatDisplayDate(usageDate) }}</p>
            </div>
          </div>

          <EForm>
            <ESelect
              v-model="usageView"
              :items="viewOptions"
              item-text="label"
              item-value="value"
              label="View"
            />
            <ECheckbox v-model="usageWithDisabled" label="Disable weekends" />
          </EForm>
        </ECard>
      </div>
    </article>

    <article class="date-picker-demo">
      <h3>Controlled view modes</h3>
      <p class="date-picker-demo__caption">Prueba el flujo controlado con update:view para day, month y year.</p>

      <ECard elevation="sm">
        <div class="date-picker-demo__actions">
          <EButton
            v-for="option in viewOptions"
            :key="option.value"
            color="primary"
            :tonal="controlledView === option.value"
            @click="controlledView = option.value"
          >
            {{ option.label }}
          </EButton>
        </div>

        <p class="date-picker-demo__state">Current view: {{ controlledViewLabel }}</p>

        <EDatePicker
          v-model="controlledDate"
          :view="controlledView"
          color="primary"
          @update:view="controlledView = $event"
        />
      </ECard>
    </article>

    <article class="date-picker-demo">
      <h3>Disabled and highlighted dates</h3>
      <p class="date-picker-demo__caption">Combina reglas de bloqueo con hitos resaltados y una ventana de congelamiento.</p>

      <div class="date-picker-demo__split">
        <EDatePicker
          v-model="highlightedDate"
          color="secondary"
          :disabled="disabledDateRules"
          :highlighted="highlightedDateRules"
          elevation="sm"
        />

        <ECard elevation="sm">
          <ul class="date-picker-demo__list">
            <li>Weekends are disabled.</li>
            <li>Freeze window: August 20 to August 25.</li>
            <li>Highlighted dates mark releases and approval windows.</li>
          </ul>
        </ECard>
      </div>
    </article>

    <article class="date-picker-demo">
      <h3>Layout and header options</h3>
      <p class="date-picker-demo__caption">Casos para landscape completo, only-month horizontal y una version sin bloque superior.</p>

      <div class="date-picker-demo__grid">
        <ECard title="Landscape date selection" subtitle="Layout horizontal para flujos con mas ancho disponible." elevation="sm">
          <EDatePicker v-model="landscapeDate" landscape color="secondary" />
        </ECard>

        <ECard title="Landscape month selection" subtitle="Solo mes para billing o reporting." elevation="sm">
          <EDatePicker v-model="monthOnlyDate" only-month landscape color="primary" />
        </ECard>

        <ECard title="Header-only scheduling" subtitle="no-title con inicio de semana en domingo." elevation="sm">
          <EDatePicker
            v-model="headerlessDate"
            no-title
            :week-start="0"
            format="month-mmmm year-YYYY"
            color="primary"
          />
        </ECard>
      </div>
    </article>

    <article class="date-picker-demo">
      <h3>Localization</h3>
      <p class="date-picker-demo__caption">Overrides por instancia para mezclar idioma del calendario segun el flujo.</p>

      <div class="date-picker-demo__grid">
        <ECard title="Locale override: es" subtitle="El picker ignora el locale global de la app." elevation="sm">
          <EDatePicker v-model="localizedSpanishDate" lng="es" color="secondary" />
        </ECard>

        <ECard title="Locale override: en" subtitle="Mantiene la navegacion en ingles para este caso." elevation="sm">
          <EDatePicker v-model="localizedEnglishDate" lng="en" color="primary" />
        </ECard>
      </div>
    </article>

    <article class="date-picker-demo">
      <h3>Slots customization</h3>
      <p class="date-picker-demo__caption">Ejemplo con title y header custom usando prev, next, changeViewMode y pageDate.</p>

      <ECard title="Custom title and header" subtitle="Mantiene la logica interna del picker con framing propio." elevation="sm">
        <EDatePicker v-model="slotDate" color="primary">
          <template #title>
            <div class="date-picker-slot-title">
              <span>Release plan</span>
              <strong>{{ formatDisplayDate(slotDate) }}</strong>
            </div>
          </template>

          <template #header="{ prev, next, changeViewMode, pageDate }">
            <div class="date-picker-slot-header">
              <EButton text color="primary" @click="prev()">Prev</EButton>
              <div class="date-picker-slot-header__copy">
                <span>Selected window</span>
                <strong>{{ formatMonthYear(pageDate) }}</strong>
              </div>
              <div class="date-picker-slot-header__actions">
                <EButton text color="primary" @click="changeViewMode(datePickerViewType.month)">
                  Jump to month view
                </EButton>
                <EButton text color="primary" @click="next()">Next</EButton>
              </div>
            </div>
          </template>
        </EDatePicker>
      </ECard>
    </article>

    <article class="date-picker-demo">
      <h3>Dialog integration</h3>
      <p class="date-picker-demo__caption">Usa close-on-change para cerrar el dialog tan pronto exista una seleccion valida.</p>

      <ECard title="Release planning" subtitle="Seleccion rapida dentro de overlay." elevation="sm">
        <p class="date-picker-demo__state">Saved date: {{ formatDisplayDate(dialogDate) }}</p>
        <EButton color="secondary" @click="dialogOpen = true">Schedule release</EButton>

        <EDialog v-model="dialogOpen">
          <ECard class="date-picker-dialog-card">
            <EDatePicker
              v-model="dialogDate"
              color="secondary"
              close-on-change
              :disabled="disabledDateRules"
              :highlighted="highlightedDateRules"
            />
          </ECard>
        </EDialog>
      </ECard>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { datePickerViewType } from "../../src";

const createDate = (year, month, day) => {
  return new Date(year, month - 1, day);
};

const viewOptions = [
  { label: "Day", value: datePickerViewType.day },
  { label: "Month", value: datePickerViewType.month },
  { label: "Year", value: datePickerViewType.year },
];

const resolveViewLabel = (value) => {
  return viewOptions.find((item) => item.value === value)?.label || "Day";
};

const formatDisplayDate = (value) => {
  const normalized = value instanceof Date ? value : new Date(value || createDate(2026, 8, 14));

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(normalized);
};

const formatMonthYear = (value) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(value);
};

const weekendDisabledConfig = {
  days: [0, 6],
};

const disabledDateRules = {
  days: [0, 6],
  ranges: [
    {
      from: createDate(2026, 8, 20),
      to: createDate(2026, 8, 25),
    },
  ],
};

const highlightedDateRules = {
  dates: [createDate(2026, 8, 14), createDate(2026, 8, 29)],
  ranges: [
    {
      from: createDate(2026, 8, 10),
      to: createDate(2026, 8, 12),
    },
  ],
};

const usageDate = ref(createDate(2026, 8, 14));
const usageView = ref(datePickerViewType.day);
const usageWithDisabled = ref(false);

const usageDisabledConfig = computed(() => {
  return usageWithDisabled.value ? weekendDisabledConfig : undefined;
});

const selectedViewLabel = computed(() => resolveViewLabel(usageView.value));

const controlledDate = ref(createDate(2026, 9, 18));
const controlledView = ref(datePickerViewType.day);
const controlledViewLabel = computed(() => resolveViewLabel(controlledView.value));

const highlightedDate = ref(createDate(2026, 8, 14));
const landscapeDate = ref(createDate(2026, 9, 9));
const monthOnlyDate = ref(createDate(2026, 11, 1));
const headerlessDate = ref(createDate(2026, 8, 18));
const localizedSpanishDate = ref(createDate(2026, 8, 14));
const localizedEnglishDate = ref(createDate(2026, 8, 14));
const slotDate = ref(createDate(2026, 8, 14));

const dialogOpen = ref(false);
const dialogDate = ref(createDate(2026, 10, 3));
</script>

<style scoped>
.date-picker-page {
  display: grid;
  gap: 20px;
}

.date-picker-page__header {
  display: grid;
  gap: 6px;
}

.date-picker-page__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.date-picker-page__title {
  margin: 0;
}

.date-picker-page__lead {
  margin: 0;
  opacity: 0.84;
}

.date-picker-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.date-picker-demo h3,
.date-picker-demo__caption,
.date-picker-demo__state {
  margin: 0;
}

.date-picker-demo__caption,
.date-picker-demo__state {
  font-size: 14px;
  opacity: 0.8;
}

.date-picker-demo__split {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, auto) minmax(18rem, 24rem);
  align-items: start;
}

.date-picker-demo__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
}

.date-picker-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.date-picker-demo__list {
  margin: 0;
  padding-left: 20px;
}

.date-picker-meta {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.date-picker-meta p {
  margin: 4px 0 0;
  opacity: 0.8;
}

.date-picker-slot-title {
  display: grid;
  gap: 4px;
}

.date-picker-slot-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.date-picker-slot-header__copy {
  display: grid;
  gap: 2px;
  text-align: center;
}

.date-picker-slot-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.date-picker-dialog-card {
  padding: 16px;
}

@media (max-width: 960px) {
  .date-picker-demo__split,
  .date-picker-demo__grid {
    grid-template-columns: 1fr;
  }
}
</style>
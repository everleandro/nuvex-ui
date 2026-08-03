<template>
    <section class="schedule-page">
        <header class="schedule-page__header">
            <p class="schedule-page__eyebrow">Components</p>
            <h2>Schedule</h2>
            <p>
                ESchedule organiza eventos temporales en vistas de calendario y recursos. Esta pagina replica los
                ejemplos de
                la documentacion para probar navegacion, espacios, slots e integraciones directamente en el framework.
            </p>
        </header>

        <article class="schedule-demo">
            <header>
                <h3>Uso y diseno</h3>
                <p>Revisa la anatomia, jerarquia temporal, densidad de eventos y navegacion como una experiencia
                    coordinada.</p>
            </header>

            <ESchedule v-model="usageDate" v-model:view="usageView" v-model:scale="usageScale"
                v-model:selected-space="usageSelectedSpace" class="full-width" :spaces="spaces" :events="usageEvents"
                :start="8 * hour" :end="18 * hour" :step="hour" :row-height="64" elevation="sm" />
        </article>

        <article class="schedule-demo">
            <header>
                <h3>Slot toolbar</h3>
                <p>Crea navegacion de periodos personalizada con las etiquetas y callbacks expuestos por el slot.</p>
            </header>

            <ESchedule v-model="toolbarDate" class="full-width" :spaces="singleSpace" :events="toolbarEvents"
                :start="9 * hour" :end="14 * hour" :row-height="64" elevation="sm">
                <template #toolbar="toolbar">
                    <EBar class="d-flex flex-wrap gap-2" color="primary">
                        <EButton text use-contrast-color :icon="icons.arrowLeft"
                            :aria-label="toolbar.labels.previousPeriod" @click="toolbar.goToPreviousPeriod()" />
                        <EButton text use-contrast-color @click="toolbar.goToToday()">
                            {{ toolbar.labels.today }}
                        </EButton>
                        <EButton text use-contrast-color :icon="icons.arrowRight"
                            :aria-label="toolbar.labels.nextPeriod" @click="toolbar.goToNextPeriod()" />
                        <ESpacer />
                        <strong class="type-subtitle">{{ formatLongDate(toolbar.date) }}</strong>
                    </EBar>
                </template>
            </ESchedule>
        </article>

        <article class="schedule-demo">
            <header>
                <h3>Slot event</h3>
                <p>Cambia la jerarquia de informacion dentro de los eventos conservando un control interactivo real.</p>
            </header>

            <ESchedule v-model="eventSlotDate" class="full-width" :spaces="singleSpace" :events="eventSlotEvents"
                :start="9 * hour" :end="14 * hour" :row-height="72" event-elevation="none" elevation="sm">
                <template #event="{ event }">
                    <div text block class="full-height">
                        <span class="d-flex flex-column items-start full-width">
                            <strong class="type-body">{{ event.name }}</strong>
                            <span class="type-caption">{{ event.subtitle }}</span>
                            <span class="type-caption">{{ event.footer }}</span>
                        </span>
                    </div>
                </template>
            </ESchedule>
        </article>

        <article class="schedule-demo">
            <header>
                <h3>Slot empty-slot</h3>
                <p>Convierte los intervalos disponibles en acciones explicitas de creacion accesibles por teclado.</p>
            </header>

            <p class="schedule-demo__feedback" aria-live="polite">{{ emptySlotFeedback }}</p>
            <ESchedule v-model="emptySlotDate" class="full-width" :spaces="singleSpace" :start="9 * hour"
                :end="13 * hour" :row-height="64" elevation="sm">
                <template #empty-slot="{ data }">
                    <EButton text block class="full-height" :aria-label="`Crear evento a las ${formatTime(data.start)}`"
                        @click="selectEmptySlot(data)">
                        Agregar
                    </EButton>
                </template>
            </ESchedule>
        </article>

        <article class="schedule-demo">
            <header>
                <h3>Integracion con Dialog</h3>
                <p>Crea y edita eventos en contexto a partir de intervalos vacios o eventos existentes.</p>
            </header>

            <ESchedule v-model="integrationDate" class="full-width" :spaces="singleSpace" :events="integrationEvents"
                :start="9 * hour" :end="16 * hour" :row-height="64" elevation="sm" @click:empty-slot="openCreateDialog"
                @click:event="openEditDialog">
                <template #toolbar="toolbar">
                    <EScheduleToolbar v-bind="toolbar" />
                </template>
            </ESchedule>

            <EDialog v-model="dialogOpen" :max-width="520" restore-focus>
                <ECard :title="editingId ? 'Editar evento' : 'Crear evento'"
                    description="Define un nombre y un rango horario; despues guarda el evento en el schedule.">
                    <EForm class="d-flex flex-column gap-3">
                        <ETextfield v-model="draft.name" label="Nombre del evento" />
                        <ERow>
                            <ECol md="6">
                                <ETextfield v-model="draft.startTime" type="time" label="Hora de inicio" />
                            </ECol>
                            <ECol md="6">
                                <ETextfield v-model="draft.endTime" type="time" label="Hora de finalizacion" />
                            </ECol>
                        </ERow>
                    </EForm>
                    <div class="d-flex flex-wrap justify-end gap-2 mt-4">
                        <EButton text @click="dialogOpen = false">Cancelar</EButton>
                        <EButton color="primary" :disabled="!canSave" @click="saveEvent">Guardar evento</EButton>
                    </div>
                </ECard>
            </EDialog>
        </article>

        <article class="schedule-demo">
            <header>
                <h3>Accesibilidad</h3>
                <p>Usa Tab para alcanzar eventos e intervalos disponibles; despues pulsa Enter o Espacio para
                    activarlos.</p>
            </header>

            <p class="schedule-demo__feedback" aria-live="polite">{{ announcement }}</p>
            <ESchedule v-model="accessibilityDate" class="full-width" :spaces="singleSpace"
                :events="accessibilityEvents" :start="9 * hour" :end="14 * hour" :row-height="64" elevation="sm"
                @click:event="announceEvent" @click:empty-slot="announceSlot" />
        </article>
    </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { CalendarScale, ScheduleView } from "../../src";
import icons from "./icons";

const hour = 60 * 60;
const createDate = (day, hours, minutes = 0) => new Date(2026, 7, day, hours, minutes);

const spaces = [
    { id: "studio-a", label: "Estudio A" },
    { id: "studio-b", label: "Estudio B" },
    { id: "review-room", label: "Sala de revision" },
];
const singleSpace = [spaces[0]];

const usageDate = ref(createDate(3, 0));
const usageView = ref(ScheduleView.Calendar);
const usageScale = ref(CalendarScale.Week);
const usageSelectedSpace = ref(spaces[0]);
const usageEvents = ref([
    {
        id: "planning",
        entityId: "studio-a",
        name: "Planificacion del sprint",
        subtitle: "09:00 - 10:30",
        footer: "Equipo de producto",
        start: createDate(3, 9),
        end: createDate(3, 10, 30),
        color: "primary",
    },
    {
        id: "research",
        entityId: "studio-a",
        name: "Sintesis de investigacion",
        subtitle: "11:00 - 12:00",
        footer: "Equipo de investigacion",
        start: createDate(4, 11),
        end: createDate(4, 12),
        color: "success",
    },
    {
        id: "design-review",
        entityId: "studio-a",
        name: "Revision de diseno",
        subtitle: "14:00 - 16:00",
        footer: "Equipo de diseno",
        start: createDate(5, 14),
        end: createDate(5, 16),
        color: "warning",
    },
    {
        id: "handoff",
        entityId: "studio-a",
        name: "Handoff con ingenieria",
        subtitle: "10:00 - 11:00",
        footer: "Equipo de ingenieria",
        start: createDate(7, 10),
        end: createDate(7, 11),
        color: "secondary",
    },
]);

const toolbarDate = ref(createDate(3, 0));
const toolbarEvents = [{
    id: "toolbar-demo",
    entityId: "studio-a",
    name: "Planificacion del sprint",
    start: createDate(3, 10),
    end: createDate(3, 11),
    color: "primary",
}];

const eventSlotDate = ref(createDate(3, 0));
const eventSlotEvents = [
    {
        id: "custom-event-one",
        entityId: "studio-a",
        name: "Sintesis de investigacion",
        subtitle: "10:00 - 11:00",
        footer: "Equipo de investigacion",
        start: createDate(3, 10),
        end: createDate(3, 11),
        color: "success",
    },
    {
        id: "custom-event-two",
        entityId: "studio-a",
        name: "Revision de diseno",
        subtitle: "12:00 - 13:30",
        footer: "Equipo de diseno",
        start: createDate(3, 12),
        end: createDate(3, 13, 30),
        color: "warning",
    },
];

const formatLongDate = (value) => new Intl.DateTimeFormat("es", {
    weekday: "long",
    month: "short",
    day: "numeric",
}).format(value);
const formatTime = (value) => new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
}).format(new Date(value));

const emptySlotDate = ref(createDate(3, 0));
const emptySlotFeedback = ref("Elige un intervalo disponible para crear un evento.");
const selectEmptySlot = (data) => {
    emptySlotFeedback.value = `Intervalo seleccionado: ${formatTime(data.start)}`;
};

const integrationDate = ref(createDate(3, 0));
const integrationEvents = ref([{
    id: "integration-planning",
    entityId: "studio-a",
    name: "Planificacion del sprint",
    start: createDate(3, 10),
    end: createDate(3, 11),
    color: "primary",
}]);
const dialogOpen = ref(false);
const editingId = ref(null);
const selectedSlot = ref(null);
const draft = reactive({ name: "", startTime: "09:00", endTime: "10:00" });
const canSave = computed(() => Boolean(draft.name.trim()) && draft.startTime < draft.endTime);

const toTime = (value) => {
    const parsed = new Date(value);
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
};
const openCreateDialog = ({ data }) => {
    editingId.value = null;
    selectedSlot.value = data;
    draft.name = "";
    draft.startTime = toTime(data.start);
    draft.endTime = toTime(data.end);
    dialogOpen.value = true;
};
const openEditDialog = ({ data }) => {
    editingId.value = data.id;
    selectedSlot.value = data;
    draft.name = data.name;
    draft.startTime = toTime(data.start);
    draft.endTime = toTime(data.end);
    dialogOpen.value = true;
};
const applyTime = (source, time) => {
    const value = new Date(source);
    const [hours, minutes] = time.split(":").map(Number);
    value.setHours(hours, minutes, 0, 0);
    return value;
};
const saveEvent = () => {
    if (!canSave.value || !selectedSlot.value) return;

    const nextEvent = {
        id: editingId.value ?? `event-${Date.now()}`,
        entityId: selectedSlot.value.entityId,
        name: draft.name.trim(),
        start: applyTime(selectedSlot.value.start, draft.startTime),
        end: applyTime(selectedSlot.value.end, draft.endTime),
        color: editingId.value ? "primary" : "success",
    };
    const eventIndex = integrationEvents.value.findIndex(({ id }) => id === editingId.value);
    if (eventIndex >= 0) integrationEvents.value[eventIndex] = nextEvent;
    else integrationEvents.value.push(nextEvent);
    dialogOpen.value = false;
};

const accessibilityDate = ref(createDate(3, 0));
const accessibilityEvents = [{
    id: "accessible-review",
    entityId: "studio-a",
    name: "Revision de diseno",
    footer: "Equipo de diseno",
    start: createDate(3, 10),
    end: createDate(3, 11),
    color: "primary",
}];
const announcement = ref("Activa un evento o intervalo disponible para probar el anuncio.");
const announceEvent = ({ data }) => {
    announcement.value = `Evento seleccionado: ${data.name}`;
};
const announceSlot = ({ data }) => {
    announcement.value = `Intervalo disponible seleccionado: ${formatTime(data.start)}`;
};
</script>

<style scoped>
.schedule-page {
    display: grid;
    gap: 24px;
}

.schedule-page__header,
.schedule-demo,
.schedule-demo>header {
    display: grid;
    gap: 8px;
}

.schedule-page__header h2,
.schedule-page__header p,
.schedule-demo h3,
.schedule-demo p {
    margin: 0;
}

.schedule-page__eyebrow {
    font-size: 12px;
    text-transform: uppercase;
    opacity: 0.72;
}

.schedule-page__header>p:last-child,
.schedule-demo header p,
.schedule-demo__feedback {
    opacity: 0.8;
}

.schedule-demo {
    padding-block: 8px 24px;
    overflow-x: auto;
}

.schedule-demo__feedback {
    font-size: 14px;
}

@media (max-width: 767px) {
    .schedule-demo {
        min-width: 0;
    }
}
</style>
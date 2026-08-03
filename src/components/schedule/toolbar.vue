<template>
    <EBar class="e-schedule-toolbar" :color="color">
        <div class="e-schedule-toolbar__controls flex-grow-1 d-flex flex-wrap">
            <ESelect :label="labels.view" :items="localizedViewOptions" dense class="e-schedule-toolbar__select-view"
                :model-value="activeViewOption" @update:model-value="handleViewChange" :menu-color="color" />

            <ESelect v-if="spaces.length && view !== ScheduleView.Resource" dense
                class="e-schedule-toolbar__select-space" :label="labels.space" :items="spaceOptions"
                :model-value="selectedSpaceId" @update:model-value="handleSpaceChange" :menu-color="color" />

            <div v-if="canPaginateResources" class="e-schedule-toolbar__pager">
                <EButton size="small" text use-contrast-color :icon="icon.arrowLeft"
                    :aria-label="labels.previousResourcePage" :title="labels.previousResourcePage"
                    @click="goToPreviousResourcePage" />
                <span class="e-schedule-toolbar__pager-label">
                    {{ labels.resourcePage }} {{ resourcePage + 1 }} / {{ resourcePageCount }}
                </span>
                <EButton size="small" text use-contrast-color :icon="icon.arrowRight"
                    :aria-label="labels.nextResourcePage" :title="labels.nextResourcePage"
                    @click="goToNextResourcePage" />
            </div>
        </div>
        <EMenu v-model="datePickerOpen" :close-on-content-click="false" content-role="presentation"
            origin="bottom right">
            <template #activator="activator">
                <EButton outlined :prepend-icon="icon.calendar" v-bind="buildActivatorBindings(activator)">
                    {{ formattedPeriodLabel }}
                </EButton>
            </template>

            <EDatePicker :model-value="date" :lng="datePickerLanguage" close-on-change
                @update:model-value="handleDateChange" :color="color" />
        </EMenu>

    </EBar>
</template>

<script lang="ts" setup>
import { CalendarScale, ScheduleView } from "@/types";
import type { ScheduleSpace, ScheduleToolbarSlotProps, SelectModelValue } from "@/types";
import type { suportedLng } from "@/locales";
import EButton from "@/components/button/index.vue";
import EDatePicker from "@/components/date-picker/index.vue";
import EBar from "@/components/layout/bar/index.vue";
import ESelect from "@/components/form/select/index.vue";
import ESpacer from "@/components/layout/spacer.vue";
import EMenu from "@/components/menu/index.vue";
import icon from "@/utils/icons";

import { computed, ref } from "vue";
import type { VNodeRef } from "vue";

type ToolbarViewValue = CalendarScale | ScheduleView.Resource;
type SelectValue = string | number | null;
type ActivatorBindings = {
    ref?: VNodeRef;
    onClick?: (event?: Event) => void;
    onKeydown?: (event: KeyboardEvent) => void;
    "aria-haspopup"?: string;
    "aria-expanded"?: string;
    "aria-controls"?: string;
    "aria-disabled"?: string;
    [key: string]: unknown;
};

const props = defineProps<ScheduleToolbarSlotProps>();
const datePickerOpen = ref(false);

const viewOptions = [
    { value: CalendarScale.Day },
    { value: CalendarScale.Week },
    { value: ScheduleView.Resource },
] as const;

const localizedViewOptions = computed(() => {
    return viewOptions.map((option) => ({
        text:
            option.value === CalendarScale.Day
                ? props.labels.day
                : option.value === CalendarScale.Week
                    ? props.labels.week
                    : props.labels.resource,
        value: option.value,
    }));
});

const activeViewOption = computed<ToolbarViewValue>(() => {
    return props.view === ScheduleView.Resource ? ScheduleView.Resource : props.scale;
});

const spaceOptions = computed(() => {
    return props.spaces.map((space) => ({
        text: space.label,
        value: space.id,
    }));
});

const selectedSpaceId = computed<SelectValue>(() => {
    return props.selectedSpace?.id ?? null;
});

const datePickerLanguage = computed(() => props.locale as suportedLng);

const formattedPeriodLabel = computed(() => {
    const fullDateFormatter = new Intl.DateTimeFormat(props.locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
    const compactDateFormatter = new Intl.DateTimeFormat(props.locale, {
        month: "short",
        day: "numeric",
    });

    if (props.view === ScheduleView.Calendar && props.scale === CalendarScale.Week) {
        const endDate = new Date(props.date);
        endDate.setDate(endDate.getDate() + 6);
        return `${compactDateFormatter.format(props.date)} - ${compactDateFormatter.format(endDate)}`;
    }

    return fullDateFormatter.format(props.date);
});

const toSelectValue = (value: SelectModelValue): SelectValue => {
    return typeof value === "string" || typeof value === "number" || value === null ? value : null;
};

const buildActivatorBindings = (activator: ActivatorBindings) => ({
    ref: activator.ref,
    onClick: activator.onClick,
    onKeydown: activator.onKeydown,
    "aria-haspopup": activator["aria-haspopup"],
    "aria-expanded": activator["aria-expanded"],
    "aria-controls": activator["aria-controls"],
    "aria-disabled": activator["aria-disabled"],
});

const handleViewChange = (value: SelectModelValue) => {
    const nextValue = toSelectValue(value);

    if (nextValue === ScheduleView.Resource) {
        props.setView(ScheduleView.Resource);
        return;
    }

    if (nextValue === CalendarScale.Day || nextValue === CalendarScale.Week) {
        props.setView(ScheduleView.Calendar);
        props.setScale(nextValue);
    }
};

const handleSpaceChange = (value: SelectModelValue) => {
    const nextValue = toSelectValue(value);
    const nextSpace = props.spaces.find((space) => space.id === nextValue) as ScheduleSpace | undefined;
    props.setSelectedSpace(nextSpace);
};

const handleDateChange = (value: Date | string) => {
    props.setDate(value);
};
</script>

<style lang="scss" src="./toolbar.scss"></style>

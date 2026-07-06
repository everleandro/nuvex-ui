<template>
    <EField ref="field" v-bind="resolvedFieldProps" :class="timePickerClass">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template #append-inner>
            <slot name="append-inner"></slot>
            <div class="e-time-picker__toggle" aria-hidden="true">
                <EIcon :icon="arrowDown || icon.arrowDown" class="e-time-picker__toggle-icon" />
            </div>
        </template>

        <template #default="{ inputId, detailsId, slotClass, handleBlur, handleFocus, hasError, isDisabled, frameEl }">

            <div :class="['e-time-picker__body', slotClass]" role="group" :aria-labelledby="`${inputId}-label`"
                :aria-describedby="detailsId">
                <input :id="inputId" ref="hours" v-model="hourModel"
                    class="e-time-picker__input input--text" data-hours
                    :readonly="hourInputReadonly" :disabled="isDisabled" maxlength="2" type="text" inputmode="numeric"
                    pattern="[0-9]*" placeholder="00" autocomplete="off" aria-label="Hours" :aria-invalid="hasError"
                    :aria-describedby="detailsId" :aria-disabled="isDisabled" :aria-readonly="hourInputReadonly"
                    @focus="(event) => handleInputFocus(event, handleFocus)"
                    @blur="(event) => handleInputBlur(event, handleBlur)"/>

                <div class="e-time-picker__separator">
                    <slot name="separator"><span>:</span></slot>
                </div>

                <input :id="`${inputId}-minutes`" ref="minutes" v-model="minutesModel"
                    class="e-time-picker__input input--text" data-minutes
                    :readonly="minutesInputReadonly" :disabled="isDisabled" maxlength="2" type="text"
                    inputmode="numeric" pattern="[0-9]*" placeholder="00" autocomplete="off" aria-label="Minutes"
                    :aria-invalid="hasError" :aria-describedby="detailsId" :aria-disabled="isDisabled"
                    :aria-readonly="minutesInputReadonly"
                    @focus="(event) => handleInputFocus(event, handleFocus)"
                    @blur="(event) => handleInputBlur(event, handleBlur)"/>
            </div>

            <EMenu :activator="frameEl" v-model="opened" full-width check-offset :disable-menu="props.disabled"
                content-role="presentation">
                <div ref="menuContent" class="e-time-picker__menu-content">
                    <div class="e-time-picker__row">
                        <EButton text size="small" type="button" tabindex="-1"
                            @click="arrowActions('hours', 'add')">
                            <EIcon :icon="icon.arrowUp" />
                        </EButton>
                        <EButton text size="small" type="button" tabindex="-1"
                            @click="arrowActions('minutes', 'add')">
                            <EIcon :icon="icon.arrowUp" />
                        </EButton>
                    </div>
                    <div class="e-time-picker__row e-time-picker__row--display">
                        <div class="e-time-picker__segment e-time-picker__segment--hours">
                            <transition :name="globalTransition">
                                <span :key="hourLabel" class="e-time-picker__hour-display">
                                    {{ hourLabel }}
                                </span>
                            </transition>
                        </div>
                        <slot name="separator"><span class="e-time-picker__separator">:</span></slot>
                        <div class="e-time-picker__segment e-time-picker__segment--minutes">
                            <transition :name="globalTransition">
                                <span :key="minutesLabel" class="e-time-picker__minutes-display">
                                    {{ minutesLabel }}
                                </span>
                            </transition>
                        </div>

                    </div>
                    <div class="e-time-picker__row">
                        <EButton text size="small" type="button" tabindex="-1"
                            @click="arrowActions('hours', 'subtract')">
                            <EIcon :icon="icon.arrowDown" />
                        </EButton>
                        <EButton text size="small" type="button" tabindex="-1"
                            @click="arrowActions('minutes', 'subtract')">
                            <EIcon :icon="icon.arrowDown" />
                        </EButton>
                    </div>

                </div>
            </EMenu>
        </template>
    </EField>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, useSlots } from "vue";

import UtilDate from "@/utils/date";
import icon from "@/utils/icons";
import { useFieldIntegration } from "@/composables/field-integration";
import type {
    TimePickerEmits,
    TimePickerProps as TimePickerComponentProps,
    TimePickerValue,
} from "@/types/time-picker";

import EButton from "@/components/button/index.vue";
import EField from "@/components/form/field/index.vue";
import EIcon from "@/components/icon/index.vue";
import EMenu from "@/components/menu/index.vue";

const props = withDefaults(defineProps<TimePickerComponentProps>(), {
    minutesStep: 15,
    hoursStep: 1,
});

const emit = defineEmits<TimePickerEmits>();
const slots = useSlots();

const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<TimePickerValue>(props, slots, {
    omitSlots: ["append-inner", "default"],
});

const opened = ref(false);
const hours = ref<HTMLInputElement | null>(null);
const minutes = ref<HTMLInputElement | null>(null);
const hourDraft = ref<string | null>(null);
const minutesDraft = ref<string | null>(null);
const globalTransition = ref("picker-transition");

const resolvedFieldProps = computed(() => ({
    ...fieldProps.value,
    focusWithin: opened.value
}));

const model = computed({
    get: () => props.modelValue,
    set: (value: Date | string) => emit("update:modelValue", value),
});

const resolveModelDate = (value: Date | string): Date | null => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value);
    }

    if (typeof value === "string" && value.trim().length === 0) {
        return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const normalizedModelDate = computed(() => resolveModelDate(model.value));
const resolvedModelDate = computed(() => normalizedModelDate.value ?? new Date());

const timePickerClass = computed(() => {
    const result = ["e-time-picker"];

    if (opened.value) result.push("e-time-picker--is-open");

    return result;
});

const hourLabel = computed(() => getFormattedSegmentValue("hours"));
const minutesLabel = computed(() => getFormattedSegmentValue("minutes"));
const hourInputReadonly = computed(() => Boolean(props.readonly || props.hourReadonly));
const minutesInputReadonly = computed(() => Boolean(props.readonly || props.minuteReadonly || props.minReadonly));

const getTimeDraft = (timeKey: "hours" | "minutes") => {
    return timeKey === "hours" ? hourDraft : minutesDraft;
};

const getFormattedSegmentValue = (
    timeKey: "hours" | "minutes",
    value: Date | string = model.value,
): string => {
    const resolvedDate = resolveModelDate(value);

    if (!resolvedDate) return "";

    return new UtilDate(resolvedDate).format(timeKey === "hours" ? "hour-hh" : "minutes-mm");
};

const getNormalizedSegmentValue = (
    timeKey: "hours" | "minutes",
    value: Date | string = model.value,
): string => {
    const localValue = getFormattedSegmentValue(timeKey, value);
    const parsedValue = Number.parseInt(localValue, 10);

    if (Number.isNaN(parsedValue)) return "";

    return `${parsedValue}`;
};

const syncTimeDraft = (
    timeKey: "hours" | "minutes",
    value: Date | string = model.value,
): void => {
    const draft = getTimeDraft(timeKey);

    if (draft.value === null) return;

    draft.value = getNormalizedSegmentValue(timeKey, value);
};

const focusInput = (timeKey: "hours" | "minutes"): void => {
    if (timeKey === "hours") {
        hours.value?.focus();
        return;
    }

    minutes.value?.focus();
};

const scheduleInputFocus = (timeKey: "hours" | "minutes"): void => {
    nextTick(() => {
        focusInput(timeKey);
    });
};

const handleInputFocus = (
    event: FocusEvent,
    handleFieldFocus: (event?: FocusEvent) => void,
): void => {
    handleFieldFocus(event);
    emit("focus", event);
};

const handleInputBlur = (
    event: FocusEvent,
    handleFieldBlur: (event?: Event) => void,
): void => {
    handleFieldBlur(event);
    emit("blur", event);
};



const arrowActions = (timeKey: "minutes" | "hours", actionKey: "subtract" | "add"): void => {
    const amount = timeKey === "minutes" ? props.minutesStep : props.hoursStep;
    const baseDate = resolvedModelDate.value;
    const day = baseDate.getDate();
    const dateResult = new UtilDate(baseDate)[actionKey](amount, timeKey).set(day, "days").date;

    globalTransition.value = dateResult > baseDate ? "picker-transition" : "picker-transition-reverse";
    model.value = dateResult;
    syncTimeDraft(timeKey, dateResult);
};




const clampTimeValue = (value: number, timeKey: "hours" | "minutes"): number => {
    const min = 0;
    const max = timeKey === "hours" ? 23 : 59;
    return Math.min(max, Math.max(min, value));
};

const setTimeSegment = (timeKey: "hours" | "minutes", value: string | number): void => {
    if (props.disabled) return;
    if (timeKey === "hours" && hourInputReadonly.value) return;
    if (timeKey === "minutes" && minutesInputReadonly.value) return;

    const rawValue = `${value ?? ""}`.replace(/\D/g, "").slice(0, 2);

    if (!rawValue.length) {
        getTimeDraft(timeKey).value = null;
        return;
    }

    const parsedValue = Number.parseInt(rawValue, 10);

    if (Number.isNaN(parsedValue)) return;

    const clampedValue = clampTimeValue(parsedValue, timeKey);
    const baseDate = resolvedModelDate.value;

    const dateResult = new UtilDate(baseDate)
        .set(clampedValue, timeKey)
        .date;

    if (dateResult.getTime() !== baseDate.getTime()) {
        globalTransition.value = dateResult > baseDate ? "picker-transition" : "picker-transition-reverse";
    }

    getTimeDraft(timeKey).value = `${clampedValue}`;

    model.value = dateResult;

    if (timeKey === "hours" && rawValue.length === 2) {
        scheduleInputFocus("minutes");
    }
};

const hourModel = computed({
    get: (): string => hourDraft.value ?? hourLabel.value,
    set: (value: string | number) => setTimeSegment("hours", value),
});

const minutesModel = computed({
    get: (): string => minutesDraft.value ?? minutesLabel.value,
    set: (value: string | number) => setTimeSegment("minutes", value),
});

defineExpose({
    focus,
    blur,
    validate: () => field.value?.validate() ?? true,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
    hours,
    minutes,
});
</script>

<style lang="scss" src="./style.scss"></style>
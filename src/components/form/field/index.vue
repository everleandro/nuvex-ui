<template>
    <div ref="rootEl" :class="rootClass" :style="fieldStyle">
        <div v-if="hasPrependContent" class="e-field__prepend" :aria-hidden="!hasPrependSlot ? 'true' : undefined">
            <div ref="prependAffixEl" class="e-field__affix-content" data-affix-zone="outer" data-affix-side="start"
                data-affix-align="center">
                <div v-if="prependIcon" class="e-field__icon e-field__icon--prepend">
                    <EIcon :icon="prependIcon" />
                </div>
                <slot v-if="hasPrependSlot" name="prepend"></slot>
            </div>
        </div>
        <div ref="frameEl" :class="[
            'e-field__frame',
            {
                'e-field__frame--no-prepend': !hasPrependContent,
                'e-field__frame--no-append-inner': !hasAppendInnerContent,
            },
        ]" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)" @mousedown="handleFrameMousedown"
            @click="handleFrameClick">
            <div v-if="hasPrependInnerContent" class="e-field__prepend-inner"
                :aria-hidden="!hasPrependInnerSlot ? 'true' : undefined">
                <div ref="prependInnerAffixEl" class="e-field__affix-content" data-affix-zone="inner"
                    data-affix-side="start"
                    data-affix-align="first-line">
                    <EIcon v-if="prependInnerIcon" :icon="prependInnerIcon" />
                    <slot v-if="hasPrependInnerSlot" name="prepend-inner"></slot>
                </div>
            </div>
            <div class="e-field__overlay" aria-hidden="true"></div>
            <label :id="labelId" :for="id" :class="labelClass" :style="labelStyle">
                <slot name="label">{{ label }}</slot>
            </label>
            <slot v-bind="slotProps"></slot>
            <div v-if="hasAppendInnerContent" class="e-field__append-inner"
                :aria-hidden="!hasAppendInnerSlot ? 'true' : undefined">
                <div ref="appendInnerAffixEl" class="e-field__affix-content" data-affix-zone="inner" data-affix-side="end"
                    data-affix-align="first-line">
                    <slot v-if="hasAppendInnerSlot" name="append-inner" v-bind="appendInnerSlotProps"></slot>
                    <EIcon v-if="appendInnerIcon" :icon="appendInnerIcon" />
                </div>
            </div>
            <div v-if="!isOutlined" class="e-field__line"></div>
        </div>
        <div v-if="hasAppendContent" class="e-field__append" :aria-hidden="!hasAppendSlot ? 'true' : undefined">
            <div ref="appendAffixEl" class="e-field__affix-content" data-affix-zone="outer" data-affix-side="end"
                data-affix-align="center">
                <slot v-if="hasAppendSlot" name="append"></slot>
                <div v-if="appendIcon" class="e-field__icon e-field__icon--append">
                    <EIcon :icon="appendIcon" />
                </div>
            </div>
        </div>

        <slot name="details" v-bind="detailsSlotProps">
            <EDetails :id="detailsId" :details="details" :has-error="hasError" :show-details="showDetails" />
        </slot>

    </div>
</template>

<script setup lang="ts">
import EDetails from "@/components/form/details.vue";
import EIcon from "@/components/icon/index.vue";
import type { EFieldProps } from "@/types";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useFieldCore } from "./use-field-core";

export interface Props extends EFieldProps<unknown> {
    prefix?: string;
    suffix?: string;
    focusWithin?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "focus", value: FocusEvent): void;
    (e: "blur", value: Event): void;
}>();

const rootEl = ref<HTMLElement | null>(null);
const prependAffixEl = ref<HTMLElement | null>(null);
const appendAffixEl = ref<HTMLElement | null>(null);
const prependInnerAffixEl = ref<HTMLElement | null>(null);
const appendInnerAffixEl = ref<HTMLElement | null>(null);
let affixResizeObserver: ResizeObserver | undefined;

const {
    uid,
    dirty,
    hasError,
    rootClass,
    fieldStyle,
    hasPrependContent,
    hasPrependSlot,
    hasAppendContent,
    hasAppendSlot,
    hasPrependInnerContent,
    hasPrependInnerSlot,
    hasAppendInnerContent,
    hasAppendInnerSlot,
    handleHover,
    handleFrameMousedown,
    handleFrameClick,
    labelId,
    id,
    labelClass,
    labelStyle,
    slotProps,
    appendInnerSlotProps,
    detailsSlotProps,
    detailsId,
    details,
    showDetails,
    isOutlined,
    blur,
    focus,
    handleBlur,
    handleFocus,
    setConfiguration,
    setTableClasses,
    reset,
    resetValidation,
    validate,
} = useFieldCore(props, emit);

const getAffixSize = (element: HTMLElement | null): number => {
    if (!element) {
        return 0;
    }

    const rect = element.getBoundingClientRect();
    return Number.isFinite(rect.height) ? rect.height : 0;
};

const setCssVar = (name: string, value: number): void => {
    const target = rootEl.value;
    if (!target) {
        return;
    }

    if (value > 0) {
        target.style.setProperty(name, `${value}px`);
    } else {
        target.style.removeProperty(name);
    }
};

const syncAffixMetrics = (): void => {
    const prependSize = hasPrependSlot.value ? getAffixSize(prependAffixEl.value) : 0;
    const appendSize = hasAppendSlot.value ? getAffixSize(appendAffixEl.value) : 0;
    const prependInnerSize = hasPrependInnerSlot.value ? getAffixSize(prependInnerAffixEl.value) : 0;
    const appendInnerSize = hasAppendInnerSlot.value ? getAffixSize(appendInnerAffixEl.value) : 0;

    setCssVar("--field-prepend-affix-size", prependSize);
    setCssVar("--field-append-affix-size", appendSize);
    setCssVar("--field-prepend-inner-affix-size", prependInnerSize);
    setCssVar("--field-append-inner-affix-size", appendInnerSize);
};

const getObservedAffixElements = (): Array<HTMLElement> => {
    const result: Array<HTMLElement> = [];

    if (hasPrependSlot.value && prependAffixEl.value) {
        result.push(prependAffixEl.value);
    }

    if (hasAppendSlot.value && appendAffixEl.value) {
        result.push(appendAffixEl.value);
    }

    if (hasPrependInnerSlot.value && prependInnerAffixEl.value) {
        result.push(prependInnerAffixEl.value);
    }

    if (hasAppendInnerSlot.value && appendInnerAffixEl.value) {
        result.push(appendInnerAffixEl.value);
    }

    return result;
};

const bindAffixMeasurement = (): void => {
    affixResizeObserver?.disconnect();

    const observedElements = getObservedAffixElements();
    if (!observedElements.length || typeof ResizeObserver === "undefined") {
        syncAffixMetrics();
        return;
    }

    affixResizeObserver = new ResizeObserver(() => {
        syncAffixMetrics();
    });

    observedElements.forEach((element) => {
        affixResizeObserver?.observe(element);
    });

    syncAffixMetrics();
};

watch(
    [hasPrependSlot, hasAppendSlot, hasPrependInnerSlot, hasAppendInnerSlot],
    () => {
        void nextTick(() => {
            bindAffixMeasurement();
        });
    },
    { immediate: true },
);

onMounted(() => {
    void nextTick(() => {
        bindAffixMeasurement();
    });
});

onBeforeUnmount(() => {
    affixResizeObserver?.disconnect();
    affixResizeObserver = undefined;
});

defineExpose({
    uid,
    dirty,
    hasError,
    blur,
    focus,
    handleBlur,
    handleFocus,
    setConfiguration,
    setTableClasses,
    reset,
    resetValidation,
    validate,
});
</script>

<style lang="scss" src="./index.scss"></style>
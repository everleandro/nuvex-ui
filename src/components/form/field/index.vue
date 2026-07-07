<template>
    <div :class="rootClass" :style="fieldStyle">
        <div v-if="hasPrependContent" class="e-field__prepend" :aria-hidden="!hasPrependSlot ? 'true' : undefined">
            <div v-if="prependIcon" class="e-field__icon e-field__icon--prepend">
                <EIcon :icon="prependIcon" />
            </div>
            <slot v-if="hasPrependSlot" name="prepend"></slot>
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
                <EIcon v-if="prependInnerIcon" :icon="prependInnerIcon" />
                <slot v-if="hasPrependInnerSlot" name="prepend-inner"></slot>
            </div>
            <div class="e-field__overlay" aria-hidden="true"></div>
            <label :id="labelId" :for="id" :class="labelClass" :style="labelStyle">
                <slot name="label">{{ label }}</slot>
            </label>
            <slot v-bind="slotProps"></slot>
            <div v-if="hasAppendInnerContent" class="e-field__append-inner"
                :aria-hidden="!hasAppendInnerSlot ? 'true' : undefined">
                <slot v-if="hasAppendInnerSlot" name="append-inner" v-bind="appendInnerSlotProps"></slot>
                <EIcon v-if="appendInnerIcon" :icon="appendInnerIcon" />
            </div>
            <div v-if="!isOutlined" class="e-field__line"></div>
        </div>
        <div v-if="hasAppendContent" class="e-field__append" :aria-hidden="!hasAppendSlot ? 'true' : undefined">
            <slot v-if="hasAppendSlot" name="append"></slot>
            <div v-if="appendIcon" class="e-field__icon e-field__icon--append">
                <EIcon :icon="appendIcon" />
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
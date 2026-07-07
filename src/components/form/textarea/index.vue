<template>
    <EField ref="field" v-bind="fieldProps" class="e-textarea">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template #append-inner>
            <ButtonClear v-if="canClear" :icon="iconClear" :show="canClear" @clear="clear" />
            <slot name="append-inner"></slot>
        </template>

        <template #default="{
            inputId,
            detailsId,
            slotClass,
            handleBlur,
            handleFocus,
            hasError,
            isDisabled,
            isLabelFloating,
            shouldFloatLabel,
        }">
            <div v-if="prefix" class="e-textarea__prefix e-field__prefix" aria-hidden="true" @click="handleFocus">
                {{ prefix }}
            </div>

            <textarea ref="input" :id="inputId" :value="inputValue" :rows="rows" :maxlength="limit" :name="name"
                :readonly="textInputReadonly" :disabled="isDisabled" :autocomplete="autocomplete"
                :placeholder="resolvePlaceholder(isLabelFloating, shouldFloatLabel)" :spellcheck="spellcheck"
                :autocapitalize="autocapitalize" :enterkeyhint="enterkeyhint" :aria-invalid="hasError"
                :aria-describedby="detailsId" :aria-disabled="isDisabled" :aria-readonly="textInputReadonly"
                :class="['e-textarea__input', slotClass]" :style="inputStyle" @blur="(event) => handleInputBlur(event, handleBlur)" @change="handleTextareaChange"
                @focus="(event) => handleInputFocus(event, handleFocus)" @input="handleTextareaInput" @keydown="handleKeydown" @keyup="handleKeyup"
                @compositionstart="handleCompositionStart" @compositionend="handleTextareaCompositionEnd"></textarea>

            <div v-if="suffix" class="e-textarea__suffix e-field__suffix" aria-hidden="true" @click="handleFocus">
                {{ suffix }}
            </div>
        </template>

        <template #details="slotProps">
            <EDetails :counter="counter" :details="slotProps.details" :has-error="slotProps.hasError"
                :model-value="modelValue" :limit="limit" :id="slotProps.detailsId" :show-details="slotProps.showDetails" />
        </template>
    </EField>
</template>

<script setup lang="ts">
import { useTextInput } from "@/composables/text-input";
import { useFieldIntegration } from "@/composables/field-integration";
import type {
    TextInputEmits,
    TextInputElement,
    TextInputValue,
    UseTextInputProps,
} from "@/types";

import EDetails from "@/components/form/details.vue";
import ButtonClear from "@/components/form/button-clear/index.vue";
import EField from "@/components/form/field/index.vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";

export interface Props extends UseTextInputProps<TextInputValue> {
    autoGrow?: boolean;
    counter?: boolean;
    maxRows?: number | string;
    prefix?: string;
    rows?: number | string;
    suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
    inputAlign: "start",
    modelModifiers: () => ({}),
    rows: 3,
    spellcheck: false,
});

const emit = defineEmits<TextInputEmits>();
const slots = useSlots();
const input = ref<TextInputElement | null>(null);
let resizeObserver: ResizeObserver | undefined;

const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<TextInputValue>(props, slots, {
    omitSlots: ["append-inner", "default", "details"],
});

const inputStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {};

    if (props.inputAlign) {
        result.textAlign = String(props.inputAlign);
    }

    return result;
});

const resolvedRows = computed<number>(() => {
    const parsed = Number.parseInt(String(props.rows ?? 3), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
});

const resolvedMaxRows = computed<number | undefined>(() => {
    if (props.maxRows === undefined || props.maxRows === null || props.maxRows === "") {
        return undefined;
    }

    const parsed = Number.parseInt(String(props.maxRows), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return undefined;
    }

    return parsed;
});

const resolveTextareaElement = (): HTMLTextAreaElement | null => {
    return input.value instanceof HTMLTextAreaElement ? input.value : null;
};

const resolveLineHeight = (element: HTMLTextAreaElement, styles: CSSStyleDeclaration): number => {
    const parsedLineHeight = Number.parseFloat(styles.lineHeight);
    if (Number.isFinite(parsedLineHeight)) {
        return parsedLineHeight;
    }

    const parsedFontSize = Number.parseFloat(styles.fontSize);
    return Number.isFinite(parsedFontSize) ? parsedFontSize * 1.2 : 20;
};

const resetAutoGrowStyles = (): void => {
    const textarea = resolveTextareaElement();
    if (!textarea) return;

    textarea.style.removeProperty("height");
    textarea.style.removeProperty("overflow-y");
};

const syncAutoGrowHeight = (): void => {
    const textarea = resolveTextareaElement();
    if (!textarea || !props.autoGrow) {
        return;
    }

    const styles = window.getComputedStyle(textarea);
    const lineHeight = resolveLineHeight(textarea, styles);
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
    const borderTop = Number.parseFloat(styles.borderTopWidth) || 0;
    const borderBottom = Number.parseFloat(styles.borderBottomWidth) || 0;
    const verticalExtras = paddingTop + paddingBottom + borderTop + borderBottom;

    const minHeight = resolvedRows.value * lineHeight + verticalExtras;
    const maxRows = resolvedMaxRows.value;
    const maxHeight = maxRows ? maxRows * lineHeight + verticalExtras : undefined;

    textarea.style.height = "auto";
    const contentHeight = textarea.scrollHeight;
    const nextHeight = maxHeight === undefined
        ? Math.max(contentHeight, minHeight)
        : Math.min(Math.max(contentHeight, minHeight), maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = maxHeight !== undefined && contentHeight > maxHeight ? "auto" : "hidden";
};

const syncAutoGrowHeightNextTick = (): void => {
    void nextTick(() => {
        syncAutoGrowHeight();
    });
};

const observeAutoGrowContainer = (): void => {
    resizeObserver?.disconnect();
    resizeObserver = undefined;

    if (!props.autoGrow || typeof ResizeObserver === "undefined") {
        return;
    }

    const textarea = resolveTextareaElement();
    const target = textarea?.closest(".e-field__frame");
    if (!target) {
        return;
    }

    resizeObserver = new ResizeObserver(() => {
        syncAutoGrowHeight();
    });

    resizeObserver.observe(target);
};

watch(
    () => props.autoGrow,
    (enabled) => {
        if (!enabled) {
            resetAutoGrowStyles();
            return;
        }

        syncAutoGrowHeightNextTick();
        observeAutoGrowContainer();
    },
    { immediate: true },
);

watch(
    () => [props.modelValue, props.rows, props.maxRows],
    () => {
        syncAutoGrowHeightNextTick();
    },
);

watch(
    input,
    () => {
        observeAutoGrowContainer();
        syncAutoGrowHeightNextTick();
    },
);

onMounted(() => {
    observeAutoGrowContainer();
    syncAutoGrowHeightNextTick();
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = undefined;
});

const canClear = computed(() => {
    return Boolean(
        props.clearable &&
        !props.disabled &&
        !(props.readonly || props.inputReadonly) &&
        props.modelValue !== undefined &&
        props.modelValue !== null &&
        `${props.modelValue}`.length > 0,
    );
});

const resolvePlaceholder = (
    isLabelFloating: boolean,
    shouldFloatLabel: boolean,
): string | undefined => {
    if (!props.placeholder) return undefined;
    if (!isLabelFloating) return props.placeholder;

    return shouldFloatLabel ? props.placeholder : undefined;
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

const {
    inputValue,
    isReadonly: textInputReadonly,
    handleChange,
    handleCompositionEnd,
    handleCompositionStart,
    handleInput,
    handleKeydown,
    handleKeyup,
    clear,
    select,
} = useTextInput({
    props,
    emit,
    input,
    focus,
    canClear,
});

const handleTextareaInput = (event: Event): void => {
    handleInput(event);
    syncAutoGrowHeight();
};

const handleTextareaChange = (event: Event): void => {
    handleChange(event);
    syncAutoGrowHeight();
};

const handleTextareaCompositionEnd = (event: CompositionEvent): void => {
    handleCompositionEnd(event);
    syncAutoGrowHeight();
};

defineExpose({
    blur,
    focus,
    input,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
    select,
    validate: () => field.value?.validate() ?? true,
});
</script>

<style lang="scss" src="./index.scss"></style>

<template>
    <EField ref="field" v-bind="resolvedFieldProps" :class="radioGroupClass">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template
            #default="{ inputId, detailsId, slotClass, handleBlur, handleFocus, hasError, isDisabled, isReadonly }">

            <div
                role="radiogroup"
                :class="resolveGroupClass(slotClass, { handleBlur, handleFocus, isDisabled, isReadonly })"
                :aria-invalid="hasError"
                :aria-disabled="isDisabled"
                :aria-readonly="isReadonly"
                :aria-labelledby="`${inputId}-label`"
                :aria-describedby="detailsId"
            >
                <slot></slot>
            </div>
        </template>
    </EField>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, onMounted, provide, reactive, ref, useSlots } from "vue";
import type { ERadio, ERadioType, RadioGroupEmits, RadioGroupProps } from "@/types";
import { normalizeCssSize } from "@/utils/style";
import { useFieldIntegration } from "@/composables/field-integration";
import EField from "@/components/form/field/index.vue";
import { RADIO_GROUP_KEY } from "./constants";

const props = withDefaults(defineProps<RadioGroupProps>(), {
    tonal: false,
});

const slots = useSlots();
const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<ERadioType>(props, slots, {
    omitSlots: ["default"],
});
const resolvedFieldProps = computed(() => ({
    ...fieldProps.value,
    labelBehavior: "static" as const,
}));

const radioGroupClass = computed(() => {
    const result = ["e-radio-group-field"];
    if (props.row) {
        result.push("e-radio-group-field--row");
    } else {
        result.push("e-radio-group-field--column");
    }
    return result;
});

const emit = defineEmits<RadioGroupEmits>();
const instance = getCurrentInstance();

const state = reactive<{ radioChilds: Array<Partial<ERadio>> }>({ radioChilds: [] });
const effectiveDisabled = ref(false);
const effectiveReadonly = ref(false);
const focusHandler = ref<(event?: FocusEvent) => void>();
const blurHandler = ref<(event?: Event) => void>();
const resolvedLabelStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    const labelMinWidth = normalizeCssSize(props.labelMinWidth);

    if (labelMinWidth) {
        result.minWidth = labelMinWidth;
    }

    return result;
});

const hasSelectedRadio = computed(() => {
    return state.radioChilds.some((radio) => Object.is(radio.modelValue, props.modelValue));
});
const canInitializeMandatoryValue = computed(() => {
    return props.mandatory && !effectiveDisabled.value && !effectiveReadonly.value && !hasSelectedRadio.value;
});

const bindRadio = (component: Partial<ERadio>) => {
    state.radioChilds.push(component);
};

const unbindRadio = (uid: number) => {
    const index = state.radioChilds.findIndex((c) => c.uid === uid);
    (index > -1) && (state.radioChilds.splice(index, 1));
};

const changeModelValue = (value: ERadioType): void => emit("update:modelValue", value);

const handleGroupFocus = (event?: FocusEvent): void => {
    focusHandler.value?.(event);
    if (event) {
        emit("focus", event);
    }
};

const handleGroupBlur = (event?: Event): void => {
    blurHandler.value?.(event);
    if (event) {
        emit("blur", event);
    }
};

const resolveGroupClass = (
    slotClass: string | Array<string> | Record<string, boolean> | undefined,
    slotState: {
        handleBlur: (event?: Event) => void;
        handleFocus: (event?: FocusEvent) => void;
        isDisabled: boolean;
        isReadonly: boolean;
    },
): Array<string | Array<string> | Record<string, boolean> | undefined> => {
    effectiveDisabled.value = slotState.isDisabled;
    effectiveReadonly.value = slotState.isReadonly;
    focusHandler.value = slotState.handleFocus;
    blurHandler.value = slotState.handleBlur;

    return ["e-radio-group-field__group", "e-radio-group-field__options", slotClass];
};

provide(RADIO_GROUP_KEY, {
    bindRadio,
    unbindRadio,
    handleFocus: handleGroupFocus,
    handleBlur: handleGroupBlur,
    changeModelValue,
    modelValue: computed(() => props.modelValue),
    isDisabled: computed(() => effectiveDisabled.value),
    isReadonly: computed(() => effectiveReadonly.value),
    labelStyle: resolvedLabelStyle,
    name: `e-radio-group-${instance?.uid ?? "unknown"}`,
});

onMounted(() => init());

const init = async (): Promise<void> => {
    await nextTick();

    if (!canInitializeMandatoryValue.value) return;

    const firstRadioValue = state.radioChilds[0]?.modelValue;

    if (firstRadioValue === undefined) return;

    changeModelValue(firstRadioValue);
};

defineExpose({
    focus,
    blur,
    validate: () => field.value?.validate() ?? true,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
});

</script>
<style lang="scss" src="./style.scss"></style>
<template>
    <EField ref="field" v-bind="resolvedFieldProps" :class="checkboxClass">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template
            #default="{ inputId, detailsId, slotClass, handleBlur, handleFocus, hasError, isDisabled, isFocusWithin, isReadonly }">
            <div :class="['e-checkbox-field__slot', slotClass]"
                @click="(event) => handleSlotClick(event, handleFocus, isDisabled, isReadonly)">

                <div class="e-field__control" :data-focused="isFocusWithin">
                    <input class="e-field__control-input" ref="input" v-model="checkedModel" :value="trueValue"
                        :aria-checked="checkedModel" :id="inputId" role="checkbox" type="checkbox"
                        :disabled="isControlNonInteractive || isDisabled || isReadonly" :aria-invalid="hasError"
                        :aria-describedby="detailsId"
                        :aria-disabled="isControlNonInteractive || isDisabled || isReadonly" :aria-readonly="isReadonly"
                        @focus="handleFocus" @blur="handleBlur" />
                    <div class="e-field__control-visual" aria-hidden="true">
                        <span class="e-checkbox-field__icon e-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                role="img" aria-hidden="true" class="e-icon__svg">
                                <path v-if="checkedModel"
                                    d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z">
                                </path>
                                <path v-else
                                    d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z">
                                </path>
                            </svg>
                        </span>
                        <span v-ripple="{ center: true }" class="e-field__control-ripple"></span>
                    </div>


                </div>
            </div>
        </template>

        <template #details="slotProps">
            <EDetails :id="slotProps.detailsId" :details="slotProps.details" :has-error="slotProps.hasError"
                :model-value="modelValue" :show-details="slotProps.showDetails" />
        </template>
    </EField>
</template>
<script lang="ts" setup>
import type { CheckboxProps, CheckboxValue } from "@/types";
import { ripple } from "@/directives";
import { computed, ref, useSlots } from "vue";
import { useFieldIntegration } from "@/composables/field-integration";

import EDetails from "@/components/form/details.vue";
import EField from "@/components/form/field/index.vue";
const vRipple = { ...ripple };
const props = withDefaults(defineProps<CheckboxProps>(), {
    tonal: false,
    trueValue: true,
    falseValue: false,
});

const input = ref<HTMLInputElement | null>(null);
const slots = useSlots();

const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<CheckboxValue>(props, slots, {
    omitSlots: ["default", "details"],
});

const emit = defineEmits({
    "update:modelValue": (_value: CheckboxValue) => true,
});

const resolvedFieldProps = computed(() => ({
    ...fieldProps.value,
    labelBehavior: "static" as const,
}));

const checkboxClass = computed((): Array<string> => {
    const classes = ["e-checkbox-field"];
    checkedModel.value && classes.push("e-checkbox-field--active");
    return classes;
});

const isControlNonInteractive = computed((): boolean => {
    return Boolean(props.disabled || props.readonly);
});

const checkedModel = computed({
    get: (): boolean => props.modelValue === props.trueValue,
    set: (checked: boolean): void => {
        if (isControlNonInteractive.value) {
            if (input.value) input.value.checked = checkedModel.value;
            return;
        }

        emit("update:modelValue", checked ? props.trueValue : props.falseValue);
    },
});

const isNativeSlotTarget = (target: EventTarget | null): boolean => {
    return target instanceof Element && Boolean(target.closest("input, label"));
};

const handleSlotClick = (
    event: MouseEvent,
    handleFieldFocus: (event?: FocusEvent) => void,
    isDisabled: boolean,
    isReadonly: boolean,
): void => {
    if (isNativeSlotTarget(event.target)) return;

    handleFieldFocus();

    if (isControlNonInteractive.value || isDisabled || isReadonly) return;

    checkedModel.value = !checkedModel.value;
};

defineExpose({
    focus,
    blur,
    validate: () => field.value?.validate() ?? true,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
    input,
});
</script>
<style lang="scss" src="./style.scss"></style>
<template>
    <EField ref="field" v-bind="resolvedFieldProps" :class="switchClass">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template
            #default="{ inputId, detailsId, slotClass, handleBlur, handleFocus, hasError, isDisabled, isFocusWithin, isReadonly }">
            <div :class="['e-switch-field__slot', slotClass]"
                @click="(event) => handleSlotClick(event, handleFocus, isDisabled, isReadonly)">

                <div class="e-field__control" :data-focused="isFocusWithin">
                    <input class="e-field__control-input" ref="input" v-model="checkedModel" :value="trueValue"
                        :aria-checked="checkedModel" :id="inputId" role="switch" type="checkbox"
                        :disabled="isControlNonInteractive || isDisabled || isReadonly" :aria-invalid="hasError"
                        :aria-describedby="detailsId"
                        :aria-disabled="isControlNonInteractive || isDisabled || isReadonly" :aria-readonly="isReadonly"
                        :aria-busy="isLoading || undefined" @focus="handleFocus" @blur="handleBlur" />
                    <div class="e-field__control-visual">
                        <div class="e-switch-field__track"></div>
                        <div class="e-switch-field__thumb">
                            <span v-ripple="{ center: true }" class="e-field__control-ripple"></span>
                            <EProgressCircular v-show="isLoading" :size="16" :stroke-width="5.714285714285714" />
                        </div>
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
import { useFieldIntegration } from "@/composables/field-integration"
import type { SwitchProps, SwitchValue } from "@/types/switch"
import { ripple } from "@/directives";

import EDetails from '@/components/form/details.vue'
import EField from "@/components/form/field/index.vue";
import EProgressCircular from "@/components/progress/circular.vue";

import { computed, ref, useSlots } from "vue";

const props = withDefaults(defineProps<SwitchProps>(), {
    falseValue: false,
    tonal: false,
    trueValue: true,
})
const input = ref<HTMLInputElement | null>(null)
const slots = useSlots();
const VRipple = { ...ripple };

const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<SwitchValue>(props, slots, {
    omitSlots: ["default", "details"],
});

const emit = defineEmits({
    'update:modelValue': (_value: SwitchValue) => true,
})

const isLoading = computed((): boolean => Boolean(props.loading))
const resolvedFieldProps = computed(() => ({
    ...fieldProps.value,
    labelBehavior: "static" as const,
}));

const switchClass = computed((): Array<string> => {
    const classes = ['e-switch-field']
    checkedModel.value && classes.push('e-switch-field--active')
    isLoading.value && classes.push('e-switch-field--loading')
    return classes
})
const isControlNonInteractive = computed((): boolean => {
    return Boolean(props.disabled || props.readonly || isLoading.value)
})
const checkedModel = computed({
    get: (): boolean => props.modelValue === props.trueValue,
    set: (checked: boolean): void => {
        if (isControlNonInteractive.value) {
            if (input.value) input.value.checked = checkedModel.value
            return
        }

        emit('update:modelValue', checked ? props.trueValue : props.falseValue)
    },
})

const isNativeSlotTarget = (target: EventTarget | null): boolean => {
    return target instanceof Element && Boolean(target.closest('input, label'))
}

const handleSlotClick = (
    event: MouseEvent,
    handleFieldFocus: (event?: FocusEvent) => void,
    isDisabled: boolean,
    isReadonly: boolean,
): void => {
    if (isNativeSlotTarget(event.target)) return

    handleFieldFocus()

    if (isControlNonInteractive.value || isDisabled || isReadonly) return

    checkedModel.value = !checkedModel.value
}

defineExpose({
    focus,
    blur,
    validate: () => field.value?.validate() ?? true,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
    input,
})

</script>
<style lang="scss" src="./style.scss"></style>
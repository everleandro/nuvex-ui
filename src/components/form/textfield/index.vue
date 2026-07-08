<template>
  <EField ref="field" v-bind="fieldProps" class="e-text-field">
    <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}"></slot>
    </template>

    <template #append-inner>
      <buttonClear v-if="canClear" :icon="iconClear" :show="canClear" @clear="clear" />
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
      <div v-if="prefix" class="e-text-field__prefix e-field__prefix" aria-hidden="true" @click="handleFocus">
        {{ prefix }}
      </div>

      <input ref="input" :id="inputId" :value="inputValue" :readonly="textInputReadonly" :disabled="isDisabled"
        :class="['e-text-field__input', 'input--text', slotClass]" :maxlength="limit" :style="inputStyle" :type="type"
        :placeholder="resolvePlaceholder(isLabelFloating, shouldFloatLabel)" :name="name" :autocomplete="autocomplete"
        :inputmode="inputmode" :spellcheck="spellcheck" :autocapitalize="autocapitalize" :enterkeyhint="enterkeyhint"
        :aria-invalid="hasError" :aria-describedby="detailsId" :aria-disabled="isDisabled"
        :aria-readonly="textInputReadonly" @blur="(event) => handleInputBlur(event, handleBlur)" @change="handleChange" @input="handleInput"
        @focus="(event) => handleInputFocus(event, handleFocus)" @keydown="handleKeydown" @keyup="handleKeyup" @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd" />

      <div v-if="suffix" class="e-text-field__suffix e-field__suffix" aria-hidden="true" @click="handleFocus">
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
  TextInputInputMode,
  TextInputValue,
  UseTextInputProps,
} from "@/types";

import EDetails from "@/components/form/details.vue";
import EField from "@/components/form/field/index.vue";
import ButtonClear from "@/components/form/button-clear/index.vue";
import { computed, ref, useSlots } from "vue";

export interface Props extends UseTextInputProps<TextInputValue> {
  counter?: boolean;
  suffix?: string;
  prefix?: string;
  inputmode?: TextInputInputMode;
}

const props = withDefaults(defineProps<Props>(), {
  inputAlign: "start",
  type: "text",
  modelModifiers: () => ({}),
  spellcheck: false,
  tonal: true,
});

const emit = defineEmits<TextInputEmits>();
const slots = useSlots();
const input = ref<TextInputElement | null>(null);

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
  handleInput,
  handleChange,
  handleKeydown,
  handleKeyup,
  handleCompositionStart,
  handleCompositionEnd,
  clear,
  select,
} = useTextInput({
  props,
  emit,
  input,
  focus,
  canClear,
});

defineExpose({
  focus,
  blur,
  input,
  select,
  validate: () => field.value?.validate() ?? true,
  reset: () => field.value?.reset(),
  resetValidation: () => field.value?.resetValidation?.(),
});
</script>
<style lang="scss" src="./style.scss"></style>

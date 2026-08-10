import type { SelectionFieldBaseProps } from "./field";

export type CheckboxValue = boolean | string | number;

export interface CheckboxProps extends SelectionFieldBaseProps<CheckboxValue> {
  modelValue: CheckboxValue;
  trueValue?: CheckboxValue;
  falseValue?: CheckboxValue;
}

export interface CheckboxEmits {
  (e: "update:modelValue", value: CheckboxValue): void;
}
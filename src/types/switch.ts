import type { SelectionFieldBaseProps } from "./field";

export type SwitchValue = boolean | string | number;

export interface SwitchProps extends SelectionFieldBaseProps<SwitchValue> {
  modelValue: SwitchValue;
  loading?: boolean;
  trueValue?: SwitchValue;
  falseValue?: SwitchValue;
}

export interface SwitchEmits {
  (e: "update:modelValue", value: SwitchValue): void;
}
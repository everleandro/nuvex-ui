import type { SelectionFieldBaseProps } from "./field";

export type ERadioType = string | number | null | undefined;

export interface RadioProps {
  label?: string | number;
  modelValue: ERadioType;
}

export interface RadioGroupProps extends SelectionFieldBaseProps<ERadioType> {
  mandatory?: boolean;
  modelValue: ERadioType;
  row?: boolean;
}

export interface RadioGroupEmits {
  (e: "update:modelValue", value: ERadioType): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: Event): void;
}

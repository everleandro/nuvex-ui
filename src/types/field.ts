import type { ColProps } from "./grid";
import type { IconPath } from "./icon";
import type { CSSProperties } from "vue";

export type FieldValidationResult = true | string;
export type FieldLabelBehavior = "static" | "floating" | "inline";
export type SelectionFieldLabelBehavior = Exclude<FieldLabelBehavior, "floating">;

export type FieldRule<T = unknown> = (value: T) => FieldValidationResult;

export interface FieldConfiguration {
  labelStyle?: Record<string, string>;
  color?: string;
  retainColor?: boolean;
  dense?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  outlined?: boolean;
  labelBehavior?: FieldLabelBehavior;
}

export interface EFieldProps<TValue = unknown> extends ColProps {
  retainColor?: boolean;
  disabled?: boolean;
  dense?: boolean;
  readonly?: boolean;
  labelBehavior?: FieldLabelBehavior;
  prependIcon?: Array<IconPath> | IconPath | string;
  prependInnerIcon?: Array<IconPath> | IconPath | string;
  appendInnerIcon?: Array<IconPath> | IconPath | string;
  appendIcon?: Array<IconPath> | IconPath | string;
  detail?: string;
  outlined?: boolean;
  modelValue?: TValue;
  color?: string;
  detailErrors?: Array<string>;
  detailsOnMessageOnly?: boolean;
  rules?: Array<FieldRule<TValue>>;
  label?: string | number;
  labelMinWidth?: string | number;
  inputAlign?: CSSProperties["textAlign"];
  clearable?: boolean;
  tonal?: boolean;
}

export type FieldWrapperProps<TValue = unknown> = Omit<
  EFieldProps<TValue>,
  "label" | "labelMinWidth" | "inputAlign" | "clearable"
>;

export type FieldLabelProps = Pick<EFieldProps, "label" | "labelMinWidth">;

export interface FieldBaseProps<TValue = unknown> extends EFieldProps<TValue> {}

export interface TextualFieldBaseProps<TValue = unknown>
  extends FieldBaseProps<TValue> {}

export type SelectionFieldBaseProps<TValue = unknown> = Omit<
  FieldBaseProps<TValue>,
  "labelBehavior"
> & {
  labelBehavior?: SelectionFieldLabelBehavior;
};

export interface UseFieldProps<TValue = unknown> extends FieldBaseProps<TValue> {}

export interface EField {
  setConfiguration: (value: FieldConfiguration) => void;
  uid: number;
  dirty: boolean;
  hasError: boolean;
  focus?: () => void;
  validate: () => boolean;
  reset: () => void;
  resetValidation?: () => void;
}

export type FieldStateKey =
  | "disabled"
  | "readonly"
  | "hasError"
  | "hasValue"
  | "focused"
  | "focusWithin"
  | "labelFloated"
  | "retainColor"
  | "hovered";

export type FieldVariantKey =
  | "outlined"
  | "labelFloating"
  | "labelInline"
  | "dense";

export type FieldClassKey = FieldStateKey | FieldVariantKey;

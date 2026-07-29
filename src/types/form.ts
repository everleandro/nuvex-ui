import type { ComputedRef } from "vue";

import type { EField } from "./field";
import type { ColProps } from "./grid";
import type { ERadioType } from "./radio";

export interface FormTableChild extends ColProps {
  uid: number;
  setTableClasses?: (value: Array<string>) => void;
}

export interface FormInjection {
  bindField: (component: Partial<EField>) => void;
  unbindField: (uid: number) => void;
  updateField: (component: Partial<EField>) => void;
  bindTableChild: (component: Partial<FormTableChild>) => void;
  unbindTableChild: (uid: number) => void;
  updateTableChild: (component: Partial<FormTableChild>) => void;
}

export interface EForm {
  bindField: (component: Partial<EField>) => void;
  unbindField: (uid: number) => void;
  validate: () => Promise<boolean>;
  reset: () => void;
  resetValidation: () => void;
  updateField: (component: Partial<EField>) => void;
  bindTableChild: (component: Partial<FormTableChild>) => void;
  unbindTableChild: (uid: number) => void;
  updateTableChild: (component: Partial<FormTableChild>) => void;
}

export interface ERadio {
  uid: number;
  modelValue: ERadioType;
}

export interface ERadioGroup {
  bindRadio: (component: Partial<ERadio>) => void;
  unbindRadio: (uid: number) => void;
  changeModelValue: (value: ERadioType) => void;
  handleFocus: (value?: FocusEvent) => void;
  handleBlur: (value?: Event) => void;
  modelValue: ComputedRef<ERadioType>;
  isDisabled: ComputedRef<boolean>;
  isReadonly: ComputedRef<boolean>;
  labelStyle: ComputedRef<Record<string, string>>;
  name: string;
}

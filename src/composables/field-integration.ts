import { computed, ref } from "vue";
import type { Slots } from "vue";
import type { EField as EFieldContract, EFieldProps } from "@/types";

const fieldPropKeys = [
  "appendIcon",
  "appendInnerIcon",
  "color",
  "cols",
  "clearable",
  "dense",
  "detail",
  "detailErrors",
  "detailsOnMessageOnly",
  "disabled",
  "label",
  "labelBehavior",
  "labelMinWidth",
  "lg",
  "md",
  "modelValue",
  "outlined",
  "prependIcon",
  "prependInnerIcon",
  "readonly",
  "retainColor",
  "rules",
  "sm",
  "xl",
  "xs",
] as const;

type FieldPropKey = (typeof fieldPropKeys)[number];

export type FieldInstance = Pick<
  EFieldContract,
  "focus" | "reset" | "resetValidation" | "validate"
> & {
  blur?: () => void;
};

type FieldIntegrationOptions = {
  omitSlots?: Array<string>;
};

export const useFieldIntegration = <TValue = unknown>(
  props: EFieldProps<TValue>,
  slots: Slots,
  options: FieldIntegrationOptions = {},
) => {
  const omittedSlots = new Set(options.omitSlots ?? []);

  const passThroughSlots = computed<Record<string, Slots[string]>>(() => {
    return Object.fromEntries(
      Object.entries(slots).filter(([name]) => !omittedSlots.has(name)),
    );
  });

  const field = ref<FieldInstance | null>(null);

  const fieldProps = computed<EFieldProps<unknown>>(() => {
    const result: Record<string, unknown> = {};

    fieldPropKeys.forEach((key) => {
      result[key] = props[key as FieldPropKey];
    });

    return result as EFieldProps<unknown>;
  });

  const focus = (): void => {
    field.value?.focus?.();
  };

  const blur = (): void => {
    field.value?.blur?.();
  };

  return {
    blur,
    field,
    fieldProps,
    focus,
    passThroughSlots,
  };
};
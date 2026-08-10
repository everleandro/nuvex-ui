import * as Vue from "vue";
import {
  Comment,
  computed,
  Fragment,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  Text,
  useSlots,
  watch,
} from "vue";
import { useResolvedColor } from "@/composables/color";
import { useGridCol } from "@/composables/grid-col";
import { FORM_KEY, fieldStateClasses, fieldVariantClasses } from "@/components/form/constants";
import { getFocusableElementInRoot, hasFieldValue, isDomFocused, resolveFocusableElement } from "@/utils/field";
import { normalizeCssSize } from "@/utils/style";
import type { FocusableElement } from "@/utils/field";
import type {
  EField as EFieldContract,
  EFieldProps,
  FieldConfiguration,
  FieldLabelBehavior,
  FormTableChild,
  FormInjection,
} from "@/types";

type FieldEmit = {
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: Event): void;
};

type FieldCoreProps = EFieldProps<unknown> & {
  focusWithin?: boolean;
};

type FieldConfigurationState = {
  labelStyle: Record<string, string>;
  color?: string;
  retainColor: boolean;
  dense: boolean;
  disabled: boolean;
  readonly: boolean;
  outlined: boolean;
  labelBehavior?: FieldLabelBehavior;
};

export const useFieldCore = (props: FieldCoreProps, emit: FieldEmit) => {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error("Field must be used within setup().");
  }

  const frameEl = ref<HTMLElement | null>(null);
  const slots = useSlots();
  const form = inject<FormInjection | undefined>(FORM_KEY, undefined);

  const hasRenderableNodes = (nodes: unknown[]): boolean => {
    return nodes.some((node) => {
      if (!node || typeof node !== "object") return false;

      const vnode = node as { type?: unknown; children?: unknown };
      if (vnode.type === Comment) return false;

      if (vnode.type === Text) {
        return typeof vnode.children === "string" && vnode.children.trim().length > 0;
      }

      if (vnode.type === Fragment && Array.isArray(vnode.children)) {
        return hasRenderableNodes(vnode.children as unknown[]);
      }

      return true;
    });
  };

  const hasSlotContent = (name: string): boolean => {
    const slot = slots[name];
    if (!slot) return false;

    const nodes = slot();
    return hasRenderableNodes(nodes as unknown[]);
  };

  const hasPrependSlot = computed(() => hasSlotContent("prepend"));
  const hasAppendSlot = computed(() => hasSlotContent("append"));
  const hasAppendContent = computed(() => hasAppendSlot.value || Boolean(props.appendIcon));
  const hasPrependContent = computed(() => hasPrependSlot.value || Boolean(props.prependIcon));
  const hasPrependInnerSlot = computed(() => hasSlotContent("prepend-inner"));
  const hasPrependInnerContent = computed(() => hasPrependInnerSlot.value || Boolean(props.prependInnerIcon));
  const hasAppendInnerSlot = computed(() => hasSlotContent("append-inner"));
  const hasAppendInnerContent = computed(() => hasAppendInnerSlot.value || Boolean(props.appendInnerIcon));

  const configuration = reactive<FieldConfigurationState>({
    labelStyle: {},
    retainColor: false,
    dense: false,
    disabled: false,
    readonly: false,
    outlined: false,
    labelBehavior: undefined,
  });

  const idBase =
    (Vue as typeof Vue & { useId?: () => string }).useId?.()
    || `e-field-${instance.uid}`;
  const id = `${idBase}-input`;

  const initialValue = ref(props.modelValue);
  const dirty = ref(false);
  const touched = ref(false);
  const validated = ref(false);
  const hovered = ref(false);
  const focused = ref(false);
  const tableClasses = ref<Array<string>>([]);

  const helperMessage = computed(() => props.detail || "");
  const externalErrorMessage = computed(() => props.detailErrors?.[0] || "");
  const hasValue = computed(() => hasFieldValue(props.modelValue));

  const effectiveLabelBehavior = computed<FieldLabelBehavior | undefined>(() => {
    return props.labelBehavior || configuration.labelBehavior;
  });

  const isLabelInline = computed(() => effectiveLabelBehavior.value === "inline");
  const isLabelFloating = computed(() => effectiveLabelBehavior.value === "floating");
  const isFocusWithin = computed(() => focused.value || Boolean(props.focusWithin));
  const shouldFloatLabel = computed(() => isLabelFloating.value && (isFocusWithin.value || hasValue.value));
  const shouldShowValidation = computed(() => dirty.value || touched.value || validated.value);

  const labelClass = computed(() => [
    "e-label",
    "e-field__label",
    isLabelFloating.value && "e-label--floating",
    shouldFloatLabel.value && "e-label--floated",
  ]);

  const validationMessage = computed(() => {
    const rules = props.rules || [];

    for (const rule of rules) {
      const result = rule(props.modelValue);
      if (result !== true) return result;
    }

    return "";
  });

  const errorMessage = computed(() => {
    return shouldShowValidation.value ? validationMessage.value : "";
  });

  const hasValidationError = computed(() => Boolean(errorMessage.value));
  const hasExternalError = computed(() => Boolean(externalErrorMessage.value));
  const hasError = computed(() => hasExternalError.value || hasValidationError.value);

  const displayMessage = computed(() => {
    if (externalErrorMessage.value) return externalErrorMessage.value;
    if (errorMessage.value) return errorMessage.value;
    if (props.detailsOnMessageOnly) return "";
    return helperMessage.value;
  });

  const details = computed(() => displayMessage.value);
  const showDetails = computed(() => !!details.value);
  const isDisabled = computed(() => Boolean(props.disabled || configuration.disabled));
  const isReadonly = computed(() => Boolean(props.readonly || configuration.readonly));
  const isOutlined = computed(() => Boolean(props.outlined || configuration.outlined));
  const isDense = computed(() => Boolean(props.dense || configuration.dense));

  const color = computed(() => {
    let result = props.color || configuration.color || "";

    if (isDisabled.value) result = "disabled";
    if (hasError.value) result = "error";

    return result;
  });

  const { colorStyles } = useResolvedColor({
    color,
    colorVar: "--e-field-color",
    contrastVar: "--e-field-contrast",
  });

  const labelStyle = computed<Record<string, string>>(() => {
    const minWidth = normalizeCssSize(props.labelMinWidth);

    return {
      ...configuration.labelStyle,
      ...(minWidth ? { minWidth } : {}),
    };
  });

  const fieldStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = { ...colorStyles.value };

    if ((props.retainColor || configuration.retainColor) && result["--e-field-color"]) {
      result["--e-field-rest-color"] = result["--e-field-color"];
    }

    return result;
  });

  const getInstanceRootElement = (): HTMLElement | undefined => {
    const element = instance.vnode.el;
    return element instanceof HTMLElement ? element : undefined;
  };

  const getFocusableElement = (): FocusableElement | undefined => {
    const rootElement = getInstanceRootElement();

    if (!rootElement) return undefined;

    return getFocusableElementInRoot(rootElement, [
      `#${id}`,
      `#${id}-hours`,
      `#${id}-minutes`,
      "input",
      "textarea",
      "select",
      "button",
      '[tabindex]:not([tabindex="-1"])',
    ]);
  };

  const syncFocusedState = (element?: FocusableElement): void => {
    focused.value = element ? isDomFocused(element) : false;
  };

  const focus = (event?: FocusEvent): void => {
    const eventTarget = event ? resolveFocusableElement(event.target) : undefined;
    const element = eventTarget || getFocusableElement();

    if (eventTarget) {
      syncFocusedState(eventTarget);
    } else if (element) {
      element.focus();
      syncFocusedState(element);
    } else {
      focused.value = true;
    }

    if (event) emit("focus", event);
  };

  const blur = (): void => {
    const element = getFocusableElement();

    if (element?.blur) {
      element.blur();
    }

    syncFocusedState();
  };

  const handleFocus = (event?: FocusEvent): void => {
    focus(event);
  };

  const handleBlur = (event?: Event): void => {
    focused.value = false;
    touched.value = true;

    if (event) emit("blur", event);
  };

  const handleHover = (value: boolean): void => {
    hovered.value = value;
  };

  const isInteractiveFrameTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false;

    return Boolean(target.closest([
      "input",
      "textarea",
      "select",
      "button",
      "a[href]",
      "label",
      "[contenteditable='true']",
      "[role='button']",
      "[role='link']",
      "[role='option']",
      "[role='checkbox']",
      "[role='radio']",
      "[data-field-control-ignore-focus]",
    ].join(", ")));
  };

  const handleFrameMousedown = (event: MouseEvent): void => {
    if (isDisabled.value) return;
    if (isInteractiveFrameTarget(event.target)) return;

    event.preventDefault();
    focus();
  };

  const handleFrameClick = (event: MouseEvent): void => {
    if (isDisabled.value) return;
    if (isInteractiveFrameTarget(event.target)) return;

    focus();
  };

  const setConfiguration = (value: FieldConfiguration): void => {
    configuration.labelStyle = value.labelStyle ? { ...value.labelStyle } : {};
    configuration.color = value.color;
    configuration.retainColor = Boolean(value.retainColor);
    configuration.dense = Boolean(value.dense);
    configuration.disabled = Boolean(value.disabled);
    configuration.readonly = Boolean(value.readonly);
    configuration.outlined = Boolean(value.outlined);
    configuration.labelBehavior = value.labelBehavior;
  };

  const setTableClasses = (value: Array<string>): void => {
    tableClasses.value = [...value];
  };

  const validate = (): boolean => {
    validated.value = true;
    touched.value = true;
    return !hasError.value;
  };

  const resetValidation = (): void => {
    touched.value = false;
    validated.value = false;
  };

  const reset = (): void => {
    initialValue.value = props.modelValue;
    dirty.value = false;
    resetValidation();
  };

  const getGridColConfiguration = (): Pick<FormTableChild, "cols" | "xs" | "sm" | "md" | "lg" | "xl"> => ({
    cols: props.cols,
    xs: props.xs,
    sm: props.sm,
    md: props.md,
    lg: props.lg,
    xl: props.xl,
  });

  watch(
    () => props.modelValue,
    (value) => {
      dirty.value = !Object.is(value, initialValue.value);
    },
  );

  watch(hasError, (value) => {
    form?.updateField?.({ hasError: value, uid: instance.uid });
  });

  watch(
    () => [props.cols, props.xs, props.sm, props.md, props.lg, props.xl] as const,
    () => {
      form?.updateTableChild?.({ uid: instance.uid, ...getGridColConfiguration() });
    },
  );

  const { gridColClass } = useGridCol(props);

  const labelId = computed(() => `${id}-label`);
  const hasSupportingText = computed(() => {
    return showDetails.value || Boolean(slots.details);
  });
  const detailsId = computed(() => {
    return hasSupportingText.value ? `${id}-details` : undefined;
  });

  const rootClass = computed(() => [
    "e-field",
    "e-field--next",
    isDense.value && fieldVariantClasses.dense,
    isOutlined.value && fieldVariantClasses.outlined,
    isLabelInline.value && fieldVariantClasses.labelInline,
    isLabelFloating.value && fieldVariantClasses.labelFloating,
    isDisabled.value && fieldStateClasses.disabled,
    isReadonly.value && fieldStateClasses.readonly,
    hasError.value && fieldStateClasses.hasError,
    hasValue.value && fieldStateClasses.hasValue,
    hovered.value && fieldStateClasses.hovered,
    isFocusWithin.value && fieldStateClasses.focusWithin,
    shouldFloatLabel.value && fieldStateClasses.labelFloated,
    (props.retainColor || configuration.retainColor) && fieldStateClasses.retainColor,
    focused.value && fieldStateClasses.focused,
    ...tableClasses.value,
    ...gridColClass.value,
  ].filter(Boolean));

  onMounted(() => {
    form?.bindField?.({
      uid: instance.uid,
      focus,
      validate,
      reset,
      resetValidation,
      setConfiguration,
    });

    form?.bindTableChild?.({
      uid: instance.uid,
      setTableClasses,
      ...getGridColConfiguration(),
    });

    form?.updateField?.({ uid: instance.uid, hasError: hasError.value });
  });

  onUnmounted(() => {
    form?.unbindField?.(instance.uid);
    form?.unbindTableChild?.(instance.uid);
  });

  const slotProps = computed(() => ({
    color: color.value,
    slotClass: "e-field__slot",
    frameEl: frameEl.value,
    handleBlur,
    handleFocus,
    inputId: id,
    detailsId: detailsId.value,
    fieldIdBase: idBase,
    hasError: hasError.value,
    isDisabled: isDisabled.value,
    isFocusWithin: isFocusWithin.value,
    isLabelFloating: isLabelFloating.value,
    isReadonly: isReadonly.value,
    shouldFloatLabel: shouldFloatLabel.value,
  }));

  const appendInnerSlotProps = computed(() => ({
    color: color.value,
    hasError: hasError.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
  }));

  const detailsSlotProps = computed(() => ({
    details: details.value,
    detailsId: detailsId.value,
    hasError: hasError.value,
    showDetails: showDetails.value,
  }));

  return {
    uid: instance.uid,
    frameEl,
    dirty,
    hasError,
    rootClass,
    fieldStyle,
    hasPrependContent,
    hasPrependSlot,
    hasAppendContent,
    hasAppendSlot,
    hasPrependInnerContent,
    hasPrependInnerSlot,
    hasAppendInnerContent,
    hasAppendInnerSlot,
    handleHover,
    handleFrameMousedown,
    handleFrameClick,
    labelId,
    id,
    labelClass,
    labelStyle,
    slotProps,
    appendInnerSlotProps,
    detailsSlotProps,
    detailsId,
    details,
    showDetails,
    isOutlined,
    blur,
    focus,
    handleBlur,
    handleFocus,
    setConfiguration,
    setTableClasses,
    reset,
    resetValidation,
    validate,
  };
};

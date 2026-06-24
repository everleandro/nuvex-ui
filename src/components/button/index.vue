<template>
  <component v-ripple="rippleBinding" :is="tag" v-bind="rootAttributes" :class="btnClass" :style="buttonStyle"
    :aria-disabled="isDisabledForInteraction" :aria-busy="props.loading" :aria-label="ariaLabelComputed"
    @pointerenter="handleHover(true)" @pointerleave="handleHover(false)" @focusin="handleFocus(true)"
    @focusout="handleFocus(false)" @keydown="handleKeydown" @keyup="handleKeyup">
    <span v-show="props.loading" class="e-btn__loader">
      <slot name="loading">
        <EProgressCircular :aria-hidden="false" :size="23" :stroke-width="3.8095238095238093" />
      </slot>
    </span>
    <span v-if="prependIcon" class="e-btn__prepend">
      <EIcon v-bind="iconSize" :icon="prependIcon" />
    </span>
    <span class="e-btn__content">
      <slot name="default">
        <template v-if="icon || fab">
          <EIcon v-bind="iconSize" :icon="icon" />
        </template>
      </slot>
    </span>
    <span v-if="appendIcon" class="e-btn__append">
      <EIcon v-bind="iconSize" :icon="appendIcon" />
    </span>
  </component>
</template>
<script lang="ts" setup>
import {
  IconProps,
  IconPath,
  ElevationLevel,
  SizeProps,
} from "@/types";
import { useResolvedColor } from "@/composables/color";
import { ripple } from "@/directives";
import EIcon from "@/components/icon/index.vue";
import EProgressCircular from "@/components/progress/circular.vue";
import { getBooleanClasses, normalizeDimension } from "@/composables/utils";

import { reactive, useAttrs, computed, useSlots } from "vue";
const vRipple = { ...ripple };

type ButtonElevation = ElevationLevel | "none";

export interface ButtonProps extends SizeProps {
  disabled?: boolean;
  link?: boolean;
  ripple?: boolean;
  appendIcon?: Array<IconPath> | IconPath | string;
  prependIcon?: Array<IconPath> | IconPath | string;
  ariaLabel?: string;
  loading?: boolean;
  color?: string;
  hoverColor?: string;
  fab?: boolean;
  elevation?: ButtonElevation;
  text?: boolean;
  outlined?: boolean;
  useContrastColor?: boolean;
  block?: boolean;
  type?: string;
  rounded?: boolean;
  stacked?: boolean;
  icon?: Array<IconPath> | IconPath | string;
  height?: string | number;
  width?: string | number;
}

const configuration = reactive({
  hovered: false,
  focused: false,
});
const attrs = useAttrs();
const props = withDefaults(defineProps<ButtonProps>(), {
  ripple: true,
});

const booleanClassKeys = [
  "disabled",
  "text",
  "fab",
  "block",
  "loading",
  "outlined",
  "rounded",
  "stacked",
] as const;

const iconSize = computed((): Partial<IconProps> => ({ size: props.size }));
const slots = useSlots();

const tag = computed(() => {
  if (props.link) return "a";
  const { to } = attrs;
  if (typeof to === "string" && to.startsWith("http")) return "a";
  if (to) return "router-link";
  return "button";
});

const isDisabledForInteraction = computed(() => props.disabled || props.loading);
const hasDefaultSlot = computed(() => Boolean(slots.default));
const isIconOnly = computed(
  () => !hasDefaultSlot.value && (!!props.icon || props.fab)
);
const hasNavigationTarget = computed(
  () => typeof attrs.href === "string" || attrs.to !== undefined
);
const requiresButtonKeyboardSemantics = computed(
  () => tag.value === "a" && !hasNavigationTarget.value
);

const rippleBinding = computed(() => ({
  disabled: !props.ripple || isDisabledForInteraction.value,
}));

const rootAttributes = computed(() => {
  const { to, href, ...restAttrs } = attrs;

  if (tag.value === "button") {
    return {
      ...restAttrs,
      type: props.type || "button",
      disabled: isDisabledForInteraction.value,
    };
  }

  if (tag.value === "a") {
    const resolvedHref =
      typeof href === "string"
        ? href
        : typeof to === "string" && to.startsWith("http")
          ? to
          : undefined;

    return {
      ...restAttrs,
      ...(requiresButtonKeyboardSemantics.value
        ? {
          role: "button",
          tabindex: isDisabledForInteraction.value ? -1 : 0,
        }
        : {}),
      ...(to && typeof to !== "string" ? { to } : {}),
      ...(resolvedHref ? { href: resolvedHref } : {}),
    };
  }

  return {
    ...restAttrs,
    ...(to ? { to } : {}),
    ...(href ? { href } : {}),
  };
});

const ariaLabelComputed = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;

  const attrsAriaLabel = attrs["aria-label"];
  if (typeof attrsAriaLabel === "string") return attrsAriaLabel;

  const title = attrs.title;
  if (isIconOnly.value && typeof title === "string") return title;

  return undefined;
});

const btnClass = computed((): Array<string> => {
  const classes = ["e-btn"];

  if (configuration.focused) {
    classes.push("e-btn--focused");
  }

  // Handle size
  const currentSize = props.size || "default";
  classes.push(`e-btn--size-${currentSize}`);

  // Handle boolean classes
  classes.push(...getBooleanClasses(props, booleanClassKeys, "e-btn"));

  if (props.useContrastColor || (!props.color && (props.text || props.outlined))) {
    classes.push("e-btn--use-contrast-color");
  }

  if (isIconOnly.value) {
    classes.push("e-btn--icon");
  }

  // Handle elevation
  if (props.elevation && props.elevation !== "none" && !props.text && !props.outlined) {
    classes.push(`e-elevation--${props.elevation}`);
  } else if (props.elevation === undefined && !props.text && !props.outlined) {
    classes.push("e-btn--elevated");
  }

  return classes;
});
const handleHover = (value: boolean) => {
  if (isDisabledForInteraction.value) return;
  configuration.hovered = value;
};

const handleFocus = (value: boolean) => {
  configuration.focused = value;
};

const triggerSyntheticClick = (event: KeyboardEvent) => {
  if (isDisabledForInteraction.value || !requiresButtonKeyboardSemantics.value) {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLElement | null)?.click();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    triggerSyntheticClick(event);
  }

  if (event.key === " " && requiresButtonKeyboardSemantics.value) {
    event.preventDefault();
  }
};

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === " ") {
    triggerSyntheticClick(event);
  }
};

const getCurrentColor = (): string | undefined => {
  if (configuration.hovered && props.hoverColor) return props.hoverColor;
  return props.color;
};

const currentColor = computed(() => getCurrentColor());

const { colorStyles } = useResolvedColor({
  color: currentColor,
  colorVar: "--e-btn-color",
  contrastVar: "--e-btn-contrast-color",
});

const buttonStyle = computed((): Record<string, string> => {
  const result: Record<string, string> = { ...colorStyles.value };
  const height = normalizeDimension(props.height);
  const width = normalizeDimension(props.width);

  if (height) {
    result.height = height;
  }

  if (width) {
    result.width = width;
  }

  return result;
});
</script>

<style lang="scss" src="./style.scss"></style>

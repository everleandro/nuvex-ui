<template>
  <component
    ref="drawerElement"
    :is="tag"
    :class="drawerClass"
    data-layout="true"
    :style="mergedStyle"
    :tabindex="overlayActive ? -1 : undefined"
    :role="overlayActive ? 'dialog' : undefined"
    :aria-modal="overlayActive ? 'true' : undefined"
    @keydown="handleDrawerKeydown"
  >
    <div
      class="e-drawer__content"
      :style="{
        width: props.floating ? `calc(${computedWidth} - 24px)` : computedWidth,
      }"
    >
      <div v-if="right" class="e-drawer__border"></div>
      <div v-if="slots.prepend" class="e-drawer__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="e-drawer__body">
        <slot></slot>
      </div>
      <div v-if="!right" class="e-drawer__border"></div>
      <div v-if="slots.append" class="e-drawer__append">
        <slot name="append"></slot>
      </div>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, useSlots } from "vue";
import { useLayout, useOverlayService } from "@/composables";
import { DrawerClassKeys, DrawerProps } from "@/types";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

const slots = useSlots();
const { setDrawerLayout, resetDrawerLayout, drawerLayoutStyle } = useLayout();
const { openOverlay, closeOverlay, getStackZIndex, updateOverlayContentElement } = useOverlayService();

let mdBreakpoint = ref(false);
const drawerElement = ref<HTMLElement | null>(null)
const props = withDefaults(defineProps<DrawerProps>(), {
  autoFocus: true,
  restoreFocus: true,
  width: 16,
  widthUnit: "rem",
  elevation: "sm",
  appearance: "default",
});
let mediaQueryList: MediaQueryList | null = null;
const overlayId = `drawer-overlay-${Math.random().toString(36).slice(2)}`;

const availableRootClasses: Record<DrawerClassKeys, string> = {
  disabled: "e-drawer--disabled",
  right: "e-drawer--right",
  fixed: "e-drawer--fixed",
  floating: "e-drawer--floating",
  modelValue: "e-drawer--open",
};

const absoluteComputed = computed(() => {
  if (props.devMode) return props.absolute;
  return props.absolute || mdBreakpoint.value;
});
const tag = computed(() => (props.nav ? "nav" : "aside"));
const side = computed(() => (props.right ? "right" : "left"));
const overlayActive = computed(
  () => !!props.modelValue && !!absoluteComputed.value
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

onMounted(() => {
  observeBreakpoint();

  if (props.modelValue && mdBreakpoint.value && !props.devMode) {
    changeValue(false);
  }
});

onUnmounted(() => {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener("change", onBreakpointChange);
    mediaQueryList = null;
  }

  closeOverlay(overlayId);
  resetDrawerLayout(side.value);
});

const drawerClass = computed((): Array<string> => {
  const classes = ["e-drawer"];
  const availableRootClassKeys = Object.keys(
    availableRootClasses
  ) as Array<DrawerClassKeys>;
  absoluteComputed.value && classes.push("e-drawer--absolute");
  !props.modelValue && classes.push("e-drawer--close");

  const classes2 = availableRootClassKeys
    .filter((key) => !!props[key])
    .map((key) => availableRootClasses[key]);

  classes.push(`e-drawer--${props.appearance}`);

  if ((absoluteComputed.value || props.floating) && props.elevation) {
    classes.push(`e-elevation--${props.elevation}`);
  }

  return [...classes, ...classes2];
});
const computedWidth = computed(() => {
  if (typeof props.width === "number") {
    return `${props.width}${props.widthUnit}`;
  }

  const trimmedWidth = props.width.trim();
  if (/^\d+(\.\d+)?$/.test(trimmedWidth)) {
    return `${trimmedWidth}${props.widthUnit}`;
  }

  return trimmedWidth;
});

function refreshLayoutStyle(): void {
  setDrawerLayout({
    side: side.value,
    enabled: true,
    open: !!props.modelValue,
    width: computedWidth.value,
    absolute: !!absoluteComputed.value,
    floating: !!props.floating,
    fixed: !!props.fixed,
  });
}

watch(
  () => [props.modelValue, props.right, computedWidth.value, absoluteComputed.value],
  () => {
    refreshLayoutStyle();
  },
  { immediate: true }
);

watch(
  () => props.right,
  (isRight, wasRight) => {
    if (isRight === wasRight) return

    resetDrawerLayout(wasRight ? "right" : "left")
    refreshLayoutStyle()
  }
)

const changeValue = (value: boolean): void => {
  emit("update:modelValue", value);
};

const onBreakpointChange = (event: MediaQueryListEvent): void => {
  mdBreakpoint.value = event.matches;
};

const observeBreakpoint = (): void => {
  const mdValue = getComputedStyle(document.body).getPropertyValue("--md").trim();
  const parsedMd = parseInt(mdValue, 10);
  const mdBreakpointValue = Number.isNaN(parsedMd) ? 960 : parsedMd;

  mediaQueryList = window.matchMedia(`(max-width: ${mdBreakpointValue}px)`);
  mdBreakpoint.value = mediaQueryList.matches;
  mediaQueryList.addEventListener("change", onBreakpointChange);
};

function handleOutside(): void {
  if (absoluteComputed.value && props.modelValue) {
    changeValue(false);
  }
}

watch(
  () => overlayActive.value,
  (isActive) => {
    if (isActive) {
      openOverlay({
        id: overlayId,
        dismissible: true,
        lockScroll: true,
        autoFocus: props.autoFocus,
        restoreFocus: props.restoreFocus,
        contentElement: drawerElement.value,
        onOutsideClick: handleOutside,
        onEscape: handleOutside,
      });
      return;
    }

    closeOverlay(overlayId);
  },
  { immediate: true }
);

watch(() => [overlayActive.value, drawerElement.value] as const, ([isActive, contentElement]) => {
  if (!isActive || !contentElement) return

  updateOverlayContentElement(overlayId, contentElement)
}, { flush: 'post' })

const getFocusableElements = (): HTMLElement[] => {
  const root = drawerElement.value
  if (!root) return []

  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    if (!element.isConnected) return false
    if (element.getAttribute('aria-hidden') === 'true') return false
    if ((element as HTMLButtonElement).disabled) return false
    if (element.tabIndex < 0) return false
    if (element.hasAttribute('hidden')) return false
    return element.getClientRects().length > 0
  })
}

const handleDrawerKeydown = (evt: KeyboardEvent): void => {
  if (!overlayActive.value || evt.key !== 'Tab') return

  const container = drawerElement.value
  if (!container) return

  const focusableElements = getFocusableElements()

  if (!focusableElements.length) {
    evt.preventDefault()
    container.focus()
    return
  }

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]
  const activeElement = document.activeElement as HTMLElement | null
  const isContainerFocused = activeElement === container
  const focusInsideDrawer = !!activeElement && container.contains(activeElement)

  if (!focusInsideDrawer) {
    evt.preventDefault()
    ;(evt.shiftKey ? lastFocusable : firstFocusable).focus()
    return
  }

  if (!evt.shiftKey && (isContainerFocused || activeElement === lastFocusable)) {
    evt.preventDefault()
    firstFocusable.focus()
    return
  }

  if (evt.shiftKey && (isContainerFocused || activeElement === firstFocusable)) {
    evt.preventDefault()
    lastFocusable.focus()
  }
}

const style = computed((): Record<string, string> => {
  const translateX = props.modelValue ? "0%" : `${props.right ? "" : "-"}100%`;
  const result: Record<string, string> = {
    height: "100%",
    top: "0px",
    transform: `translateX(${translateX})`,
  };

  const drawerZIndex = getStackZIndex(overlayId, 1)

  if (drawerZIndex !== null) {
    result.zIndex = `${drawerZIndex}`
  }

  return { ...result };
});

const mergedStyle = computed((): Record<string, string> => ({
  ...drawerLayoutStyle.value,
  ...style.value,
}));
</script>
<style lang="scss" src="./style.scss"></style>
